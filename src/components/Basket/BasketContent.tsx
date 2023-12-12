/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  Alert,
  AsyncStorage,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { isExpoApp, stripeKeyTest } from 'src/utils/constants';
// import AsyncStorage from '@react-native-community/async-storage';

import colors from 'src/resources/common/colors';
import { BasketItem, Basket } from 'src/models/products';
import { BookingConsumer } from 'src/store/BookingContext';
import I18n from 'resources/localization/I18n';
import { AuthConsumer } from 'src/store/AuthContext';
import { UserData } from 'src/models/user';
import BasketItemComponent from './BasketItemComponent';
import BorderedRadiusButton from '../Buttons/BorderedRadiusButton';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';
import PaymentMethodList from './PaymentMethodList';
import { PaymentConsumer } from 'src/store/PaymentContext';
import bookingApi from 'src/services/bookingApi/bookingApi';
import paymentApi from 'src/services/payment/paymentApi';
import StorageKeys from 'src/utils/StorageKeys';
import {
  PaidProducts,
  PaymentMethod,
  SharedPayments
} from 'src/models/payment';
import { PlaceChoice, Restaurant, Table } from 'src/models/restaurants';
import CustomButton from '../Buttons/CustomButton';
import { TextInput } from 'react-native-paper';
import OrderedProductsList from './OrderedProductsList';
import SharedPaymentsComponent from './SharedPaymentsComponent';
import { useNavigation } from '@react-navigation/native';

type BasketContentprops = {
  basket?: Basket;
  getTotalPrice?: Function;
  onPressProduct: Function;
  user?: UserData;
  paymentMethodList?: PaymentMethod[];
  selectedCard?: PaymentMethod;
  alreadySubscribed?: boolean;
  setPaymentAttempts?: Function;
  paymentsAttempts?: number[];
  selectedDate?: Date;
  isLoading?: boolean;
  setContentIsLoading?: Function;
  placeChoice: PlaceChoice;
  payWithEdenred: boolean;
  edenredPayments: number[];
  setEdenredPayments: Function;
  selectedRestaurant?: Restaurant;
  bookingDescription?: string;
  setBookingDescription: Function;
  sharedPayments?: SharedPayments;
  setWaiterCalled?: Function;
  paidProducts?: PaidProducts;
  selectedTable?: Table;
};

