import React from 'react';
import Constants from 'expo-constants';

import colors from 'resources/common/colors';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import AddPaymentMethodPage from 'src/pages/AuthStack/AddPaymentMethodPage';
import { View, StyleSheet } from 'react-native';
import LoginPage from 'src/pages/AuthStack/LoginPage';
import ForgotPasswordPage from 'src/pages/AuthStack/ForgotPasswordPage';
import ResetPasswordPage from 'src/pages/AuthStack/ResetPasswordPage';
import RegistrationPage from 'src/pages/AuthStack/RegistrationPage';
import SubscriptionDescriptionPage from 'src/pages/AuthStack/SubscriptionDescriptionPage';
import EdenredWebviewPage from 'src/pages/AccountStack/EdenredWebviewPage';

export type PaymentModalParamList = {
  AddPaymentMethodPage: {
    addingCard: boolean;
    fromBasket: boolean;
    previous_screen?: string;
  };
  EdenredWebviewPage: { connect: boolean };
};

const ModalStack = createStackNavigator();

export default function PaymentModalNavigator() {
  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.headerButton} />
      </View>
    );
  }

  return (
    <ModalStack.Navigator
      mode="modal"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        header: renderHeader,
        cardStyle: { backgroundColor: colors.transparent }
      }}
    >
      <ModalStack.Screen
        name="AddPaymentMethodPage"
        component={AddPaymentMethodPage}
      />
      <ModalStack.Screen
        name="SubscriptionDescriptionPage"
        component={SubscriptionDescriptionPage}
      />
      <ModalStack.Screen name="LoginPage" component={LoginPage} />
      <ModalStack.Screen
        name="ForgotPasswordPage"
        component={ForgotPasswordPage}
      />
      <ModalStack.Screen
        name="ResetPasswordPage"
        component={ResetPasswordPage}
      />
      <ModalStack.Screen name="RegistrationPage" component={RegistrationPage} />
      <ModalStack.Screen
        name="EdenredWebviewPage"
        component={EdenredWebviewPage}
      />
    </ModalStack.Navigator>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.transparent,
    height: Constants.statusBarHeight + 20
  },
  headerButton: {
    alignSelf: 'center',
    backgroundColor: colors.white40,
    borderRadius: 2,
    height: 4,
    marginBottom: 4,
    marginTop: 'auto',
    width: 21
  }
});
