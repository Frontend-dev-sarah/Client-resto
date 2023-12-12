import React, { useRef, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme } from 'react-native-paper';

import BottomTab from 'src/components/BottomTab/BottomTab';
import { AuthConsumer } from 'store/AuthContext';
import colors from 'resources/common/colors';
import { StatusBar, StyleSheet } from 'react-native';
import Appstyle from 'src/resources/common/Appstyle';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import ModalOrderNavigator from './ModalOrderNavigator';
import PaymentModalNavigator from './PaymentModalNavigator';
import SplashScreen from 'src/resources/lottie/SplashScreen';
import CompleteProfileModal from 'src/components/Modal/CompleteProfileModal';
import { checkNotification } from 'src/services/notifications/notifications';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.paleOrange,
    background: colors.darkGrey,
    border: colors.darkGrey,
    card: colors.darkGrey,
    text: colors.darkGrey
  }
};

type RootNavigatorProps = {
  contentIsLoading: boolean;
  initialNotif: null | FirebaseMessagingTypes.RemoteMessage;
};

type Props = RootNavigatorProps;
const Stack = createStackNavigator();

export let navigatorRef: React.MutableRefObject<any>;

function RootNavigator({ contentIsLoading, initialNotif }: Props) {
  // TODO debug the undefined authconsumer when fast refresh
  // maybe https://stackoverflow.com/questions/63788454/fast-refresh-in-react-native-always-fully-reload-the-app

  navigatorRef = useRef();

  const [initialRedirected, setInitialRedirected] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(colors.black);
  }, []);

  useEffect(() => {
    // if initial notif we wait to navigatorRef to be ready for redirection
    if (
      initialNotif &&
      navigatorRef &&
      navigatorRef.current &&
      !initialRedirected
    ) {
      setInitialRedirected(true);
      setTimeout(() => {
        checkNotification(initialNotif);
      }, 4000);
    }
  }, [navigatorRef && navigatorRef.current, initialNotif]);

  return (
    <>
      <NavigationContainer ref={navigatorRef} theme={theme}>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen
            name="ModalOrderNavigator"
            component={ModalOrderNavigator}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              cardStyle: [
                {
                  backgroundColor: colors.black60
                },
                styles.shadow
              ],
              gestureEnabled: !contentIsLoading
            }}
          />
          <Stack.Screen
            name="PaymentModalNavigator"
            component={PaymentModalNavigator}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              cardStyle: [
                {
                  backgroundColor: colors.black60
                },
                styles.shadow
              ],
              gestureEnabled: !contentIsLoading
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <CompleteProfileModal />
    </>
  );
}

const styles = StyleSheet.create({
  shadow: Appstyle.shadowExtraBold()
});

export { RootNavigatorProps };

export default (props: JSX.IntrinsicAttributes) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <RootNavigator contentIsLoading={ctx.contentIsLoading} {...props} />
      )
    }
  </AuthConsumer>
);