function BasketContent({
  basket,
  onPressProduct,
  user,
  getTotalPrice,
  paymentMethodList,
  selectedCard,
  setPaymentAttempts,
  alreadySubscribed,
  paymentsAttempts,
  selectedDate,
  isLoading,
  placeChoice,
  setContentIsLoading,
  payWithEdenred,
  edenredPayments,
  setEdenredPayments,
  selectedRestaurant,
  bookingDescription,
  setBookingDescription,
  sharedPayments,
  setWaiterCalled,
  paidProducts,
  selectedTable
}: BasketContentprops) {
  const navigation = useNavigation();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoadingPay, setIsLoadingPay] = useState<boolean>(false);
  const [isLoadingSub, setIsLoadingSub] = useState<boolean>(false);
  const [isLoadingCallWaiter, setIsLoadingCallWaiter] = useState<boolean>(
    false
  );

  useEffect(() => {
    getPrice();
  }, [basket]);

  useEffect(() => {
    setContentIsLoading(isLoading || isLoadingPay || isLoadingSub);
  }, [isLoading, isLoadingPay, isLoadingSub]);

  function getPrice() {
    let total = 0;
    basket &&
      basket.map(
        (item: BasketItem) =>
          (total += parseFloat(item.product.price) * item.quantity)
      );
    setTotalPrice(total);
  }

  async function pay() {
    setIsLoadingPay(true);

    if ((selectedCard || payWithEdenred) && getTotalPrice) {
      if (payWithEdenred) {
        const authorize = await paymentApi.edenredAuthorize(getTotalPrice());
        if (authorize.error) {
          showAlert();
        } else {
          if (authorize && authorize.authorized_amount >= getTotalPrice()) {
            AsyncStorage.setItem(
              StorageKeys.lastPaymentId,
              authorize.payment_id
            );
            const tmp = edenredPayments;
            tmp.push(authorize.payment_id);
            await setEdenredPayments(tmp);
            AsyncStorage.setItem(
              StorageKeys.edenredPayments,
              JSON.stringify(tmp)
            );
            redirectAfterPayment();
            setIsLoadingPay(false);
          } else if (
            authorize &&
            authorize.authorized_amount < getTotalPrice() &&
            !selectedCard
          ) {
            Alert.alert(
              I18n.t('error.error'),
              'Le montant est supérieur à votre crédit Edenred, veuillez sélectionner une carte bancaire pour compléter le paiement.',
              [{ text: I18n.t('app.ok'), style: 'cancel' }]
            );
            setIsLoadingPay(false);
          } else if (
            authorize &&
            authorize.authorized_amount < getTotalPrice() &&
            selectedCard
          ) {
            AsyncStorage.setItem(
              StorageKeys.lastPaymentId,
              authorize.payment_id
            );
            const tmp = edenredPayments;
            tmp.push(authorize.payment_id);
            await setEdenredPayments(tmp);
            AsyncStorage.setItem(
              StorageKeys.edenredPayments,
              JSON.stringify(tmp)
            );
            payWithCard(getTotalPrice() - authorize.authorized_amount);
          }
        }
      } else {
        payWithCard();
      }
    }
  }

  async function payWithCard(customPrice?: number) {
    if (selectedCard && getTotalPrice) {
      const payment = await bookingApi.payOrder(
        customPrice || getTotalPrice(),
        selectedCard.id,
        selectedRestaurant && selectedRestaurant.id
      );
      console.log('coucou payment', payment, selectedCard);

      if (!payment.error) {
        AsyncStorage.setItem(StorageKeys.lastPaymentId, payment.stripe_id);
        const tmp = paymentsAttempts;
        tmp.push(payment.id);
        await setPaymentAttempts(tmp);
        await AsyncStorage.setItem(
          StorageKeys.paymentsAttempts,
          JSON.stringify(tmp)
        );
        await AsyncStorage.setItem(
          StorageKeys.date,
          JSON.stringify(selectedDate)
        );
        if (payment.action) {
          try {
            const browser = await WebBrowser.openBrowserAsync(payment.action);

            const payInfos = await paymentApi.getPaymentHistory({
              payments: [payment.id],
              retries: true
            });

            if (
              ((browser.type === 'cancel' || browser.type === 'dismiss') &&
                payInfos &&
                payInfos[0] &&
                payInfos[0].status !== 'success') ||
              (payInfos && payInfos.error)
            ) {
              console.log('coucou onn est dans 1', browser);
              await cancelPayment(payment.id);
              showAlert();
            }
          } catch (error) {
            console.log('coucou onn est dans 2', error);
            await cancelPayment(payment.id);
            showAlert();
          }
        } else {
          const payInfos = await paymentApi.getPaymentHistory({
            payments: [payment.id],
            retries: true
          });
          if (payInfos && payInfos[0] && payInfos[0].status === 'success') {
            redirectAfterPayment();
          } else {
            showAlert();
          }
        }
      } else {
        const err =
          payment.error && payment.error.message
            ? payment.error.message
            : payment.error;
        if (
          err.includes('card_declined') ||
          err.includes('payment_intent.payment_failed')
        ) {
          Alert.alert(I18n.t('error.error'), I18n.t('payment.cardDeclined'), [
            { text: I18n.t('app.ok'), style: 'cancel' }
          ]);
        } else {
          showAlert();
        }
      }
    }
    setIsLoadingPay(false);
  }

  async function redirectAfterPayment() {
    if (placeChoice !== 'alreadyOnSite') {
      navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
        screen: RoutesNames.RestaurantsPage
      });
      await navigatorRef.current.navigate(RoutesNames.HomeStack, {
        screen: RoutesNames.HomePage,
        params: { showOrderConfirm: true }
      });
    } else {
      await navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
        screen: RoutesNames.RestaurantsPage
      });
      navigatorRef.current.navigate(RoutesNames.HomeStack, {
        screen: RoutesNames.HomePage
      });
      await navigatorRef.current.navigate(RoutesNames.OrderOnSiteSummaryPage, {
        executeOrder: true
      });
    }
  }

  async function cancelPayment(id: number) {
    console.log('coucou onn est dans le cancel', id);
    const cancel = await bookingApi.cancelPayment(id);
    console.log('coucou le cancel payment', cancel);
  }

  function showAlert() {
    Alert.alert(I18n.t('error.error'), I18n.t('app.error'), [
      { text: I18n.t('app.ok'), style: 'cancel' }
    ]);
  }

  async function callWaiter() {
    setIsLoadingCallWaiter(true);
    const storedTable = await AsyncStorage.getItem(StorageKeys.selectedTable);
    const table = selectedTable
      ? selectedTable
      : storedTable && JSON.parse(storedTable);

    const call =
      selectedRestaurant &&
      (await bookingApi.callWaiter(selectedRestaurant.id, table.id));
    if (call && !call.error) {
      Alert.alert(
        I18n.t('basket.callWaiter'),
        I18n.t('basket.callWaiterConfirm'),
        [{ text: I18n.t('app.ok'), style: 'cancel' }]
      );
      setWaiterCalled && setWaiterCalled(true);
    }
    if (call && call.error) {
      showAlert();
    }
    setIsLoadingCallWaiter(false);
  }

  function renderFooter() {
    return (
      <View style={styles.footer}>
        {!alreadySubscribed && !sharedPayments && (
          <View style={styles.row}>
            <Text style={styles.total}>{I18n.t('basket.total')} </Text>
            <Text style={[styles.total, styles.right]}>{`${totalPrice.toFixed(
              2
            )}€`}</Text>
          </View>
        )}

        {sharedPayments && (
          <SharedPaymentsComponent sharedPayments={sharedPayments} />
        )}

        <View style={styles.row}>
          <View>
            <Text style={[styles.total, styles.blue]}>
              {sharedPayments
                ? `${I18n.t('basket.totalLeft')}${
                    alreadySubscribed ? I18n.t('basket.subscribedPrice') : ''
                  }`
                : alreadySubscribed
                ? I18n.t('basket.subscribedTotal')
                : I18n.t('basket.subscribedTotalLegend')}
            </Text>
            {!alreadySubscribed && !sharedPayments && (
              <Text style={[styles.totalSub, styles.blue]}>
                {I18n.t('basket.legend')}
              </Text>
            )}
          </View>
          <Text style={[styles.total, styles.right, styles.blue]}>
            {`${getTotalPrice && getTotalPrice(true)}€`}
          </Text>
        </View>
        {placeChoice === 'alreadyOnSite' && !sharedPayments && (
          <>
            <CustomButton
              isLoading={isLoadingCallWaiter}
              outlined
              text={I18n.t('basket.callWaiter')}
              onPress={() => {
                callWaiter();
              }}
            />
            <OrderedProductsList />
          </>
        )}
        {placeChoice === 'bookOnSite' && (
          <>
            <Text style={styles.descriptionTitle}>
              {I18n.t('booking.request')}
            </Text>
            <TextInput
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.input, { marginBottom: '50%' }]}
              numberOfLines={5}
              multiline
              onFocus={() => {
                return;
              }}
              onEndEditing={() => {
                return;
              }}
              value={bookingDescription}
              onChangeText={(text: string) => setBookingDescription(text)}
              underlineColor={colors.white}
              placeholderTextColor={colors.white}
              underlineColorAndroid={colors.white}
              theme={{
                colors: {
                  text: colors.white,
                  primary: colors.white
                }
              }}
            />
          </>
        )}
      </View>
    );
  }

  function renderProductItem(item: BasketItem) {
    const index =
      paidProducts &&
      paidProducts.findIndex(p => p.hiboutik_id === item.product.hiboutik_id);
    if (
      placeChoice != 'alreadyOnSite' ||
      index === -1 ||
      index === (null || undefined)
    ) {
      return (
        <BasketItemComponent
          item={item}
          onPressProduct={() => onPressProduct(item.product)}
        />
      );
    } else if (
      index !== -1 &&
      paidProducts &&
      paidProducts[index].quantity >= item.quantity
    ) {
      return (
        <BasketItemComponent
          item={item}
          onPressProduct={() => onPressProduct(item.product)}
          paid
        />
      );
    } else if (
      index !== -1 &&
      paidProducts &&
      paidProducts[index].quantity < item.quantity
    ) {
      const diff = item.quantity - paidProducts[index].quantity;
      const notPaidItem = { ...item };
      notPaidItem.quantity = diff;
      const paidItem = { ...item };
      paidItem.quantity = paidProducts[index].quantity;
      return (
        <>
          <BasketItemComponent
            item={notPaidItem}
            onPressProduct={() => onPressProduct(item.product)}
          />
          <BasketItemComponent
            item={paidItem}
            onPressProduct={() => onPressProduct(item.product)}
            paid
          />
        </>
      );
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.flex}>
      <FlatList
        data={basket}
        style={styles.flatlist}
        renderItem={({ item }) => renderProductItem(item)}
        ListFooterComponent={renderFooter()}
        keyExtractor={item => item.product.id.toString()}
      />

      <View style={styles.marginTop}>
        {user &&
          ((paymentMethodList && paymentMethodList.length > 0) ||
            isLoading) && (
            <>
              <Text style={styles.subtitle}>
                {I18n.t('basket.paymentMethod')}
              </Text>
              <PaymentMethodList />
            </>
          )}
        {paymentMethodList &&
          paymentMethodList.length > 0 &&
          alreadySubscribed && (
            <BorderedRadiusButton
              text={I18n.t('basket.pay')}
              onPress={async () => {
                await pay();
              }}
              primary
              inactive={
                (!selectedCard && !payWithEdenred) ||
                isLoadingPay ||
                isLoadingSub
              }
              isLoading={isLoadingPay}
              bottom
            />
          )}
        {user && (
          <View style={styles.rowButtons}>
            {paymentMethodList &&
            !alreadySubscribed &&
            paymentMethodList.length > 0 ? (
              <>
                <BorderedRadiusButton
                  text={I18n.t('basket.pay')}
                  onPress={async () => {
                    await pay();
                  }}
                  inactive={
                    (!selectedCard && !payWithEdenred) ||
                    isLoadingPay ||
                    isLoadingSub
                  }
                  customStyle={styles.flex}
                  isLoading={isLoadingPay}
                  bottom
                />
                <BorderedRadiusButton
                  text={I18n.t('basket.subscribeAndPay')}
                  onPress={() => {
                    navigation.navigate(
                      RoutesNames.SubscriptionDescriptionPage,
                      {
                        showHeader: true,
                        previous_screen: 'Panier'
                      }
                    );
                  }}
                  primary
                  inactive={isLoadingPay || isLoadingSub}
                  customStyle={[styles.flex, styles.blueBg]}
                  isLoading={isLoadingSub}
                  bottom
                />
              </>
            ) : (
              !isLoading &&
              (!paymentMethodList ||
                (paymentMethodList && paymentMethodList.length === 0)) && (
                <BorderedRadiusButton
                  text={I18n.t('basket.addPayment')}
                  onPress={() => {
                    navigatorRef.current.navigate(
                      RoutesNames.PaymentModalNavigator,
                      {
                        screen: RoutesNames.AddPaymentMethodPage,
                        params: { addingCard: true, fromBasket: true }
                      }
                    );
                  }}
                  bottom
                  primary
                  borderTopLeft
                  customStyle={styles.flex}
                />
              )
            )}
          </View>
        )}
        {!user && (
          <BorderedRadiusButton
            text={I18n.t('basket.connect')}
            onPress={() => {
              navigatorRef.current.navigate(RoutesNames.PaymentModalNavigator, {
                screen: RoutesNames.LoginPage
              });
            }}
            borderTopLeft
            primary
            bottom
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blue: {
    color: colors.greenyBlue
  },
  blueBg: { backgroundColor: colors.greenyBlue },
  container: {
    backgroundColor: colors.darkGrey,
    height: '100%'
  },
  flatlist: {
    paddingHorizontal: 25
  },
  flex: { flex: 1 },
  footer: {
    borderTopColor: colors.white10,
    borderTopWidth: 1,
    paddingTop: 20
  },
  marginTop: {
    marginTop: 'auto'
  },
  right: { marginLeft: 'auto' },
  row: {
    flexDirection: 'row',
    marginBottom: 12
  },
  rowButtons: {
    flexDirection: 'row'
  },
  subtitle: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: 16,
    marginLeft: 25,
    marginTop: 20
  },
  total: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18
  },
  totalSub: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0.25
  },
  input: {
    backgroundColor: colors.white10,
    marginTop: 5
  },
  descriptionTitle: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 32
  }
});

