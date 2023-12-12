import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  ScrollView,
  Alert
} from 'react-native';
import I18n from 'i18n-js';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import CustomButton from '../Buttons/CustomButton';
import { AuthConsumer } from 'src/store/AuthContext';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';
import CustomInputText from 'src/components/Form/CustomInputText';
import userApi from 'src/services/user/userApi';
import { UserData } from 'src/models/user';

type CompleteProfileModalProps = {
  displayCompleteProfileModal?: boolean;
  setDisplayCompleteProfileModal?: Function;
  storeUser: Function;
  user: UserData;
};

function CompleteProfileModal({
  displayCompleteProfileModal,
  storeUser,
  user,
  setDisplayCompleteProfileModal
}: CompleteProfileModalProps) {
  const [firstname, setFirstname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const children = (
    <KeyboardAvoidingView behavior={'position'}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{I18n.t('auth.yourName')}</Text>
        <CustomInputText
          disabled={isLoading}
          value={firstname}
          onChangeValue={setFirstname}
          placeholder={I18n.t('account.firstname')}
          label={I18n.t('account.firstname')}
          type="default"
          customStyle={styles.input}
        />
        <Text style={styles.subtitle}>{I18n.t('auth.completeProfile')}</Text>
        <CustomButton
          customStyle={styles.yes}
          text={I18n.t('app.yes')}
          onPress={() => modifyName(true)}
          isLoading={isLoading}
          disabled={firstname.length === 0}
        />
        <CustomButton
          customStyle={styles.no}
          outlined
          text={I18n.t('app.no')}
          onPress={() => modifyName(false)}
          isLoading={isLoading}
          disabled={firstname.length === 0}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  function close() {
    setDisplayCompleteProfileModal && setDisplayCompleteProfileModal(false);
  }

  function goToProfile() {
    if (navigatorRef && navigatorRef.current) {
      navigatorRef.current.navigate(RoutesNames.AccountStack);
      setTimeout(() => {
        navigatorRef.current.navigate(RoutesNames.EditProfilePage);
      }, 10);
    }
    close();
  }

  async function modifyName(redirect: boolean) {
    setIsLoading(true);
    const res = await userApi.updateUserInfos({
      firstname: firstname
    });
    if (res && !res.error) {
      setFirstname('');
      storeUser(res);
      close();
      if (redirect) {
        goToProfile();
      }
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  return (
    <Modal
      visible={displayCompleteProfileModal || false}
      children={children}
      noButton
      cancelable={false}
      dismissable={false}
    />
  );
}

const styles = StyleSheet.create({
  yes: { marginBottom: 20, marginTop: 30 },
  no: { marginBottom: 30 },
  container: {
    borderRadius: 24,
    paddingHorizontal: 27,
    paddingTop: 56
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    textAlign: 'center'
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 18,
    letterSpacing: 0,
    marginTop: 10,
    textAlign: 'center'
  },
  input: {
    backgroundColor: colors.white10,
    marginVertical: 20,
    paddingLeft: 10
  }
});

export default (props: JSX.IntrinsicAttributes & CompleteProfileModalProps) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <CompleteProfileModal
          displayCompleteProfileModal={ctx.displayCompleteProfileModal}
          setDisplayCompleteProfileModal={ctx.setDisplayCompleteProfileModal}
          storeUser={ctx.storeUser}
          user={ctx.user}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
