import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { UserData } from 'models/user';
// import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';

import Api from 'src/services/api';
import StorageKeys from 'src/utils/StorageKeys';
import userApi from 'src/services/user/userApi';
import notifications, {
  checkPermission,
  notificationListener
} from 'src/services/notifications/notifications';
import { isExpoApp } from 'src/utils/constants';
import { initApplication } from 'src/navigation/CustomLinking';
import {
  onSignInAnalytics,
  onSignOutAnalytics,
  checkPermission as checkAnalyticsPermission
} from 'src/services/analytics/analytics';

type AuthContextInterface = {
  children: ReactNode;
};

type State = {
  user?: UserData;
  updateUser: (user: UserData) => void;
  storeUser: (
    userData: UserData,
    email: string,
    password: string,
    token: string
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  authLoading: boolean;
  showOnBoarding: boolean;
  setShowOnBoarding: Function;
  alreadySubscribed: boolean;
  subscriptionEnd?: string;
  contentIsLoading: boolean;
  setContentIsLoading: Function;
  displayCompleteProfileModal?: boolean;
  setDisplayCompleteProfileModal: Function;
};

const { Provider, Consumer } = createContext<State | undefined>(undefined);

function AuthProvider({ children }: AuthContextInterface) {
  const [user, setUser] = useState<UserData>();
  const [authLoading, setAuthLoading] = useState(true);
  const [showOnBoarding, setShowOnBoarding] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState<boolean>(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string>();
  // contentIsLoading is used to know if we can close modal for example
  const [contentIsLoading, setContentIsLoading] = useState<boolean>(false);
  const [
    displayCompleteProfileModal,
    setDisplayCompleteProfileModal
  ] = useState<boolean>(false);

  useEffect(() => {
    checkFirstUse();
    checkExistingCredentials();
    if (!isExpoApp) {
      checkPermission();
      notificationListener();
      checkAnalyticsPermission();
    }
  }, []);

  async function checkFirstUse() {
    const openOnboarding = await AsyncStorage.getItem(StorageKeys.firstUse);
    if (openOnboarding !== 'false') {
      setTimeout(() => {
        setShowOnBoarding(true);
      }, 3000);
    }
  }

  function updateUser(data: UserData) {
    setUser(data);
  }

  useEffect(() => {
    checkSubscription();
    user && onSignInAnalytics(user);
  }, [user]);

  function checkSubscription() {
    if (user && user.subscriptions && user.subscriptions[0]) {
      setAlreadySubscribed(true);
      user.subscriptions[0].pivot &&
        user.subscriptions[0].pivot.payment_end &&
        setSubscriptionEnd(user.subscriptions[0].pivot.payment_end);
    } else {
      setAlreadySubscribed(false);
      setSubscriptionEnd(undefined);
    }
  }

  async function disconnect() {
    AsyncStorage.removeItem(StorageKeys.userToken);
    AsyncStorage.removeItem(StorageKeys.userEmail);
    AsyncStorage.removeItem(StorageKeys.userPassword);
    AsyncStorage.removeItem(StorageKeys.paymentsAttempts);
    AsyncStorage.removeItem(StorageKeys.edenredPayments);
    onSignOutAnalytics();
    Api.setAccessToken(null);
    setUser(null);
  }

  async function storeUser(
    userData: UserData,
    email: string,
    password: string,
    token: string
  ) {
    email && AsyncStorage.setItem(StorageKeys.userEmail, email);
    password && AsyncStorage.setItem(StorageKeys.userPassword, password);
    token && AsyncStorage.setItem(StorageKeys.userToken, token);
    token && Api.setAccessToken(token);
    userData && setUser(userData);
  }

  async function checkExistingCredentials() {
    const userToken = await AsyncStorage.getItem(StorageKeys.userToken);
    const email = await AsyncStorage.getItem(StorageKeys.userEmail);
    const password = await AsyncStorage.getItem(StorageKeys.userPassword);
    if (userToken && email && password) {
      const res = await userApi.loginUser(email, password);
      initApplication();
      if (!res.error) {
        console.log('==user auth token==>', userToken, res);
        storeUser(res.customer, email, password, res.token);
        if (res.customer && !res.customer.firstname) {
          setDisplayCompleteProfileModal(true);
        }
        notifications.registerNotifications();
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
        return false;
      }
    } else {
      initApplication();
    }
    setAuthLoading(false);
  }

  return (
    <Provider
      value={{
        user,
        updateUser,
        storeUser,
        disconnect,
        authLoading,
        showOnBoarding,
        setShowOnBoarding,
        alreadySubscribed,
        subscriptionEnd,
        contentIsLoading,
        setContentIsLoading,
        displayCompleteProfileModal,
        setDisplayCompleteProfileModal
      }}
    >
      {children}
    </Provider>
  );
}

export { Consumer as AuthConsumer };
export default AuthProvider;
