import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Share
} from 'react-native';
import Constants from 'expo-constants';

import I18n from 'resources/localization/I18n';
import CustomInputText from 'src/components/Form/CustomInputText';
import colors from 'src/resources/common/colors';
import Header from 'components/Headers/Header';
import BottomFab from 'components/Fabs/BottomFab';
import { verifyEmail } from 'src/utils/CheckCredentials';
import RoutesNames from 'src/navigation/RoutesNames';
import userApi from 'src/services/user/userApi';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
// import { Linking } from 'expo';

type ForgotPasswordPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function ForgotPasswordPage({
  navigation
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function submit() {
    setIsLoading(true);
    const res = await userApi.askResetPassword(email);
    if (!res.error) {
      Alert.alert(
        I18n.t('auth.passwordEmailSent'),
        I18n.t('auth.passwordEmailSentSub'),
        [{ text: I18n.t('app.ok'), onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('auth.askNewPasswordError'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Header navigation={navigation} closeIcon isLoading={isLoading} />
      <BottomFab
        active={verifyEmail(email)}
        onPress={submit}
        isLoading={isLoading}
      />
      <ScrollView style={styles.paddingView}>
        <Text style={styles.title}>{I18n.t('auth.forgotPasswordTitle')}</Text>
        <Text style={styles.subtitle}>{I18n.t('auth.reinitPassword')}</Text>

        <CustomInputText
          value={email}
          onChangeValue={setEmail}
          placeholder={I18n.t('auth.email')}
          label={I18n.t('auth.email')}
          type="email-address"
          autoFocus
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkGrey,
    height: '100%'
  },
  paddingView: {
    paddingHorizontal: 25
  },
  subtitle: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 24
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 12,
    marginTop: 28,
    textAlign: 'left',
    width: '100%'
  }
});
