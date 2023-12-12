/* eslint-disable @typescript-eslint/camelcase */
import analytics from '@react-native-firebase/analytics';
import {
  getTrackingStatus,
  requestTrackingPermission
} from 'react-native-tracking-transparency';

import { UserData } from 'src/models/user';

export async function checkPermission() {
  const trackingStatus = await getTrackingStatus();
  if (!(trackingStatus === 'authorized' || trackingStatus === 'unavailable')) {
    await requestTrackingPermission();
  }
}

export async function onSignInAnalytics(user: UserData) {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    if (user) {
      user.id && (await analytics().setUserId(user.id.toString()));
      user.firstname &&
        user.lastname &&
        (await analytics().setUserProperty(
          'Nom',
          `${user.firstname} ${user.lastname}`
        ));

      user.subscriptions &&
        user.subscriptions[0] &&
        (await analytics().setUserProperty('Abonné', 'true'));
    }
  }
}

export async function onSignOutAnalytics() {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    await analytics().resetAnalyticsData();
  }
}

export async function visitPage(pageName: string, params?: object) {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    await analytics().logEvent('visitPage', {
      nom_de_la_page: pageName,
      ...params
    });
  }
}

export async function readProduct(params: object) {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    await analytics().logEvent('readProduct', params);
  }
}

export async function subscribeAnalytics(accessWay: string) {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    analytics().logEvent('Abonnement', { accessWay });
    await analytics().setUserProperty('Abonnement', 'true');
  }
}

export async function onPressFilterAnalytics(name: string) {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    await analytics().logEvent('filter', { name });
  }
}
