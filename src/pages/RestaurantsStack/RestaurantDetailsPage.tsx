/* eslint-disable react-native/no-inline-styles */
import I18n from 'resources/localization/I18n';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import { Restaurant } from 'src/models/restaurants';
import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import Header from 'src/components/Headers/Header';
import { RouteProp } from '@react-navigation/native';
import { RestaurantsStackParamList } from 'src/navigation/RestaurantsStack';
import BorderedRadiusButton from 'src/components/Buttons/BorderedRadiusButton';
import AppImages from 'src/resources/common/AppImages';
import RestaurantInfosItem from 'src/components/Restaurants/RestaurantInfosItem';
import { BookingConsumer } from 'src/store/BookingContext';
import RoutesNames from 'src/navigation/RoutesNames';
import BookingModal from 'src/components/Booking/BookingModal';
import { screenHeight } from 'src/utils/constants';
import { openOverlayMessageScreen } from 'src/components/Modal/SubscriptionSuggestionModal';

type RestaurantDetailsRouteProp = RouteProp<
  RestaurantsStackParamList,
  'RestaurantDetailsPage'
>;

type RestaurantDetailsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: RestaurantDetailsRouteProp;
  setSelectedRestaurant: Function;
  setRestauAlreadySet: Function;
  alreadySubscribed: boolean;
  hasBasket?: boolean;
  setReturnToBasketVisible?: Function;
};

function RestaurantDetailsPage({
  navigation,
  route,
  setSelectedRestaurant,
  setRestauAlreadySet,
  alreadySubscribed,
  hasBasket,
  setReturnToBasketVisible
}: RestaurantDetailsPageProps) {
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    route.params &&
      route.params.restaurant &&
      setRestaurant(route.params.restaurant);
    route.params && route.params.openBookingModal
      ? setModalOpened(route.params.openBookingModal)
      : modalOpened && setModalOpened(false);
  }, [route.params]);

  if (!restaurant) {
    return (
      <ActivityIndicator style={styles.indicator} color={colors.lightGrey} />
    );
  } else {
    return (
      <>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Header backIcon navigation={navigation} />
          </View>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <RestaurantInfosItem
              restaurant={restaurant}
              onPressOrder={async () => {
                if (alreadySubscribed) {
                  setRestauAlreadySet(true);
                  setSelectedRestaurant(restaurant);
                  await setModalOpened(true);
                } else {
                  openOverlayMessageScreen();
                }
              }}
            />
            <BorderedRadiusButton
              text={I18n.t('restaurants.order')}
              onPress={async () => {
                if (hasBasket) {
                  setReturnToBasketVisible && setReturnToBasketVisible(true);
                } else {
                  setRestauAlreadySet(true);
                  setSelectedRestaurant(restaurant);
                  navigation.navigate(RoutesNames.ModalOrderNavigator);
                }
              }}
              borderBottomLeft
              customStyle={styles.orderButton}
              icon={AppImages.images.order}
            />
            <View style={styles.contentContainer}>
              <Text style={styles.text}>{restaurant.description}</Text>
            </View>
          </ScrollView>
        </View>
        <KeyboardAvoidingView
          style={{
            maxHeight: modalOpened ? screenHeight - 100 : 0,
            minHeight: modalOpened ? screenHeight - 100 : 0,
            marginTop: modalOpened ? 100 : 0
          }}
        >
          <BookingModal
            open={modalOpened}
            onClose={() => setModalOpened(false)}
          />
        </KeyboardAvoidingView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: 200
  },
  contentContainer: {
    marginBottom: 40,
    paddingHorizontal: 25,
    paddingTop: 30
  },
  header: { position: 'absolute', top: 0, zIndex: 1 },
  indicator: {
    marginTop: 150
  },
  mainContainer: { flex: 1 },
  orderButton: {
    marginLeft: 90
  },
  text: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 7
  }
});

export default (
  props: JSX.IntrinsicAttributes & RestaurantDetailsPageProps
) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          ctx &&
          bookCtx && (
            <RestaurantDetailsPage
              setSelectedRestaurant={bookCtx.setSelectedRestaurant}
              setRestauAlreadySet={bookCtx.setRestauAlreadySet}
              alreadySubscribed={ctx.alreadySubscribed}
              hasBasket={bookCtx.hasBasket}
              setReturnToBasketVisible={bookCtx.setReturnToBasketVisible}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
