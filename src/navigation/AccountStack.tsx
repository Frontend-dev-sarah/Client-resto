import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';

import LoginPage from 'pages/AuthStack/LoginPage';
import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import AuthLoadingPage from 'pages/AuthStack/AuthLoadingPage';
import ForgotPasswordPage from 'pages/AuthStack/ForgotPasswordPage';
import ResetPasswordPage from 'pages/AuthStack/ResetPasswordPage';
import RegistrationPage from 'src/pages/AuthStack/RegistrationPage';
import SubscriptionDescriptionPage from 'pages/AuthStack/SubscriptionDescriptionPage';
import PreferencesPage from 'src/pages/AuthStack/PreferencesPage';
import AccountPage from 'src/pages/AccountStack/AccountPage';
import CancelSubscriptionPage from 'src/pages/AccountStack/CancelSubscriptionPage';
import SavedCardsPage from 'src/pages/AccountStack/SavedCardsPage';
import OrderHistoryPage from 'src/pages/AccountStack/OrderHistoryPage';
import { Order } from 'src/models/payment';
import OrderHistoryDetailsPage from 'src/pages/AccountStack/OrderHistoryDetailsPage';
import BookingHistoryPage from 'src/pages/AccountStack/BookingHistoryPage';
import EditProfilePage from 'src/pages/AccountStack/EditProfilePage';
import EditPasswordPage1 from 'src/pages/AccountStack/EditPasswordPage1';
import EditPasswordPage2 from 'src/pages/AccountStack/EditPasswordPage2';

export type AccountStackParamList = {
  ResetPasswordPage: { token: string };
  AuthLoadingPage: undefined;
  LoginPage: undefined;
  ForgotPasswordPage: undefined;
  RegistrationPage: undefined;
  SubscriptionDescriptionPage: {
    showHeader: boolean;
    fromAccount?: boolean;
    previous_screen?: string;
  };
  PaymentModalNavigator: { addingPayment: boolean };
  AddPaymentMethodPage: { addingPayment: boolean; previous_screen?: string };
  PreferencesPage: { showSubscriptionConfirm: boolean };
  AccountPage: undefined;
  CancelSubscriptionPage: undefined;
  SavedCardsPage: undefined;
  OrderHistoryPage: undefined;
  OrderHistoryDetailsPage: { order: Order };
  BookingHistoryPage: undefined;
  EditProfilePage: undefined;
  EditPasswordPage1: undefined;
  EditPasswordPage2: undefined;
};

const Stack = createStackNavigator<AccountStackParamList>();

type AccountStackProps = {
  user?: UserData;
};

type LoadingProps = {
  authLoading: boolean;
};

type Props = AccountStackProps & LoadingProps;

function AccountStack({ user, authLoading }: Props) {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      {authLoading ? (
        <>
          <Stack.Screen name="AuthLoadingPage" component={AuthLoadingPage} />
        </>
      ) : user ? (
        <>
          <Stack.Screen name="AccountPage" component={AccountPage} />
          <Stack.Screen
            name="SubscriptionDescriptionPage"
            component={SubscriptionDescriptionPage}
          />
          <Stack.Screen name="PreferencesPage" component={PreferencesPage} />
          <Stack.Screen
            name="CancelSubscriptionPage"
            component={CancelSubscriptionPage}
          />
          <Stack.Screen name="SavedCardsPage" component={SavedCardsPage} />

          <Stack.Screen name="OrderHistoryPage" component={OrderHistoryPage} />

          <Stack.Screen
            name="OrderHistoryDetailsPage"
            component={OrderHistoryDetailsPage}
          />

          <Stack.Screen
            name="BookingHistoryPage"
            component={BookingHistoryPage}
          />

          <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
          <Stack.Screen
            name="EditPasswordPage1"
            component={EditPasswordPage1}
          />
          <Stack.Screen
            name="EditPasswordPage2"
            component={EditPasswordPage2}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}
          />
          <Stack.Screen
            name="ResetPasswordPage"
            component={ResetPasswordPage}
          />
          <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
        </>
      )}
    </Stack.Navigator>
  );
}
export { AccountStackProps };

export default (props: JSX.IntrinsicAttributes) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <AccountStack
          user={ctx.user}
          authLoading={ctx.authLoading}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
