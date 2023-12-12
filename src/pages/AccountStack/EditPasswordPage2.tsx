/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import CustomInputText from 'src/components/Form/CustomInputText';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import Header from 'src/components/Headers/Header';
import CustomButton from 'src/components/Buttons/CustomButton';
import { verifyPassword } from 'src/utils/CheckCredentials';
import StorageKeys from 'src/utils/StorageKeys';
import RoutesNames from 'src/navigation/RoutesNames';
import userApi from 'src/services/user/userApi';
import { AuthConsumer } from 'src/store/AuthContext';

type EditPasswordPage2Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  storeUser: Function;
};

function EditPasswordPage2({ navigation, storeUser }: EditPasswordPage2Props) {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function save() {
    setIsLoading(true);
    const dataToSend = {
      password: password1,
      password_confirmation: password2
    };
    const res = await userApi.updateUserInfos(dataToSend);
    if (res && !res.error) {
      storeUser(res);
      AsyncStorage.setItem(StorageKeys.userPassword, password1);
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
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <Header navigation={navigation} backIcon isLoading={isLoading} />

        <ScrollView style={styles.paddingView}>
          <Text style={styles.title}>{I18n.t('account.newPassword')}</Text>
          <CustomInputText
            value={password1}
            onChangeValue={setPassword1}
            placeholder={I18n.t('account.password')}
            label={I18n.t('account.password')}
            type="password"
            inputError={password1 !== password2}
            subText={I18n.t('auth.passwordRules')}
          />
          <CustomInputText
            value={password2}
            onChangeValue={setPassword2}
            placeholder={I18n.t('account.passwordConfirm')}
            label={I18n.t('account.passwordConfirm')}
            type="password"
            inputError={password1 !== password2}
          />
        </ScrollView>
        <CustomButton
          text={I18n.t('app.save')}
          bottom
          onPress={save}
          customStyle={styles.button}
          isLoading={isLoading}
          inactive={!verifyPassword(password1) && password1 !== password2}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 'auto'
  },
  container: {
    flex: 1,
    height: '100%'
  },
  paddingView: {
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: 25
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 32
  }
});

export default (props: JSX.IntrinsicAttributes & EditPasswordPage2Props) => (
  <AuthConsumer>
    {ctx => ctx && <EditPasswordPage2 storeUser={ctx.storeUser} {...props} />}
  </AuthConsumer>
);
