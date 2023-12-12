import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import colors from 'src/resources/common/colors';
import TouchableIcon from 'src/components/Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import I18n from 'resources/localization/I18n';
import AccountItem from 'src/components/Items/AccountItem';
import userApi from 'src/services/user/userApi';
import RoutesNames from 'src/navigation/RoutesNames';
import { cguLink, contactMail } from 'src/utils/constants';
import { openOverlayMessageScreen } from 'src/components/Modal/SubscriptionSuggestionModal';
import AvatarComponent from 'src/components/Avatar/AvatarComponent';
import { visitPage } from 'src/services/analytics/analytics';
import { PaymentConsumer } from 'src/store/PaymentContext';

type AccountPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  user: UserData;
  disconnect: Function;
  storeUser: Function;
  alreadySubscribed: boolean;
  subscriptionEnd: string;
};

function AccountPage({
  navigation,
  user,
  disconnect,
  storeUser,
  alreadySubscribed,
  subscriptionEnd
}: AccountPageProps) {
  const { hasExpiredCard } = useContext(PaymentConsumer);

  useEffect(() => {
    getUserInfos();
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      visitPage('Page profil');
    });
  }, [navigation]);

  async function getUserInfos() {
    const infos = await userApi.getUserInfos();
    if (!infos.error) {
      storeUser(infos);
    }
  }

  async function deleteAccount() {
    const infos = await userApi.deleteAccount();
    if (!infos.error) {
      disconnect();
    }
  }

  return (
    <>
      <TouchableIcon
        icon={AppImages.images.editIcon}
        height={20}
        width={20}
        style={styles.editIcon}
        onPress={() => navigation.navigate(RoutesNames.EditProfilePage)}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <AvatarComponent />
          <Text style={styles.name}>
            {user &&
              user.firstname &&
              user.lastname &&
              `${user.firstname} ${user.lastname}`}
          </Text>
          {!alreadySubscribed && (
            <Text style={styles.description}>
              {I18n.t('account.avatarSub')}
            </Text>
          )}
        </View>
        <View style={styles.paddingView}>
          <AccountItem
            text={I18n.t('account.history')}
            image={AppImages.images.history}
            backgroundColor={colors.paleOrange16}
            onPress={() => {
              navigation.navigate(RoutesNames.OrderHistoryPage);
            }}
          />
          {alreadySubscribed && (
            <AccountItem
              text={I18n.t('account.booking')}
              image={AppImages.images.booking}
              backgroundColor={colors.paleOrange16}
              onPress={() => {
                navigation.navigate(RoutesNames.BookingHistoryPage);
              }}
              imgStyle={styles.orangeImg}
            />
          )}
          <AccountItem
            text={I18n.t('account.foodChoices')}
            image={AppImages.images.pizza}
            backgroundColor={colors.deepRose16}
            onPress={() => {
              if (alreadySubscribed) {
                navigation.navigate(RoutesNames.PreferencesPage);
              } else {
                openOverlayMessageScreen();
              }
            }}
            customStyle={styles.marginSup}
            imgStyle={styles.redImg}
          />
          <AccountItem
            text={I18n.t('account.subscription')}
            image={AppImages.images.medal}
            backgroundColor={colors.deepRose16}
            onPress={() => {
              navigation.navigate(RoutesNames.SubscriptionDescriptionPage, {
                showHeader: true,
                fromAccount: true,
                // eslint-disable-next-line @typescript-eslint/camelcase
                previous_screen: 'Profil'
              });
            }}
            imgStyle={styles.redImg}
            badge
            badgeColor={
              subscriptionEnd
                ? colors.paleOrange
                : alreadySubscribed
                ? colors.green
                : colors.red
            }
          />
          {/* <AccountItem
          text={I18n.t('account.childAccount')}
          image={AppImages.images.child}
          backgroundColor={colors.deepRose16}
          onPress={() => {
            return;
          }}
        /> */}
          <AccountItem
            text={I18n.t('account.savedCards')}
            image={AppImages.images.card}
            backgroundColor={colors.greenyBlue16}
            onPress={() => {
              navigation.navigate(RoutesNames.SavedCardsPage);
            }}
            customStyle={styles.marginSup}
            badge={hasExpiredCard}
          />
          <AccountItem
            text={I18n.t('account.cguCgv')}
            image={AppImages.images.cgu}
            backgroundColor={colors.black}
            onPress={async () => {
              try {
                await WebBrowser.openBrowserAsync(cguLink);
              } catch (error) {}
            }}
            customStyle={styles.marginSup}
          />
          <AccountItem
            text={I18n.t('account.contact')}
            image={AppImages.images.mailBox}
            backgroundColor={colors.black}
            onPress={async () => {
              Linking.openURL('mailTo:' + contactMail);
            }}
          />
          <AccountItem
            text={I18n.t('account.delete')}
            image={AppImages.images.quit}
            backgroundColor={colors.deepRose16}
            onPress={async () => {
              Alert.alert(
                I18n.t('account.delete'),
                I18n.t('account.deleteConfirm'),
                [
                  { text: I18n.t('app.cancel'), style: 'cancel' },
                  { text: I18n.t('app.ok'), onPress: deleteAccount }
                ]
              );
            }}
            imgStyle={styles.redImg}
          />
          <AccountItem
            text={I18n.t('account.disconnect')}
            image={AppImages.images.quit}
            backgroundColor={colors.black}
            onPress={() => disconnect()}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
  },
  description: {
    color: colors.lightGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 8,
    textAlign: 'center'
  },
  editIcon: {
    position: 'absolute',
    right: 14,
    top: Constants.statusBarHeight + 13,
    zIndex: 1
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
    paddingHorizontal: 60,
    paddingTop: Constants.statusBarHeight + 61
  },
  marginSup: {
    marginTop: 18
  },
  name: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginTop: 12,
    textAlign: 'center'
  },
  orangeImg: { tintColor: colors.paleOranges },
  paddingView: {
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: 25,
    paddingTop: 46
  },
  redImg: { tintColor: colors.deepRose }
});

export default (props: JSX.IntrinsicAttributes & AccountPageProps) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <AccountPage
          user={ctx.user}
          disconnect={ctx.disconnect}
          storeUser={ctx.storeUser}
          alreadySubscribed={ctx.alreadySubscribed}
          subscriptionEnd={ctx.subscriptionEnd}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
