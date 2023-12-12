import messaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import userApi from '../user/userApi';
import { isExpoApp } from 'src/utils/constants';
import { openOverlayMessageScreen } from 'src/components/Modal/FoodIsComingModal';
import { openOverlayMessageScreen as openJoiningTableModal } from 'src/components/Modal/JoiningClientModal';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';

// https://rnfirebase.io/messaging/notifications
// https://notifee.app/react-native/docs/integrations/fcm

// following lines are usefull to not import notifee module when using expo and to avoid crash
let notifee: any = null;
!isExpoApp &&
  import('@notifee/react-native')
    .then(res => {
      notifee = res;
    })
    .catch(e => console.log('import notifee failed', e));

export async function checkPermission() {
  const enabled = await messaging().hasPermission();
  notifee &&
    (await notifee.default.createChannelGroup({
      id: 'uni',
      name: 'uni'
    }));
  notifee &&
    (await notifee.default.createChannel({
      name: 'uni',
      groupId: 'uni',
      id: 'uni',
      sound: 'default',
      visibility: notifee.AndroidVisibility.PUBLIC,
      importance: notifee.Importance.HIGH
    }));

  if (enabled && enabled !== -1) {
    return getFcmToken();
  } else {
    requestPermission();
  }
}

export async function getFcmToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('===fcm token===>', fcmToken);
    return fcmToken;
  } else {
    console.log('===failed===>');
    //failed
  }
}

export async function registerNotifications() {
  const token = await checkPermission();
  if (token) {
    userApi.sendFirebaseToken(token);
  }
}

export async function requestPermission() {
  try {
    await messaging().requestPermission();
    // User has authorised
  } catch (error) {
    console.log('==user rejected permission==>');
    // User has rejected permissions
  }
}

export async function notificationListener() {
  await messaging().onMessage(remoteMessage => {
    console.log('Notification received when app opened', remoteMessage);
    checkNotification(remoteMessage);
    displayNotif(remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage
    );
    checkNotification(remoteMessage);
  });

  // The check for initial notification is made in AppContainer
}

async function displayNotif(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  remoteMessage &&
    remoteMessage.notification &&
    (await notifee.default.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      ...(Platform.OS === 'android' && {
        android: {
          channelId:
            remoteMessage.notification.android &&
            remoteMessage.notification.android.channelId,
          groupId: 'uni'
        }
      })
    }));
}

export async function checkNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  if (
    remoteMessage &&
    remoteMessage.data &&
    remoteMessage.data.path === 'food-is-coming'
  ) {
    openOverlayMessageScreen(
      remoteMessage.data.notification && remoteMessage.data.notification.body
        ? remoteMessage.data.notification.body
        : remoteMessage.notification.body
        ? remoteMessage.notification.body
        : '',
      remoteMessage.data.sub_message
    );
  }
  // when another user ask for joining table
  if (
    remoteMessage &&
    remoteMessage.data &&
    remoteMessage.data.path === 'ask-join'
  ) {
    openJoiningTableModal(
      remoteMessage.data.notification && remoteMessage.data.notification.body
        ? remoteMessage.data.notification.body
        : remoteMessage.notification.body
        ? remoteMessage.notification.body
        : '',
      remoteMessage.data.sub_message,
      remoteMessage && remoteMessage.data && remoteMessage.data.askjoin_id
    );
  }
  // when the user has to give a note to a passed booking
  if (
    remoteMessage &&
    remoteMessage.data &&
    remoteMessage.data.path === 'notation'
  ) {
    navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
      screen: RoutesNames.RestaurantsPage
    });
    navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
      screen: RoutesNames.NotationPage,
      params: {
        orderId: remoteMessage.data.order_id,
        orderType: remoteMessage.data.order_type
      }
    });
  }
}

export default {
  checkNotification,
  checkPermission,
  notificationListener,
  registerNotifications
};
