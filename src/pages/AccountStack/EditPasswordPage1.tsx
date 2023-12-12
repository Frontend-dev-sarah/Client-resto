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

type EditPasswordPage1Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function EditPasswordPage1({
  navigation
}: EditPasswordPage1Props) {
  const [password, setPassword] = useState('');

  async function goNext() {
    const pswd = await AsyncStorage.getItem(StorageKeys.userPassword);

    if (pswd && pswd === password) {
      navigation.navigate(RoutesNames.EditPasswordPage2);
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('account.badPassword'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
  }

  return (
    <>
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <Header navigation={navigation} backIcon />

        <ScrollView style={styles.paddingView}>
          <Text style={styles.title}>{I18n.t('account.formerPassword')}</Text>

          <CustomInputText
            value={password}
            onChangeValue={setPassword}
            placeholder={I18n.t('account.password')}
            label={I18n.t('account.password')}
            type="password"
            inputError={verifyPassword(password)}
          />
        </ScrollView>
        <CustomButton
          text={I18n.t('app.next')}
          bottom
          onPress={goNext}
          customStyle={styles.button}
          inactive={!verifyPassword(password)}
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
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24
  },
  textContainer: { alignSelf: 'flex-start' },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 32
  }
});
