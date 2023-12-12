import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Platform
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';

import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import CustomButton from 'src/components/Buttons/CustomButton';
import colors from 'src/resources/common/colors';
import { screenWidth, PAYMENT_TYPES } from 'src/utils/constants';
import CustomInputText from 'src/components/Form/CustomInputText';
import RoutesNames from 'src/navigation/RoutesNames';
import { stripeKeyTest } from 'src/utils/constants';
import { verifyDate } from 'src/utils/CheckCredentials';
import paymentApi from 'src/services/payment/paymentApi';
import CardComponent from 'src/components/Payment/CardComponent';
import { PaymentConsumer } from 'src/store/PaymentContext';
import userApi from 'src/services/user/userApi';
import { RouteProp } from '@react-navigation/native';
import { PaymentModalParamList } from 'src/navigation/PaymentModalNavigator';
import BorderedRadiusButton from 'src/components/Buttons/BorderedRadiusButton';
import { IconButton, TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';

import { TextInputMask } from 'react-native-masked-text';
import CardSelectorSlider from 'src/components/Payment/CardSelectorSlider';
import { AuthConsumer } from 'src/store/AuthContext';
import PaymentTypeSelector from 'src/components/Form/PaymentTypeSelector';

import { subscribeAnalytics } from 'src/services/analytics/analytics';
import { PaymentType } from 'src/models/payment';
import { UserData } from 'src/models/user';
import ScanCardComponent from 'src/components/Payment/ScanCardComponent';
import { SubscriptionOfferConfirmModal } from 'src/components/Modal/SubscriptionOfferConfirmModal';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe-client')(stripeKeyTest);

type AddPaymentMethodPageRouteProps = RouteProp<
  PaymentModalParamList,
  'AddPaymentMethodPage'
>;

type AddPaymentMethodPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  loadData: Function;
  route: AddPaymentMethodPageRouteProps;
  setContentIsLoading: Function;
  storeUser: Function;
  user: UserData;
};

