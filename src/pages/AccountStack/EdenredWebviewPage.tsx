import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import Header from 'src/components/Headers/Header';
import { WebView, WebViewNavigation } from 'react-native-webview';
import paymentApi from 'src/services/payment/paymentApi';
import { AuthConsumer } from 'src/store/AuthContext';

import colors from 'src/resources/common/colors';
import {
  edenredConnectionLink,
  edenredDisconnectLink
} from 'src/utils/constants';
import { RouteProp } from '@react-navigation/native';
import { PaymentConsumer } from 'src/store/PaymentContext';
import { PaymentMethod } from 'src/models/payment';
import { PaymentModalParamList } from 'src/navigation/PaymentModalNavigator';
import { UserData } from 'src/models/user';

type EdenredWebviewPageRouteProps = RouteProp<
  PaymentModalParamList,
  'EdenredWebviewPage'
>;

type EdenredWebviewPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: EdenredWebviewPageRouteProps;
  setPaymentMethodList: Function;
  paymentMethodList?: PaymentMethod[];
  storeUser: Function;
  user: UserData;
};

function EdenredWebviewPage({
  navigation,
  route,
  setPaymentMethodList,
  paymentMethodList,
  storeUser,
  user
}: EdenredWebviewPageProps) {
  const connect = route.params && route.params.connect;
  const [isLoading, setIsLoading] = useState(false);

  // credentials :
  //   Username : tessier@yopmail.com

  // Password : Edenred2019*

  // PAN : 5201

  async function sendCode(navState: WebViewNavigation) {
    if (navState && navState.url.includes('?code=')) {
      setIsLoading(true);
      const code =
        navState.url
          .split('?code=')
          .pop()
          .split('&')[0] || undefined;

      const res = code && (await paymentApi.edenredConnect(code));
      if (res && !res.error) {
        paymentMethodList
          ? await setPaymentMethodList([
              { type: 'edenred' },
              ...paymentMethodList
            ])
          : await setPaymentMethodList([{ type: 'edenred' }]);
        await storeUser({ ...user, edenred: true });
        navigation.goBack();
      }
      setIsLoading(false);
    }
  }

  async function disconnectEdenred(navState: WebViewNavigation) {
    if (navState.url.includes('/logout')) {
      const res = await paymentApi.edenredDisconnect();

      if (res && !res.error) {
        const tmpUser = { ...user };
        delete tmpUser.edenred;
        await storeUser(tmpUser);
        navigation.goBack();
      }
    }
  }

  if (isLoading) return <ActivityIndicator color={colors.white} />;
  else {
    return (
      <>
        <Header
          navigation={navigation}
          backIcon
          isLoading={false}
          onGoBack={async () => {
            navigation.goBack();
            navigation.goBack();
          }}
          black
        />
        <WebView
          source={{
            uri: connect ? edenredConnectionLink : edenredDisconnectLink
          }}
          onNavigationStateChange={navState => {
            connect ? sendCode(navState) : disconnectEdenred(navState);
          }}
        />
      </>
    );
  }
}

export default (props: JSX.IntrinsicAttributes & EdenredWebviewPageProps) => (
  <AuthConsumer>
    {authCtx => (
      <PaymentConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <EdenredWebviewPage
              setPaymentMethodList={ctx.setPaymentMethodList}
              paymentMethodList={ctx.paymentMethodList}
              storeUser={authCtx.storeUser}
              user={authCtx.user}
              {...props}
            />
          )
        }
      </PaymentConsumer>
    )}
  </AuthConsumer>
);
