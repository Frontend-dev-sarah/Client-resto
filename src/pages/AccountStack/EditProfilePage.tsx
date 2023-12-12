/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  DatePickerAndroid,
  Keyboard,
  Platform,
  View
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomInputText from 'src/components/Form/CustomInputText';
import { AuthConsumer } from 'store/AuthContext';
import { Avatar, UserData } from 'models/user';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import userApi from 'src/services/user/userApi';
import Header from 'src/components/Headers/Header';
import CustomButton from 'src/components/Buttons/CustomButton';
import { verifyPhoneNumber, verifyEmail } from 'src/utils/CheckCredentials';
import TouchableText from 'src/components/Buttons/TouchableText';
import AppImages from 'src/resources/common/AppImages';
import RoutesNames from 'src/navigation/RoutesNames';
import moment from 'moment';
import CheckBoxField from 'src/components/Form/CheckBoxField';
import AvatarSelector from 'src/components/Avatar/AvatarSelector';

type EditProfilePageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  user: UserData;
  disconnect: Function;
  storeUser: Function;
  alreadySubscribed: boolean;
};

function EditProfilePage({
  navigation,
  user,
  storeUser
}: EditProfilePageProps) {
  const [firstName, setFirstName] = useState(user.firstname || '');
  const [name, setName] = useState(user.lastname || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [displayIosPicker, setDisplayIosPicker] = useState(false);
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    user.birthdate
      ? moment(user.birthdate).toDate()
      : moment()
          .subtract(18, 'years')
          .toDate() // set 18 years old by default
  );
  const [gender, setGender] = useState<string>(user.sex || '');
  const [avatar, setAvatar] = useState<Avatar | undefined>(
    { url: user.avatar, name: '' } || undefined
  );
  const [avatarsList, setAvatarsList] = useState<Avatar[]>([]);
  const [acceptNewsLetter, setAcceptNewsLetter] = useState(
    user.newsletter || false
  );

  useEffect(() => {
    getAvatarsList();
  }, []);

  async function getAvatarsList() {
    const res = await userApi.getAvatars();
    if (res && !res.error) {
      setAvatarsList(res);
    }
  }

  async function modifyUser() {
    setIsLoading(true);
    const dataToSend = {
      email: email,
      firstname: firstName,
      lastname: name,
      phone: phone,
      sex: gender,
      birthdate: moment(birthdate).format(),
      newsletter: acceptNewsLetter,
      avatar: (avatar && avatar.name) || undefined // todo changer l'api : quand j'envoie pas d'avatar ne pas changer l'avatar !
    };
    if (
      email === user.email &&
      firstName === user.firstname &&
      name === user.lastname &&
      phone === user.phone &&
      gender === user.sex &&
      moment(birthdate).format() === user.birthdate
    ) {
      navigation.goBack();
      return;
    }
    const res = await userApi.updateUserInfos(dataToSend);

    if (res && !res.error) {
      storeUser(res);
      navigation.goBack();
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setIsLoading(false);
  }

  async function onPressDate() {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: birthdate,
        maxDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setBirthdate(new Date(year, month, day));
      }
    } else {
      setDisplayIosPicker(true);
    }
  }
  function canSubmit() {
    if (
      name.length > 0 &&
      firstName.length > 0 &&
      phone.length > 0 &&
      verifyPhoneNumber(phone) &&
      verifyEmail(email)
      // &&
      // birthdate &&
      // gender.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function onPressInput() {
    setDisplayIosPicker(false);
  }

  return (
    <>
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <Header navigation={navigation} backIcon isLoading={isLoading} />
        <ScrollView style={styles.scroll}>
          <Text style={[styles.title, styles.paddingView]}>
            {I18n.t('account.edit')}
          </Text>
          <AvatarSelector
            avatarsList={avatarsList}
            selectedAvatar={avatar}
            onSelect={setAvatar}
          />
          <View style={styles.paddingView}>
            <CustomInputText
              disabled={isLoading}
              value={firstName}
              onChangeValue={setFirstName}
              placeholder={I18n.t('account.firstname')}
              label={I18n.t('account.firstname')}
              type="default"
              onPress={onPressInput}
            />
            <CustomInputText
              disabled={isLoading}
              value={name}
              onChangeValue={setName}
              placeholder={I18n.t('account.name')}
              label={I18n.t('account.name')}
              type="default"
              onPress={onPressInput}
            />
            <CustomInputText
              disabled={isLoading}
              value={email}
              onChangeValue={setEmail}
              placeholder={I18n.t('account.email')}
              label={I18n.t('account.email')}
              type="email-address"
              onPress={onPressInput}
            />
            <CustomInputText
              disabled={isLoading}
              value={phone}
              onChangeValue={setPhone}
              placeholder={I18n.t('account.phone')}
              label={I18n.t('account.phone')}
              type="numeric"
              inputError={!verifyPhoneNumber(phone)}
              onPress={onPressInput}
            />

            <Text style={styles.fieldTitle}>{I18n.t('auth.gender')}</Text>
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
            </View>
            <CustomInputText
              value={
                birthdate ? moment(birthdate).format('DD / MM / YYYY') : ''
              }
              onChangeValue={() => {
                return;
              }}
              placeholder={I18n.t('auth.birthdate')}
              label={I18n.t('auth.birthdate')}
              type="numeric"
              onPress={onPressDate}
            />
            <CheckBoxField
              title={I18n.t('auth.newsletter')}
              checked={acceptNewsLetter}
              setChecked={setAcceptNewsLetter}
            />
            <TouchableText
              text={I18n.t('account.editPassword')}
              onPress={() => navigation.navigate(RoutesNames.EditPasswordPage1)}
              icon={AppImages.images.editIcon}
              iconSize={24}
              textStyle={styles.text}
              iconRight
              containerStyle={styles.textContainer}
            />
          </View>
        </ScrollView>
        {Platform.OS === 'ios' && displayIosPicker && (
          <>
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
            <DateTimePicker
              maximumDate={new Date()}
              locale="fr"
              mode="date"
              onChange={(event, date) => {
                setBirthdate(date);
              }}
              display="spinner"
              value={birthdate || new Date()}
              textColor={colors.lightGrey}
            />
          </>
        )}
        {!displayIosPicker && (
          <CustomButton
            text={I18n.t('app.save')}
            bottom
            onPress={modifyUser}
            customStyle={styles.button}
            isLoading={isLoading}
            inactive={!canSubmit()}
          />
        )}
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
  fieldTitle: {
    backgroundColor: colors.transparent,
    borderRadius: 6,
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 5,
    paddingHorizontal: 0,
    width: '100%'
  },
  genderCtnr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  iosPickerHeader: {
    backgroundColor: colors.lightGrey,
    height: 44,
    justifyContent: 'center'
  },
  scroll: {
    flex: 1,
    paddingBottom: 30
  },
  paddingView: { paddingHorizontal: 25 },
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24
  },
  textContainer: { marginVertical: 30 },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 32
  },
  validateIos: {
    marginRight: 16,
    textAlign: 'right'
  }
});

export default (props: JSX.IntrinsicAttributes & EditProfilePageProps) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <EditProfilePage user={ctx.user} storeUser={ctx.storeUser} {...props} />
      )
    }
  </AuthConsumer>
);