function AddPaymentMethodPage({
  navigation,
  loadData,
  route,
  setContentIsLoading,
  storeUser,
  user
}: AddPaymentMethodPageProps) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addingCard, fromBasket } = route.params; // if addingCard is false -> it means that we are on this page to subscribe
  const [disabled, setDisabled] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string
  >();
  const [addingPaymentType, setAddingPaymentType] = useState<PaymentType>(
    PAYMENT_TYPES[0]
  );
  const [scannerOpened, setScannerOpened] = useState(false);
  const [promoValidatedDate, setPromoValidatedDate] = useState(false);

  useEffect(() => {
    if (__DEV__ && addingCard) {
      // setNumber('4242 4242 4242 4242');
      // setName('TEST name');
      // setDate('05 / 23');
      // setCvv('123');
    }
  }, []);

  useEffect(() => {
    setContentIsLoading(isLoading);
  }, [isLoading]);

  async function submit() {
    setIsLoading(true);
    if (
      !(
        addingCard &&
        addingPaymentType.value === I18n.t('payment.restaurantTicket')
      )
    ) {
      const information = {
        card: {
          number: number,
          // eslint-disable-next-line @typescript-eslint/camelcase
          exp_month: date.slice(0, 2),
          // eslint-disable-next-line @typescript-eslint/camelcase
          exp_year: date.slice(-2),
          cvc: cvv,
          name: name
        }
      };

      const res = !disabled ? await stripe.createToken(information) : true;
      if (!res.error) {
        const token = res.id;
        if (addingCard) {
          saveNewCard(token);
        } else {
          subscribe(token);
        }
      } else {
        Alert.alert(I18n.t('error.error'), I18n.t('payment.invalidInfos'), [
          { text: I18n.t('app.ok'), style: 'cancel' }
        ]);
        setIsLoading(false);
      }
    } else {
      user.edenred ? disconnectEdenred() : connectEdenred();
    }
  }

  async function saveNewCard(token: string) {
    const res = await paymentApi.addPaymentMethod(token, addingPaymentType.key);

    if (res && !res.error) {
      await loadData();
      navigation.goBack();
    } else if (res.error.message[0] === 'error.card.unique') {
      Alert.alert(I18n.t('error.error'), I18n.t('payment.unique'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    } else {
      showAlert();
    }
    setIsLoading(false);
  }

  async function connectEdenred() {
    navigation.navigate(RoutesNames.EdenredWebviewPage, {
      connect: true
    });
    setIsLoading(false);
  }

  async function disconnectEdenred() {
    navigation.navigate(RoutesNames.EdenredWebviewPage, { connect: false });
    setIsLoading(false);
  }

  async function subscribe(token: string) {
    const paymentMethod = !disabled
      ? await paymentApi.addPaymentMethod(token, addingPaymentType.key)
      : selectedPaymentMethodId;
    if (paymentMethod && !paymentMethod.error) {
      const sub = await paymentApi.subscribe({
        token: paymentMethod.method || paymentMethod,
        discountCode: discountCode.length > 0 ? discountCode : null
      });
      console.log('==SUBSCRIPTION==>', sub);
      if (sub && !sub.error) {
        if (sub.action) {
          try {
            const browser =
              // Platform.OS === 'android'
              //   ? await WebBrowser.openAuthSessionAsync(sub.action, '')
              //   :
              await WebBrowser.openBrowserAsync(sub.action);

            const infos = await userApi.getUserInfos();
            if (
              infos &&
              !infos.error &&
              infos.subscriptions &&
              infos.subscriptions[0]
            ) {
              if (infos.nextPaymentDate) {
                setPromoValidatedDate(infos.nextPaymentDate);
              } else {
                await storeUser(infos);
                subscribeAnalytics(route.params.previous_screen);
                navigateToPreferences();
              }
            } else {
              // todo display error
            }
          } catch (error) {
            showAlert();
          }
        } else {
          if (sub.nextPaymentDate) {
            setPromoValidatedDate(sub.nextPaymentDate);
          } else {
            subscribeAnalytics(route.params.previous_screen);
            navigateToPreferences();
          }
        }
      } else {
        if (sub.error === 'invalid_code') {
          showInvalidDiscounCodeAlert();
        } else {
          showAlert();
        }
      }
    } else if (paymentMethod.error.message[0] === 'error.card.unique') {
      Alert.alert(I18n.t('error.error'), I18n.t('payment.unique'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    } else {
      showAlert();
    }
    setIsLoading(false);
  }

  function showAlert() {
    Alert.alert(I18n.t('error.error'), I18n.t('payment.invalidInfos'), [
      { text: I18n.t('app.ok'), style: 'cancel' }
    ]);
  }

  function showInvalidDiscounCodeAlert() {
    Alert.alert(
      I18n.t('error.error'),
      I18n.t('subscription.invalidDiscountCode'),
      [{ text: I18n.t('app.ok'), style: 'cancel' }]
    );
  }

  function verifyFields() {
    return (
      verifyDate(date) &&
      number.length === 19 &&
      cvv.length === 3 &&
      name.length > 0
    );
  }

  function navigateToPreferences() {
    navigation.navigate(RoutesNames.PreferencesPage, {
      showSubscriptionConfirm: true
    });
  }

  function scrollHelper(res: NativeSyntheticEvent<NativeScrollEvent>) {
    if (res.nativeEvent.contentOffset.y <= 0 && showDivider) {
      setShowDivider(false);
    }
    if (res.nativeEvent.contentOffset.y > 2 && !showDivider) {
      setShowDivider(true);
    }
  }
  return (
    <>
      <ScanCardComponent
        setNumber={setNumber}
        setDate={setDate}
        cameraOpened={scannerOpened}
        setCameraOpened={setScannerOpened}
      />
      <SubscriptionOfferConfirmModal
        visible={promoValidatedDate}
        onPress={navigateToPreferences}
        hideModal={() => setPromoValidatedDate(false)}
        date={promoValidatedDate}
      />
      <Header
        title={
          addingCard && fromBasket
            ? I18n.t('basket.basket')
            : addingCard
            ? I18n.t('payment.addPaymentMethod')
            : I18n.t('subscription.subscription')
        }
        navigation={navigation}
        subtitle={
          !addingCard || fromBasket
            ? I18n.t('payment.addPaymentMethod')
            : undefined
        }
        modal
        showSeparator={showDivider}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.container}
          onScroll={res => {
            scrollHelper(res);
          }}
          scrollEventThrottle={1}
        >
          {addingCard ? (
            <>
              <CardComponent
                name={name}
                number={number}
                date={date}
                noType={addingPaymentType.key === 'bank'}
                type={addingPaymentType.key}
                customStyle={styles.card}
              />

              <PaymentTypeSelector
                paymentType={addingPaymentType.value}
                setPaymentType={setAddingPaymentType}
              />
            </>
          ) : (
            <CardSelectorSlider
              editingCard={{ name: name, date: date, cvv: cvv, number: number }}
              onCardFocus={(
                name: string,
                number: string,
                date: string,
                cvv: string,
                first: boolean,
                pmId: string
              ) => {
                setName(name);
                setNumber(number);
                setDate(date);
                setCvv(cvv);
                setDisabled(!first);
                setSelectedPaymentMethodId(pmId);
              }}
            />
          )}
          {addingPaymentType.value !== I18n.t('payment.restaurantTicket') && (
            <View style={styles.paddingView}>
              {disabled ? (
                <CustomInputText
                  disabled={disabled || isLoading}
                  value={number}
                  onChangeValue={setNumber}
                  placeholder={I18n.t('payment.cardNumber')}
                  label={I18n.t('payment.cardNumber')}
                  customStyle={styles.input}
                  type="numeric"
                />
              ) : (
                <View>
                  <TextInputMask
                    type={'credit-card'}
                    value={number}
                    onChangeText={text => {
                      setNumber(text);
                    }}
                    customTextInput={CustomInputText}
                    customTextInputProps={{
                      disabled: disabled || isLoading,
                      value: number,
                      onChangeValue: setNumber,
                      placeholder: I18n.t('payment.cardNumber'),
                      label: I18n.t('payment.cardNumber'),
                      type: 'numeric',
                      customStyle: { ...styles.input, ...styles.marginRight },
                      maxLength: 19
                    }}
                  />

                  <IconButton
                    icon={'camera-outline'}
                    color={colors.white}
                    size={25}
                    onPress={() => setScannerOpened(true)}
                    style={styles.iconcamera}
                  />
                </View>
              )}

              <CustomInputText
                disabled={disabled || isLoading}
                value={name}
                onChangeValue={setName}
                placeholder={I18n.t('payment.ownerName')}
                label={I18n.t('payment.ownerName')}
                customStyle={styles.input}
              />

              <View style={styles.row}>
                {disabled ? (
                  <CustomInputText
                    disabled={disabled || isLoading}
                    value={date}
                    onChangeValue={setDate}
                    placeholder={I18n.t('payment.expire')}
                    label={I18n.t('payment.expire')}
                    customStyle={styles.inputSmall}
                  />
                ) : (
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'MM / YY'
                    }}
                    value={date}
                    onChangeText={text => {
                      setDate(text);
                    }}
                    customTextInput={CustomInputText}
                    customTextInputProps={{
                      disabled: disabled || isLoading,
                      value: date,
                      onChangeValue: setDate,
                      placeholder: I18n.t('payment.expire'),
                      label: I18n.t('payment.expire'),
                      type: 'numeric',
                      customStyle: styles.inputSmall,
                      inputError: !verifyDate(date),
                      maxLength: 7
                    }}
                  />
                )}
                <CustomInputText
                  disabled={disabled || isLoading}
                  value={cvv}
                  onChangeValue={setCvv}
                  placeholder={I18n.t('payment.cvv')}
                  label={I18n.t('payment.cvv')}
                  type="numeric"
                  customStyle={styles.inputSmall}
                  maxLength={3}
                />
              </View>
              {!addingCard ? (
                <CustomInputText
                  disabled={isLoading}
                  value={discountCode}
                  onChangeValue={setDiscountCode}
                  placeholder={I18n.t('subscription.discountCode')}
                  label={I18n.t('subscription.discountCode')}
                  uppercase
                  customStyle={styles.input}
                />
              ) : null}
            </View>
          )}
        </ScrollView>
        {!fromBasket && (
          <CustomButton
            text={
              addingCard
                ? addingPaymentType.value === I18n.t('payment.restaurantTicket')
                  ? user.edenred
                    ? I18n.t('payment.disconnectEdenred')
                    : I18n.t('payment.saveTicket')
                  : I18n.t('payment.addCard')
                : I18n.t('payment.validateSub')
            }
            onPress={submit}
            bottom
            inactive={
              !disabled &&
              addingPaymentType.value !== I18n.t('payment.restaurantTicket')
                ? !verifyFields()
                : false
            }
            isLoading={isLoading}
          />
        )}

        {fromBasket && (
          <View style={styles.row}>
            <TouchableRipple
              style={styles.back}
              onPress={() => {
                !isLoading && navigation.goBack();
              }}
            >
              <Image source={AppImages.images.backIcon} />
            </TouchableRipple>
            <BorderedRadiusButton
              text={
                addingPaymentType.value === I18n.t('payment.restaurantTicket')
                  ? user.edenred
                    ? I18n.t('payment.disconnectEdenred')
                    : I18n.t('payment.saveTicket')
                  : I18n.t('payment.addCard')
              }
              onPress={submit}
              primary
              inactive={
                !disabled &&
                addingPaymentType.value !== I18n.t('payment.restaurantTicket')
                  ? !verifyFields()
                  : false
              }
              customStyle={styles.bottomButton}
              borderTopLeft
              isLoading={isLoading}
              bottom
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    flex: 0.25,
    justifyContent: 'center'
  },
  bottomButton: { flex: 0.75 },
  card: { marginHorizontal: 30 },
  container: {
    height: '100%',
    paddingTop: 26
  },
  flex: { backgroundColor: colors.darkGrey, flex: 1 },
  input: {
    backgroundColor: colors.white10,
    marginBottom: 20,
    paddingHorizontal: 16
  },
  marginRight: { width: '85%' },
  inputSmall: {
    backgroundColor: colors.white10,
    flex: 1,
    marginBottom: 20,
    marginRight: 15,
    paddingHorizontal: 16,
    width: screenWidth / 2 - 32.5
  },
  paddingView: {
    paddingBottom: 50,
    paddingHorizontal: 25,
    paddingTop: 36
  },
  row: {
    flexDirection: 'row'
  },
  iconcamera: {
    marginTop: 10,
    position: 'absolute',
    right: 0
  }
});

export default (props: JSX.IntrinsicAttributes & AddPaymentMethodPageProps) => (
  <AuthConsumer>
    {authCtx => (
      <PaymentConsumer>
        {ctx =>
          authCtx &&
          ctx && (
            <AddPaymentMethodPage
              loadData={ctx.loadData}
              setContentIsLoading={authCtx.setContentIsLoading}
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
