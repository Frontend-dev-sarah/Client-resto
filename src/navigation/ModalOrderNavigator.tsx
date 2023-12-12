import React from 'react';

import colors from 'resources/common/colors';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import ChooseDatePage from 'src/pages/BookingModalStack/ChooseDatePage';
import ModalOrderHeader from 'src/components/BottomTab/ModalOrderHeader';
import ChooseRestaurantPage from 'src/pages/BookingModalStack/ChooseRestaurantPage';
import ChooseNumberPersonsPage from 'src/pages/BookingModalStack/ChooseNumberPersonsPage';
import { BookingConsumer } from 'src/store/BookingContext';
import { PlaceChoice } from 'src/models/restaurants';
import ScanPage from 'src/pages/BookingModalStack/ScanPage';
import CardPage from 'src/pages/AccountStack/CardPage';
import { screenHeight } from 'src/utils/constants';
import Constants from 'expo-constants';
type ModalOrderNavigatorProps = {
  placeChoice: PlaceChoice;
  modalHeight: number;
};

const ModalStack = createStackNavigator();
const StackNav = createStackNavigator();
const StackScanNav = createStackNavigator();

function ModalOrderNavigator({
  placeChoice,
  modalHeight
}: ModalOrderNavigatorProps) {
  function renderHeader() {
    return placeChoice !== 'alreadyOnSite' && <ModalOrderHeader />;
  }

  return (
    <ModalStack.Navigator
      mode="modal"
      screenOptions={{
        gestureEnabled: true,
        header: renderHeader,
        cardStyle: {
          backgroundColor: colors.transparent,
          marginTop:
            placeChoice && placeChoice !== 'alreadyOnSite'
              ? 65
              : placeChoice === 'alreadyOnSite'
              ? 0
              : modalHeight &&
                screenHeight - modalHeight - Constants.statusBarHeight
        }
      }}
    >
      {placeChoice === 'alreadyOnSite' ? (
        <ModalStack.Screen name="StackScan" component={StackScan} />
      ) : (
        <ModalStack.Screen name="StackNavigator" component={StackNavigator} />
      )}
    </ModalStack.Navigator>
  );
}

function StackNavigator() {
  return (
    <BookingConsumer>
      {ctx =>
        ctx && (
          <StackNav.Navigator
            headerMode="none"
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS
            }}
          >
            {ctx.placeChoice !== 'bookOnSite' && (
              <StackNav.Screen
                name="ChooseDatePage"
                component={ChooseDatePage}
              />
            )}
            <StackNav.Screen
              name="ChooseRestaurantPage"
              component={ChooseRestaurantPage}
            />
            <StackNav.Screen
              name="ChooseNumberPersonsPage"
              component={ChooseNumberPersonsPage}
            />
            <StackNav.Screen name="CardPage" component={CardPage} />
          </StackNav.Navigator>
        )
      }
    </BookingConsumer>
  );
}

function StackScan() {
  return (
    <StackScanNav.Navigator headerMode="none">
      <StackScanNav.Screen name="ScanPage" component={ScanPage} />
    </StackScanNav.Navigator>
  );
}

export default (props: JSX.IntrinsicAttributes & ModalOrderNavigatorProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <ModalOrderNavigator
          placeChoice={ctx.placeChoice}
          modalHeight={ctx.modalHeight}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
