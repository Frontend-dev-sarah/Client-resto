import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';
import LottieView from 'lottie-react-native';
import activeSubscription from 'src/resources/lottie/activeSubscription.json';
import inactiveSubscription from 'src/resources/lottie/inactiveSubscription.json';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import CustomButton from 'src/components/Buttons/CustomButton';
import { cguLink } from 'src/utils/constants';
import BottomFab from 'src/components/Fabs/BottomFab';
import RoutesNames from 'src/navigation/RoutesNames';
import TouchableText from 'src/components/Buttons/TouchableText';
import { RouteProp } from '@react-navigation/native';
import { AccountStackParamList } from 'src/navigation/AccountStack';
import CardSelectorSlider from 'src/components/Payment/CardSelectorSlider';
import Appstyle from 'src/resources/common/Appstyle';
import { PaymentConsumer } from 'src/store/PaymentContext';
import { PaymentMethod } from 'src/models/payment';
import { navigatorRef } from 'src/navigation/RootNavigator';

type SubscriptionDescriptionPageRouteProp = RouteProp<
  AccountStackParamList,
  'SubscriptionDescriptionPage'
>;

type SubscriptionDescriptionPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: SubscriptionDescriptionPageRouteProp;
  paymentMethodList: PaymentMethod[];
  alreadySubscribed: boolean;
  subscriptionCard: PaymentMethod;
  subscriptionEnd: string;
};