export default (props: JSX.IntrinsicAttributes & BasketContentprops) => (
  <AuthConsumer>
    {authCtx => (
      <BookingConsumer>
        {ctx => (
          <PaymentConsumer>
            {payCtx =>
              ctx &&
              authCtx &&
              payCtx && (
                <BasketContent
                  basket={ctx.basket}
                  getTotalPrice={ctx.getTotalPrice}
                  user={authCtx.user}
                  paymentMethodList={payCtx.paymentMethodList}
                  selectedCard={ctx.selectedCard}
                  alreadySubscribed={payCtx.alreadySubscribed}
                  setPaymentAttempts={ctx.setPaymentAttempts}
                  paymentsAttempts={ctx.paymentsAttempts}
                  selectedDate={ctx.selectedDate}
                  isLoading={payCtx.isLoading}
                  setContentIsLoading={authCtx.setContentIsLoading}
                  placeChoice={ctx.placeChoice}
                  payWithEdenred={ctx.payWithEdenred}
                  edenredPayments={ctx.edenredPayments}
                  setEdenredPayments={ctx.setEdenredPayments}
                  selectedRestaurant={ctx.selectedRestaurant}
                  selectedTable={ctx.selectedTable}
                  bookingDescription={ctx.bookingDescription}
                  setBookingDescription={ctx.setBookingDescription}
                  sharedPayments={ctx.sharedPayments}
                  setWaiterCalled={ctx.setWaiterCalled}
                  paidProducts={ctx.paidProducts}
                  {...props}
                />
              )
            }
          </PaymentConsumer>
        )}
      </BookingConsumer>
    )}
  </AuthConsumer>
);
