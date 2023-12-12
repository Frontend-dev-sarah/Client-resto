import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import { AccountStackParamList } from 'navigation/AccountStack';
import I18n from 'resources/localization/I18n';
import CustomInputText from 'src/components/Form/CustomInputText';
import colors from 'src/resources/common/colors';
import BottomFab from 'components/Fabs/BottomFab';
import { verifyPassword } from 'src/utils/CheckCredentials';
import RoutesNames from 'src/navigation/RoutesNames';
import userApi from 'src/services/user/userApi';
import { RouteProp } from '@react-navigation/native';

type ResetPasswordPageRouteProp = RouteProp<
  AccountStackParamList,
  'ResetPasswordPage'
>;

type ResetPasswordPageProps = {
  navigation: StackNavigationProp<AccountStackParamList, 'ResetPasswordPage'> &
    NavigationScreenProp<NavigationState, NavigationParams>;
  route: ResetPasswordPageRouteProp;
};

export default function ResetPasswordPage({
  navigation,
  route
}: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (__DEV__) {
      setPassword('Yolo2015+');
      setPassword2('Yolo2015+');
    }
  }, []);

  async function submit() {
    const { token } = route.params;
    setIsLoading(true);
    const res = await userApi.saveNewPassword(password, password2, token);
    if (!res.error) {
      navigation.goBack();
      navigation.navigate(RoutesNames.LoginPage);
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <BottomFab
        active={verifyPassword(password) && password === password2}
        onPress={submit}
        isLoading={isLoading}
      />
      <ScrollView style={styles.paddingView}>
        <Text style={styles.title}>{I18n.t('auth.newPassword')}</Text>
        <Text style={styles.subtitle}>
          {I18n.t('auth.newPasswordSubtitle')}
        </Text>
        <CustomInputText
          value={password}
          onChangeValue={setPassword}
          placeholder={I18n.t('auth.password')}
          label={I18n.t('auth.password')}
          type="password"
          autoFocus
          inputError={password !== password2}
          subText={I18n.t('auth.passwordRules')}
        />

        <CustomInputText
          value={password2}
          onChangeValue={setPassword2}
          placeholder={I18n.t('auth.passwordConfirm')}
          label={I18n.t('auth.passwordConfirm')}
          type="password"
          inputError={password !== password2}
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
    marginTop: Constants.statusBarHeight + 60,
    textAlign: 'left',
    width: '100%'
  }
});
