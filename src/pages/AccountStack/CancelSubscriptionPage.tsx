/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import CustomButton from 'src/components/Buttons/CustomButton';
import paymentApi from 'src/services/payment/paymentApi';
import { PaymentConsumer } from 'src/store/PaymentContext';
import { AuthConsumer } from 'src/store/AuthContext';
import { UserData } from 'src/models/user';

type CancelSubscriptionPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  loadData: Function;
  storeUser: Function;
  user: UserData;
};

function CancelSubscriptionPage({
  navigation,
  loadData,
  storeUser,
  user
}: CancelSubscriptionPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function onPress() {
    setIsLoading(true);
    const res = await paymentApi.unSubscribe();
    if (res && !res.error) {
      loadData();
      await storeUser(res);
      navigation.popToTop();
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  return (
    <>
      <View style={styles.bg}>
        <Header backIcon navigation={navigation} />
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{I18n.t('subscription.cancelTitle')}</Text>
          <Text style={styles.title}>
            {I18n.t('subscription.cancelTitle2')}
          </Text>
          <Text style={styles.subtitle}>
            {I18n.t('subscription.saved')}
            <Text style={styles.orangeText}>{`${user.amount_economized ||
              '-'}€`}</Text>
            {I18n.t('subscription.savedEnd')}
          </Text>
          <Text style={styles.subtitle}>
            {I18n.t('subscription.total')}
            <Text style={styles.orangeText}>
              {user.nb_orders || '-' + I18n.t('subscription.totalOrder')}
            </Text>
            {I18n.t('subscription.totalEnd')}
          </Text>
          <Text style={styles.text}>{I18n.t('subscription.totalSub')}</Text>
        </ScrollView>
        <CustomButton
          customStyle={styles.button}
          text={I18n.t('subscription.cancelButton')}
          onPress={onPress}
          isLoading={isLoading}
        />
        <CustomButton
          customStyle={[styles.button, styles.margintop]}
          text={I18n.t('subscription.backProfil')}
          onPress={() => {
            navigation.popToTop();
          }}
          outlined
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: colors.black, paddingBottom: 40 },
  button: { marginTop: 'auto', paddingHorizontal: 25 },
  container: {
    height: '100%',
    paddingHorizontal: 25
  },
  margintop: { marginTop: 24 },
  orangeText: {
    color: colors.paleOrange
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: 12,
    marginTop: 24
  },
  text: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 40
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    marginTop: 12
  }
});

export default (
  props: JSX.IntrinsicAttributes & CancelSubscriptionPageProps
) => (
  <AuthConsumer>
    {authCtx => (
      <PaymentConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <CancelSubscriptionPage
              loadData={ctx.loadData}
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
