import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  View,
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  Keyboard
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import I18n from 'resources/localization/I18n';
import CustomInputText from 'src/components/Form/CustomInputText';
import colors from 'src/resources/common/colors';
import Header from 'components/Headers/Header';
import BottomFab from 'components/Fabs/BottomFab';
import {
  verifyEmail,
  verifyPassword,
  verifyPhoneNumber
} from 'src/utils/CheckCredentials';
import userApi from 'src/services/user/userApi';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import CheckBoxField from 'src/components/Form/CheckBoxField';
import { cguLink } from 'src/utils/constants';
import { AuthConsumer } from 'src/store/AuthContext';
import RoutesNames from 'src/navigation/RoutesNames';
import { BookingConsumer } from 'src/store/BookingContext';
import { Basket } from 'src/models/products';
import moment from 'moment';

type RegistrationPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  storeUser: Function;
  basket: Basket;
};

function RegistrationPage({
  navigation,
  storeUser,
  basket
}: RegistrationPageProps) {
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [acceptNewsLetter, setAcceptNewsLetter] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [birthdate, setBirthdate] = useState<Date>();
  // const [gender, setGender] = useState<string>('');
  const [displayIosPicker, setDisplayIosPicker] = useState(false);

  useEffect(() => {
    // if (__DEV__) {
    //   setEmail('test@soluti.fr');
    //   setFirstName('test');
    //   setName('test');
    //   setPassword1('Yolo2015+');
    //   setPassword2('Yolo2015+');
    //   setPhone('0628210915');
    // }
  }, []);

  async function submit() {
    if (readyToSubmit()) {
      setIsLoading(true);
      const res = await userApi.registerUser(
        name,
        firstName,
        email,
        phone,
        password1,
        password2,
        acceptNewsLetter
        // gender,
        // moment(birthdate).format()
      );

      if (!res.error) {
        storeUser(res.customer, email, password1, res.token);
        if (basket && basket.length > 0) {
          navigation.goBack();
          navigation.goBack();
        } else {
          navigation.navigate(RoutesNames.SubscriptionDescriptionPage, {
            // eslint-disable-next-line @typescript-eslint/camelcase
            previous_screen: 'Inscription'
          });
        }
      } else if (
        res.error &&
        res.error.message &&
        res.error.message[0] === 'error.phone.unique'
      ) {
        Alert.alert(
          I18n.t('auth.registerErrorTitle'),
          I18n.t('auth.registrationPhoneError'),
          [{ text: I18n.t('app.ok'), style: 'cancel' }]
        );
      } else {
        Alert.alert(
          I18n.t('auth.registerErrorTitle'),
          I18n.t('auth.registrationError'),
          [{ text: I18n.t('app.ok'), style: 'cancel' }]
        );
      }
      setIsLoading(false);
    }
  }

  function readyToSubmit() {
    if (
      name.length > 0 &&
      firstName.length > 0 &&
      phone.length > 0 &&
      verifyPhoneNumber(phone) &&
      verifyEmail(email) &&
      verifyPassword(password1) &&
      password1 === password2 &&
      acceptCGU
      // &&
      // birthdate &&
      // gender.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  // async function onPressDate() {
  //   Keyboard.dismiss();
  //   if (Platform.OS === 'android') {
  //     const { action, year, month, day } = await DatePickerAndroid.open({
  //       date: birthdate,
  //       maxDate: new Date()
  //     });
  //     if (action !== DatePickerAndroid.dismissedAction) {
  //       setBirthdate(new Date(year, month, day));
  //     }
  //   } else {
  //     setDisplayIosPicker(true);
  //   }
  // }

  // function onPressInput() {
  //   setDisplayIosPicker(false);
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header navigation={navigation} closeIcon isLoading={isLoading} />

      <ScrollView>
        <View style={styles.paddingView}>
          <Text style={styles.title}>{I18n.t('auth.registration')}</Text>

          <CustomInputText
            value={firstName}
            onChangeValue={setFirstName}
            placeholder={I18n.t('auth.firstname')}
            label={I18n.t('auth.firstname')}
            // type="default"
            // onPress={onPressInput}
          />
          <CustomInputText
            value={name}
            onChangeValue={setName}
            placeholder={I18n.t('auth.name')}
            label={I18n.t('auth.name')}
            // type="default"
            // onPress={onPressInput}
          />
          <CustomInputText
            value={email}
            onChangeValue={setEmail}
            placeholder={I18n.t('auth.email')}
            label={I18n.t('auth.email')}
            type="email-address"
            // onPress={onPressInput}
          />
          <CustomInputText
            value={phone}
            onChangeValue={setPhone}
            placeholder={I18n.t('auth.phone')}
            label={I18n.t('auth.phone')}
            type="numeric"
            inputError={!verifyPhoneNumber(phone)}
            // onPress={onPressInput}
          />

          {/* <Text style={styles.fieldTitle}>{I18n.t('auth.gender')}</Text>
          <View style={styles.genderCtnr}>
            <CheckBoxField
              title={I18n.t('auth.male')}
              setChecked={() => setGender('M')}
              checked={gender === 'M'}
            />
            <CheckBoxField
              title={I18n.t('auth.female')}
              setChecked={() => setGender('F')}
              checked={gender === 'F'}
            />
            <CheckBoxField
              title={I18n.t('auth.other')}
              setChecked={() => setGender('O')}
              checked={gender === 'O'}
            />
          </View> */}

          {/* <CustomInputText
            value={birthdate ? moment(birthdate).format('DD / MM / YYYY') : ''}
            onChangeValue={() => {
              return;
            }}
            placeholder={I18n.t('auth.birthdate')}
            label={I18n.t('auth.birthdate')}
            type="numeric"
            onPress={onPressDate}
          /> */}

          <CustomInputText
            value={password1}
            onChangeValue={setPassword1}
            placeholder={I18n.t('auth.password')}
            label={I18n.t('auth.password')}
            type="password"
            inputError={!verifyPassword(password1)}
            // onPress={onPressInput}
            subText={I18n.t('auth.passwordRules')}
          />
          <CustomInputText
            value={password2}
            onChangeValue={setPassword2}
            placeholder={I18n.t('auth.passwordConfirm')}
            label={I18n.t('auth.passwordConfirm')}
            type="password"
            inputError={!verifyPassword(password2) || password1 !== password2}
            // onPress={onPressInput}
          />
          <CheckBoxField
            title={I18n.t('auth.newsletter')}
            checked={acceptNewsLetter}
            setChecked={setAcceptNewsLetter}
          />
          <CheckBoxField
            title={
              <Text>
                {I18n.t('auth.accept')}
                <Text
                  style={styles.checkboxTitleLink}
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
            }
            checked={acceptCGU}
            setChecked={setAcceptCGU}
            style={styles.bottom}
          />
        </View>
        <BottomFab
          grey
          active={readyToSubmit()}
          onPress={submit}
          isLoading={isLoading}
        />
      </ScrollView>
      {/* {Platform.OS === 'ios' && displayIosPicker && (
        <View>
          <View style={styles.iosPickerHeader}>
            <Text
              style={styles.validateIos}
              onPress={() => {
                setDisplayIosPicker(false);
              }}
            >
              {I18n.t('app.ok')}
            </Text>
          </View>
          <DatePickerIOS
            // maximumDate={new Date()}
            locale="fr"
            mode="date"
            date={birthdate || new Date()}
            onDateChange={date => {
              setBirthdate(date);
            }}
            style={{ backgroundColor: colors.darkGrey }}
          />
        </View>
      )} */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottom: { marginBottom: 70 },
  checkboxTitleLink: {
    textDecorationLine: 'underline'
  },
  container: {
    backgroundColor: colors.black,
    height: '100%'
  },
  // fieldTitle: {
  //   backgroundColor: colors.transparent,
  //   borderRadius: 6,
  //   color: colors.textGrey,
  //   fontFamily: 'Gotham',
  //   fontSize: 12,
  //   letterSpacing: 0.25,
  //   lineHeight: 18,
  //   marginBottom: 5,
  //   paddingHorizontal: 0,
  //   width: '100%'
  // },
  // genderCtnr: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 12
  // },
  // iosPickerHeader: {
  //   backgroundColor: colors.lightGrey,
  //   height: 44,
  //   justifyContent: 'center'
  // },
  paddingView: {
    paddingHorizontal: 25
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
  // validateIos: {
  //   marginRight: 16,
  //   textAlign: 'right'
  // }
});

export default (props: JSX.IntrinsicAttributes & RegistrationPageProps) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          ctx &&
          bookCtx && (
            <RegistrationPage
              storeUser={ctx.storeUser}
              basket={bookCtx.basket}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
