import dynamicLinks, {
  FirebaseDynamicLinksTypes
} from '@react-native-firebase/dynamic-links';
import I18n from 'i18n-js';

import { navigatorRef } from './RootNavigator';
import RoutesNames, { APP_PATH_URL } from './RoutesNames';
import paymentApi from 'src/services/payment/paymentApi';
import { AsyncStorage, Alert } from 'react-native';
import StorageKeys from 'src/utils/StorageKeys';
import bookingApi from 'src/services/bookingApi/bookingApi';
import * as WebBrowser from 'expo-web-browser';

export async function initApplication() {
  // buildLink();
  await dynamicLinks()
    .getInitialLink()
    .then(link => {
      link && handleDynamicLink(link);
    });

  const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  // When the is component unmounted, remove the listener
  return () => unsubscribe();
}

export let orderIsLoading = false;

export async function handleDynamicLink(
  link: FirebaseDynamicLinksTypes.DynamicLink
) {
  console.log('==DYNAMIC LINK==>', link);

  if (link.url === 'https://unirestaurant/test') {
    orderIsLoading = true;
    await handleCommandConfirmation();
  } else if (
    link.url.includes('https://unirestaurant.page.link/reset_password') ||
    link.url.includes('https://unirestaurant/reset_password')
  ) {
    const token = link.url.split('?token=')[1];
    await navigatorRef.current.navigate(RoutesNames.BottomTab);
    await navigatorRef.current.navigate(RoutesNames.AccountStack, {
      screen: RoutesNames.ResetPasswordPage,
      params: { token: token }
    });
  } else if (link.url === 'https://unirestaurant/subscription-page') {
    await navigatorRef.current.navigate(RoutesNames.BottomTab);
    await navigatorRef.current.navigate(RoutesNames.AccountStack, {
      screen: RoutesNames.SubscriptionDescriptionPage,
      params: {
        showHeader: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        previous_screen: 'Campagne de notification InApp'
      }
    });
  }
}

async function handleCommandConfirmation() {
  const payId = await AsyncStorage.getItem(StorageKeys.lastPaymentId);

  if (payId) {
    const payInfos = await paymentApi.getPaymentHistory({
      stripes: [payId],
      retries: true
    });

    if (payInfos && payInfos[0] && payInfos[0].status === 'success') {
      await navigatorRef.current.navigate(RoutesNames.HomeStack, {
        screen: RoutesNames.HomePage,
        params: { showOrderConfirm: true }
      });
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.error'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
      await navigatorRef.current.navigate(RoutesNames.RestaurantsStack);
      await navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
        screen: RoutesNames.CardPage,
        params: { simpleCard: false }
      });
      const cancel =
        payInfos &&
        payInfos[0] &&
        (await bookingApi.cancelPayment(payInfos[0].id));
    }
  }
  orderIsLoading = false;
}

async function buildLink() {
  // const link = await dynamicLinks().buildLink({
  //   link: 'https://unirestaurant.page.link/reset_password',
  //   domainUriPrefix: 'https://unirestaurant.page.link',
  //   android: {
  //     packageName: 'com.unirestaurant'
  //   },
  //   ios: {
  //     bundleId: 'com.groupe-uni.client'
  //   }
  // });
  // WebBrowser.openBrowserAsync(link);
  WebBrowser.openBrowserAsync('https://unirestaurant.page.link/0402');
}
