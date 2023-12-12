import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Alert
} from 'react-native';
import Constants from 'expo-constants';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';

import { AuthConsumer } from 'store/AuthContext';
import I18n from 'resources/localization/I18n';
import userApi from 'src/services/user/userApi';
import CustomButton from 'src/components/Buttons/CustomButton';
import CustomInputText from 'src/components/Form/CustomInputText';
import colors from 'src/resources/common/colors';
import TouchableText from 'components/Buttons/TouchableText';
import RoutesNames from 'navigation/RoutesNames';
import notifications from 'src/services/notifications/notifications';
import { cguLink } from 'src/utils/constants';
import { verifyEmail } from 'src/utils/CheckCredentials';

type LoginPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  storeUser: Function;
  setDisplayCompleteProfileModal: Function;
};

function LoginPage({
  storeUser,
  navigation,
  setDisplayCompleteProfileModal
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onPress() {
    setIsLoading(true);
    const res = await userApi.loginUser(email, password);
    if (!res.error) {
      console.log('==login==>', res);
      storeUser(res.customer, email, password, res.token);
      if (res.customer && !res.customer.firstname) {
        setDisplayCompleteProfileModal(true);
      }
      notifications.registerNotifications();
      navigation.goBack();
    } else {
      Alert.alert(I18n.t('auth.loginError'), I18n.t('auth.error'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (__DEV__) {
      setEmail('test@soluti.fr');
      setPassword('Yolo2015+');
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ backgroundColor: colors.darkGrey }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.paddingView}>
          <Text style={styles.title}>{I18n.t('auth.login')}</Text>
          <CustomInputText
            value={email}
            onChangeValue={setEmail}
            placeholder={I18n.t('auth.email')}
            label={I18n.t('auth.email')}
            type="email-address"
          />
          <CustomInputText
            value={password}
            onChangeValue={setPassword}
            placeholder={I18n.t('auth.password')}
            label={I18n.t('auth.password')}
            type="password"
            hideError
            onValidate={onPress}
          />
          <Text style={styles.cguText}>
            {I18n.t('auth.accept')}
            <Text
              style={styles.link}
              onPress={async () => {
                try {
                  await WebBrowser.openBrowserAsync(cguLink);
                } catch (error) {
                  Alert.alert(I18n.t('error.error'), error);
                }
              }}
            >
              {I18n.t('auth.cgu')}
            </Text>
          </Text>
          <CustomButton
            customStyle={styles.button}
            text={I18n.t('auth.login')}
            primary
            border
            onPress={onPress}
            isLoading={isLoading}
            inactive={isLoading}
            disabled={!verifyEmail(email)}
          />
          {/*<Text style={styles.otherChoice}>{I18n.t('auth.orWith')}</Text>
           <View style={styles.row}>
            <TouchableText
              text={I18n.t('auth.facebook')}
              onPress={() => {
                return;
              }}
              textStyle={styles.socialNetworkText}
              icon={AppImages.images.facebook}
              iconSize={20}
            />
            <View style={styles.separator} />
            <TouchableText
              text={I18n.t('auth.google')}
              onPress={() => {
                return;
              }}
              textStyle={styles.socialNetworkText}
              icon={AppImages.images.google}
              iconSize={20}
            />
          </View> */}
        </View>
      </ScrollView>
      <View style={[styles.bottomContainer, styles.row]}>
        {/* <TouchableText
          text={I18n.t('auth.register')}
          onPress={() => {
            navigation.navigate(RoutesNames.RegistrationPage);
          }}
        />
        <View style={styles.roundSeparator} /> */}
        <TouchableText
          text={I18n.t('auth.forgotPassword')}
          onPress={() => {
            navigation.navigate(RoutesNames.ForgotPasswordPage);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 'auto',
    paddingBottom: 46,
    paddingHorizontal: 25,
    paddingTop: 22
  },
  button: { marginTop: 10 },
  container: {
    height: '100%'
  },
  // otherChoice: {
  //   color: colors.textGrey,
  //   fontFamily: 'Gotham',
  //   fontSize: 12,
  //   letterSpacing: 0,
  //   lineHeight: 16,
  //   marginBottom: 16,
  //   marginTop: 32
  // },
  paddingView: {
    paddingHorizontal: 25
  },
  // roundSeparator: {
  //   backgroundColor: colors.white,
  //   borderRadius: 2,
  //   height: 4,
  //   marginHorizontal: 8,
  //   width: 4
  // },
  row: {
    flexDirection: 'row'
  },
  // separator: {
  //   backgroundColor: colors.white,
  //   height: 20,
  //   marginHorizontal: 20,
  //   width: 2
  // },
  // socialNetworkText: {
  //   color: colors.white,
  //   fontFamily: 'GothamBold',
  //   fontSize: 14,
  //   letterSpacing: 0.25,
  //   lineHeight: 18,
  //   marginLeft: 8
  // },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 30,
    letterSpacing: 0,
    lineHeight: 48,
    marginBottom: 40,
    marginTop: Constants.statusBarHeight + 20,
    textAlign: 'center',
    width: '100%'
  },
  link: {
    textDecorationLine: 'underline'
  },
  cguText: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    paddingTop: 2,
    marginTop: 40,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & LoginPageProps) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <LoginPage
          storeUser={ctx.storeUser}
          setDisplayCompleteProfileModal={ctx.setDisplayCompleteProfileModal}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
