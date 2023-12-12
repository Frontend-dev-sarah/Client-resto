import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import RootNavigator from 'navigation/RootNavigator';
import messaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import AuthProvider from 'store/AuthContext';
import Error, { checkConnection, checkGeoLoc } from 'src/pages/Error/Error';
import SubscriptionSuggestionModal from 'components/Modal/SubscriptionSuggestionModal';
import PaymentProvider from './store/PaymentContext';
import BookingProvider from './store/BookingContext';
import DistrictProvider from './store/DistrictContext';
import { isExpoApp } from './utils/constants';
import FoodIsComingModal from './components/Modal/FoodIsComingModal';
import JoiningClientModal from './components/Modal/JoiningClientModal';
import CheckUpdateModal, {
  checkUpdateAvailable
} from './components/Modal/CheckUpdateModal';

export default function App() {
  !isExpoApp && SplashScreen.hide();
  const [fontLoaded, SetFontLoaded] = useState(false);
  const [
    initialNotif,
    setInitialNotif
  ] = useState<null | FirebaseMessagingTypes.RemoteMessage>(null);

  useEffect(() => {
    loadFonts();
    console.disableYellowBox = true; // add this line for demos
    checkInitialNotifRedirection();
  }, []);

  useEffect(() => {
    checkConnection();
    checkGeoLoc();
    checkUpdateAvailable();
  });

  function checkInitialNotifRedirection() {
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage
          );
          setInitialNotif(remoteMessage);
        }
      });
  }

  async function loadFonts() {
    Font.loadAsync({
      Gotham: require('../assets/fonts/Gotham/GothamBook.otf'),
      GothamBlack: require('../assets/fonts/Gotham/GothamBlack.otf'),
      GothamBold: require('../assets/fonts/Gotham/GothamBold.otf'),
      GothamLight: require('../assets/fonts/Gotham/GothamLight.otf'),
      GothamMedium: require('../assets/fonts/Gotham/GothamMedium.otf'),
      GothamThin: require('../assets/fonts/Gotham/GothamThin.otf'),
      GothamUltra: require('../assets/fonts/Gotham/GothamUltra.otf'),

      MPLUSRoundedBold: require('../assets/fonts/MPlusRounded/MPLUSRoundedBold.ttf'),
      MPLUSRounded: require('../assets/fonts/MPlusRounded/MPLUSRounded.ttf'),
      MPLUSRoundedLight: require('../assets/fonts/MPlusRounded/MPLUSRoundedLight.ttf')
    }).then(() => {
      SetFontLoaded(true);
    });
  }

  return (
    fontLoaded && (
      <PaperProvider>
        <Error>
          <CheckUpdateModal>
            <AuthProvider>
              <PaymentProvider>
                <BookingProvider>
                  <DistrictProvider>
                    <SubscriptionSuggestionModal>
                      <FoodIsComingModal>
                        <JoiningClientModal>
                          <RootNavigator initialNotif={initialNotif} />
                        </JoiningClientModal>
                      </FoodIsComingModal>
                    </SubscriptionSuggestionModal>
                  </DistrictProvider>
                </BookingProvider>
              </PaymentProvider>
            </AuthProvider>
          </CheckUpdateModal>
        </Error>
      </PaperProvider>
    )
  );
}