function SubscriptionDescriptionPage({
  navigation,
  route,
  alreadySubscribed,
  subscriptionCard,
  subscriptionEnd
}: SubscriptionDescriptionPageProps) {
  const [alreadyConnected, setAlreadyConnected] = useState<boolean>(false);

  useEffect(() => {
    route.params &&
      route.params.showHeader &&
      setAlreadyConnected(route.params.showHeader);
  });

  async function onPress() {
    navigation.navigate(RoutesNames.PaymentModalNavigator, {
      screen: RoutesNames.AddPaymentMethodPage,
      params: {
        addingCard: false,
        fromBasket: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        previous_screen: route.params.previous_screen
      }
    });
  }

  async function onGoNext() {
    await navigation.popToTop();
    navigation.navigate(RoutesNames.HomeStack);
  }

  async function returnToBasket() {
    await navigation.popToTop();
    navigatorRef.current.navigate(RoutesNames.CardPage);
  }

  async function onPressConditions() {
    try {
      await WebBrowser.openBrowserAsync(cguLink);
    } catch (error) {
      Alert.alert(I18n.t('error.error'), error);
    }
  }

  return (
    <>
      {!alreadyConnected && <BottomFab active onPress={onGoNext} cancel grey />}
      <View style={styles.bg}>
        <Header
          closeIcon={
            alreadyConnected && route.params && !route.params.fromAccount
          }
          backIcon={
            alreadyConnected && route.params && route.params.fromAccount
          }
          onGoBack={
            alreadyConnected &&
            route.params &&
            !route.params.fromAccount &&
            !(
              route.params &&
              route.params.previous_screen &&
              route.params.previous_screen === 'Panier'
            )
              ? onGoNext
              : alreadyConnected &&
                !route.params.fromAccount &&
                route.params &&
                route.params.previous_screen &&
                route.params.previous_screen === 'Panier' &&
                returnToBasket
          }
          navigation={navigation}
        />
        <ScrollView
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.container, !alreadyConnected && { marginBottom: 80 }]}
        >
          {alreadySubscribed === true && (
            <>
              <Text style={styles.title}>
                {I18n.t('subscription.subscriptionTitleActive')}
              </Text>
              <View style={styles.paddingView}>
                <Text style={styles.subtitle}>
                  {I18n.t('subscription.activeSub')}
                </Text>
                <Text style={styles.subtitle2}>
                  {I18n.t('subscription.welcomeSub')}
                </Text>
                <View style={styles.lottieContainer}>
                  <LottieView
                    style={styles.lottie}
                    source={activeSubscription}
                    hardwareAccelerationAndroid
                    autoPlay
                    loop={false}
                  />
                </View>
                <Text style={styles.chooseCard}>
                  {I18n.t('subscription.chooseCard')}
                </Text>
              </View>
              {subscriptionCard && <CardSelectorSlider subscription />}
              {!subscriptionEnd ? (
                <TouchableText
                  text={I18n.t('subscription.cancel')}
                  textStyle={styles.cancelText}
                  onPress={() => {
                    navigation.navigate(RoutesNames.CancelSubscriptionPage);
                  }}
                />
              ) : (
                <Text style={styles.cancelText}>
                  {`${I18n.t('subscription.subscriptionEnd')} ${new Date(
                    subscriptionEnd.split(' ')[0]
                  )
                    .getDate()
                    .toString()}/${new Date(
                    subscriptionEnd.split(' ')[0]
                  ).getMonth() + 1}/${new Date(
                    subscriptionEnd.split(' ')[0]
                  ).getFullYear()}`}
                </Text>
              )}
            </>
          )}
          {!alreadySubscribed && (
            <>
              <Text style={styles.title}>
                {I18n.t('subscription.subDesc1')}
              </Text>
              <View style={styles.paddingView}>
                <Text style={styles.subtitle}>
                  {I18n.t('subscription.subDesc2')}
                </Text>
                <Text style={[styles.subtitle, styles.normal]}>
                  {I18n.t('subscription.price')}
                </Text>
                {/* <Text style={styles.subtitle}>
                  {I18n.t('subscription.discountDishes')}
                </Text>
                <Text style={styles.text}>
                  {I18n.t('subscription.discountDishesSub')}
                </Text>
                <Text style={styles.subtitle}>
                  {I18n.t('subscription.gift')}
                </Text> */}
                <View style={styles.lottieContainer}>
                  <LottieView
                    style={styles.lottie}
                    source={inactiveSubscription}
                    hardwareAccelerationAndroid
                    autoPlay
                    loop={false}
                  />
                </View>
                {/* <Text style={styles.subtitle}>
                  {I18n.t('subscription.joinCommunity')}
                </Text>
                <Text style={styles.text}>
                  {I18n.t('subscription.joinCommunitySub')}
                </Text> */}
                <CustomButton
                  customStyle={styles.button}
                  text={I18n.t('subscription.subscribe')}
                  onPress={onPress}
                />
                <Text style={styles.conditions}>
                  {I18n.t('subscription.subscriptionConditions')}
                  <Text
                    style={[styles.conditions, styles.underline]}
                    onPress={onPressConditions}
                  >
                    {I18n.t('subscription.conditions')}
                  </Text>
                  {/* {I18n.t('subscription.conditionsEnd')} */}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.black,
    flex: 1,
    paddingBottom: Appstyle.marginBottomIPhoneX
  },
  button: {
    marginBottom: 16,
    marginTop: 24
  },
  cancelText: {
    color: colors.veryLightGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginHorizontal: 25,
    marginTop: 32,
    textAlign: 'center'
  },
  chooseCard: {
    color: colors.veryLightGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginTop: 25
  },
  conditions: {
    color: colors.veryLightGrey,
    fontFamily: 'Gotham',
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 14
  },
  container: {
    height: '100%'
  },
  lottie: {
    height: 150,
    width: 150
  },
  lottieContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 24,
    width: '100%'
  },
  paddingView: { paddingBottom: 16, paddingHorizontal: 25 },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 20,
    marginBottom: 12,
    marginTop: 24
  },
  subtitle2: {
    color: colors.white,
    flex: 1,
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: 12,
    marginTop: 24,
    textAlign: 'center'
  },
  // text: {
  //   color: colors.textGrey,
  //   fontFamily: 'Gotham',
  //   fontSize: 14,
  //   letterSpacing: 0.25,
  //   lineHeight: 18,
  //   marginBottom: 16
  // },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    marginTop: 12,
    paddingHorizontal: 25
  },
  underline: {
    textDecorationLine: 'underline'
  },
  normal: { fontFamily: 'Gotham' }
});

export default (
  props: JSX.IntrinsicAttributes & SubscriptionDescriptionPageProps
) => (
  <PaymentConsumer>
    {Payctx =>
      Payctx && (
        <SubscriptionDescriptionPage
          alreadySubscribed={Payctx.alreadySubscribed}
          paymentMethodList={Payctx.paymentMethodList}
          subscriptionCard={Payctx.subscriptionCard}
          subscriptionEnd={Payctx.subscriptionEnd}
          {...props}
        />
      )
    }
  </PaymentConsumer>
);
