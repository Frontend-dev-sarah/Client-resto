import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';

import I18n from 'resources/localization/I18n';
import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import { screenWidth } from 'src/utils/constants';
import { navigatorRef } from 'src/navigation/RootNavigator';
import { BookingConsumer } from 'src/store/BookingContext';
import { PlaceChoice } from 'src/models/restaurants';
import RoutesNames from 'src/navigation/RoutesNames';
import { AuthConsumer } from 'src/store/AuthContext';
import { openOverlayMessageScreen } from '../Modal/SubscriptionSuggestionModal';
import { UserData } from 'src/models/user';
import ConnectionModal from '../Modal/ConnectionModal';

type TableMenuProps = {
  placeChoice?: PlaceChoice;
  setPlaceChoice?: Function;
  fromHome?: boolean; // fromHome is usefull to know if we have to display orange border when selected option
  alreadySubscribed?: boolean;
  user?: UserData;
  userIsEating?: boolean;
  hasBasket?: boolean;
  setReturnToBasketVisible?: Function;
  basketPlaceChoice?: PlaceChoice;
  setBasketPlaceChoice?: Function;
};

function TableMenu({
  placeChoice,
  setPlaceChoice,
  fromHome,
  alreadySubscribed,
  user,
  userIsEating,
  hasBasket,
  setReturnToBasketVisible,
  basketPlaceChoice,
  setBasketPlaceChoice
}: TableMenuProps) {
  const [loginModalVisible, setLoginModalVisible] = useState<boolean>(false);

  async function goToOrderNavigator() {
    if (fromHome) {
      await navigatorRef.current.navigate(RoutesNames.ModalOrderNavigator);
    }
  }

  return (
    <View style={styles.container}>
      <ConnectionModal
        visible={loginModalVisible}
        hideModal={() => setLoginModalVisible(false)}
        onPress={() =>
          navigatorRef.current.navigate(RoutesNames.PaymentModalNavigator, {
            screen: RoutesNames.LoginPage
          })
        }
      />
      <TouchableRipple
        style={[
          styles.card,
          !fromHome && placeChoice === 'takeAway' && styles.borderActive
        ]}
        onPress={() => {
          if (hasBasket) {
            setReturnToBasketVisible && setReturnToBasketVisible(true);
          } else if (userIsEating) {
            navigatorRef.current.navigate(RoutesNames.OrderOnSiteSummaryPage);
          } else {
            goToOrderNavigator();
            setPlaceChoice && setPlaceChoice('takeAway');
            setBasketPlaceChoice && setBasketPlaceChoice('takeAway');
          }
        }}
      >
        <>
          {fromHome && hasBasket && basketPlaceChoice === 'takeAway' && (
            <View style={styles.basketBadge} />
          )}
          <View>
            <Image
              source={AppImages.images.basketIcon2}
              style={[
                styles.img,
                !fromHome && placeChoice === 'takeAway'
                  ? styles.activeColorImg
                  : styles.inactiveColorImg
              ]}
            />
            <Text
              style={[
                styles.text,
                !fromHome && placeChoice === 'takeAway'
                  ? styles.activeColor
                  : styles.inactiveColor
              ]}
            >
              {I18n.t('booking.takeAway')}
            </Text>
          </View>
        </>
      </TouchableRipple>
      <TouchableRipple
        style={[
          styles.card,
          !fromHome && placeChoice === 'alreadyOnSite' && styles.borderActive
        ]}
        onPress={() => {
          if (hasBasket) {
            setReturnToBasketVisible && setReturnToBasketVisible(true);
          } else if (userIsEating) {
            navigatorRef.current.navigate(RoutesNames.OrderOnSiteSummaryPage);
          } else if (user) {
            goToOrderNavigator();
            setPlaceChoice && setPlaceChoice('alreadyOnSite');
            setBasketPlaceChoice && setBasketPlaceChoice('alreadyOnSite');
          } else {
            setLoginModalVisible(true);
          }
        }}
      >
        <>
          {fromHome && hasBasket && basketPlaceChoice === 'alreadyOnSite' && (
            <View style={styles.basketBadge} />
          )}
          <View>
            <Image
              source={AppImages.images.scanIcon}
              style={[
                styles.img,
                !fromHome && placeChoice === 'alreadyOnSite'
                  ? styles.activeColorImg
                  : styles.inactiveColorImg
              ]}
            />
            <Text
              style={[
                styles.text,
                !fromHome && placeChoice === 'alreadyOnSite'
                  ? styles.activeColor
                  : styles.inactiveColor
              ]}
            >
              {I18n.t('booking.alreadyOnSite')}
            </Text>
          </View>
        </>
      </TouchableRipple>
      <TouchableRipple
        style={[
          styles.card,
          !fromHome && placeChoice === 'bookOnSite' && styles.borderActive
        ]}
        onPress={() => {
          if (hasBasket) {
            setReturnToBasketVisible && setReturnToBasketVisible(true);
          }
          // else {
          //   Alert.alert(
          //     'Désolé',
          //     'Les précommandes sont désactivées pour le moment.',
          //     [{ text: I18n.t('app.ok'), style: 'cancel' }]
          //   );
          // }
          else if (userIsEating) {
            navigatorRef.current.navigate(RoutesNames.OrderOnSiteSummaryPage);
          } else if (alreadySubscribed) {
            goToOrderNavigator();
            setPlaceChoice && setPlaceChoice('bookOnSite');
            setBasketPlaceChoice && setBasketPlaceChoice('bookOnSite');
          } else if (!user) {
            setLoginModalVisible(true);
          } else {
            openOverlayMessageScreen();
          }
        }}
      >
        <>
          {fromHome && hasBasket && basketPlaceChoice === 'bookOnSite' && (
            <View style={styles.basketBadge} />
          )}
          <View>
            <Image
              source={AppImages.images.calendarIcon}
              style={[
                styles.img,
                !fromHome && placeChoice === 'bookOnSite'
                  ? styles.activeColorImg
                  : styles.inactiveColorImg
              ]}
            />
            <Text
              style={[
                styles.text,
                !fromHome && placeChoice === 'bookOnSite'
                  ? styles.activeColor
                  : styles.inactiveColor
              ]}
            >
              {I18n.t('booking.bookOnSite')}
            </Text>
          </View>
        </>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  basketBadge: {
    backgroundColor: colors.green,
    borderRadius: 15,
    height: 15,
    position: 'absolute',
    right: -5,
    top: -5,
    width: 15,
    zIndex: 1
  },
  activeColor: { color: colors.paleOrange },
  activeColorImg: { tintColor: colors.paleOrange },
  borderActive: {
    borderColor: colors.paleOrange,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1
  },
  card: {
    alignItems: 'center',
    borderColor: colors.white10,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 25,
    paddingHorizontal: screenWidth <= 320 ? 3 : 9,
    paddingVertical: 30,
    width: (screenWidth - 100) / 3
  },
  container: {
    backgroundColor: colors.darkGrey,
    flexDirection: 'row',
    marginBottom: -1,
    marginTop: -1,
    paddingBottom: 40,
    paddingLeft: 25,
    paddingTop: 41,
    zIndex: 0
  },
  img: {
    alignSelf: 'center',
    height: 20,
    width: 20
  },
  inactiveColor: { color: colors.white },
  inactiveColorImg: { tintColor: colors.white },
  text: {
    fontFamily: 'GothamMedium',
    fontSize: screenWidth <= 320 ? 10 : 12,
    letterSpacing: 0,
    lineHeight: screenWidth <= 320 ? undefined : 16,
    marginTop: 8,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & TableMenuProps) => (
  <AuthConsumer>
    {authCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <TableMenu
              placeChoice={ctx.placeChoice}
              setPlaceChoice={ctx.setPlaceChoice}
              alreadySubscribed={authCtx.alreadySubscribed}
              user={authCtx.user}
              userIsEating={ctx.userIsEating}
              hasBasket={ctx.hasBasket}
              setReturnToBasketVisible={ctx.setReturnToBasketVisible}
              basketPlaceChoice={ctx.basketPlaceChoice}
              setBasketPlaceChoice={ctx.setBasketPlaceChoice}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
