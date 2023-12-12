/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, createContext, ReactNode, useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { PlaceChoice, Restaurant, Table } from 'src/models/restaurants';
import {
  Product,
  Basket,
  BasketItem,
  ProductOption
} from 'src/models/products';
import { AuthConsumer } from './AuthContext';
// import AsyncStorage from '@react-native-community/async-storage';
import StorageKeys from 'src/utils/StorageKeys';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { AsyncStorage, Alert } from 'react-native';
import moment from 'moment';
import I18n from 'resources/localization/I18n';
import {
  PaidProducts,
  PaymentMethod,
  SharedPayments
} from 'src/models/payment';
import { UserData } from 'src/models/user';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';

type BookingContextInterface = {
  children?: ReactNode;
  alreadySubscribed?: boolean;
  user?: UserData;
  authLoading?: boolean;
};

type State = {
  placeChoice?: PlaceChoice;
  setPlaceChoice: Function;
  selectedDate: Date;
  setSelectedDate: Function;
  selectedHour?: string;
  setSelectedHour: Function;
  selectedRestaurant?: Restaurant;
  setSelectedRestaurant: Function;
  setPersonNumber: Function;
  personNumber: number;
  ambiance?: string;
  setAmbiance: Function;
  basket: Basket;
  hasBasket: boolean;
  addToBasket: Function;
  removeFromBasket: Function;
  setModalHeight: Function;
  modalHeight: number;
  getTotalPrice: Function;
  selectedCard?: PaymentMethod;
  setSelectedCard: Function;
  freeBasket: Function;
  paymentsAttempts: number[];
  setPaymentAttempts: Function;
  doOrder: Function;
  restauAlreadySet: boolean;
  setRestauAlreadySet: Function;
  setSelectedTable: Function;
  selectedTable?: Table;
  setWaitingProduct: Function;
  waitingProduct?: Product;
  userIsEating: boolean;
  verifyIfBookingIsRunning: Function;
  addProductHasSucceed: boolean;
  setAddProductHasSucceed: Function;
  setBasket: Function;
  setPayWithEdenred: Function;
  payWithEdenred: boolean;
  bookingDescription?: string;
  setBookingDescription?: Function;
  returnToBasketVisible: boolean;
  setReturnToBasketVisible: Function;
  basketPlaceChoice?: PlaceChoice;
  setBasketPlaceChoice: Function;
  sharedPayments?: SharedPayments;
  setWaiterCalled: Function;
  paidProducts?: PaidProducts;
  productWithOptions?: boolean | Product;
  setProductWithOptions: Function;
};

const { Consumer, Provider } = createContext<State | undefined>(undefined);

function BookingProvider({
  children,
  alreadySubscribed,
  user,
  authLoading
}: BookingContextInterface) {
  const [placeChoice, setPlaceChoice] = useState<PlaceChoice | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [personNumber, setPersonNumber] = useState<number>(1);
  const [ambiance, setAmbiance] = useState<string>();
  const [basket, setBasket] = useState<Basket>([]);
  const [basketPlaceChoice, setBasketPlaceChoice] = useState<
    PlaceChoice | undefined
  >();
  const [hasBasket, setHasBasket] = useState<boolean>(false);
  const [returnToBasketVisible, setReturnToBasketVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<PaymentMethod>();
  const [paymentsAttempts, setPaymentAttempts] = useState<number[]>([]);
  const [edenredPayments, setEdenredPayments] = useState<number[]>([]);
  const [addingProvisionalProduct, setAddingProvisionalProduct] = useState<
    boolean
  >(false);
  const [restauAlreadySet, setRestauAlreadySet] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<Table>();
  // waitingProduct is used to store a product when we select it from home and we can't add it to basket
  // because no restaurant is selected
  const [waitingProduct, setWaitingProduct] = useState<Product | undefined>();
  const [userIsEating, setUserIsEating] = useState<boolean>(false);
  const [addProductHasSucceed, setAddProductHasSucceed] = useState<
    boolean | undefined
  >();
  const [payWithEdenred, setPayWithEdenred] = useState<boolean>(false);
  const [bookingDescription, setBookingDescription] = useState<string>('');
  const [basketId, setBasketId] = useState<number | undefined>();
  const [updatingBasket, setUpdatingBasket] = useState<boolean>(false);
  const [sharedPayments, setSharedPayments] = useState<SharedPayments | null>(
    null
  ); // When we share payment with waiter app and we have to pay the rest from app
  const [waiterCalled, setWaiterCalled] = useState<boolean>(false);
  const [paidProducts, setPaidProducts] = useState<PaidProducts>([]);
  const [productWithOptions, setProductWithOptions] = useState<
    boolean | Product
  >(false);

  useEffect(() => {
    getBasket();
    notificationListener();
  }, []);

  useEffect(() => {
    if (basket && basket.length > 0) {
      setHasBasket(true);
    } else if (hasBasket) {
      setHasBasket(false);
    }
  }, [basket]);

  useEffect(() => {
    hasBasket && getSharedPayments();
  }, [hasBasket]);

  useEffect(() => {
    user && verifyIfBookingIsRunning();
    user && getBasket();
    basket && basket.length > 0 && getBasket(); // assigne le panier au user lorsque l'utilisateur avait créé son panier sans être connecté
  }, [user]);

  async function verifyIfBookingIsRunning() {
    const res = await bookingApi.verifyCurrentBooking();
    if (user && res && !res.error && res.is_on_table) {
      setUserIsEating(true);
    } else {
      setUserIsEating(false);
    }
  }

  useEffect(() => {
    if (waiterCalled) {
      const interval = setInterval(() => {
        getSharedPayments();
      }, 10000); // check every 10 seconds if waiter has validated payments for my order

      return () => clearInterval(interval);
    }
  }, [waiterCalled]);

  useEffect(() => {
    if (sharedPayments && sharedPayments.length > 0) {
      getPaidProducts();
    }
  }, [sharedPayments]);

  function getPaidProducts() {
    const paid =
      sharedPayments &&
      sharedPayments.reduce((res: PaidProducts, p) => {
        const index = res.findIndex(item => item.hiboutik_id === p.hiboutik_id);
        if (index !== -1 && p.payment && p.payment.length > 0) {
          res[index].quantity += p.quantity;
          return res;
        } else if (p.payment && p.payment.length > 0) {
          res.push({
            hiboutik_id: p.hiboutik_id,
            quantity: p.quantity
          });
          return res;
        }
        return res;
      }, []);
    paid && setPaidProducts(paid);
  }

  function getDate() {
    if (selectedHour && selectedDate) {
      const hour = selectedHour.split(':')[0];
      const min = selectedHour.split(':')[1];
      const date = selectedDate;
      return moment(
        moment(date)
          .toDate()
          .setHours(parseInt(hour), parseInt(min), 0)
      ).format();
    }
  }

  async function doOrder() {
    const bskt = await bookingApi.getBasket({
      // eslint-disable-next-line @typescript-eslint/camelcase
      customer_id: user && user.id ? user.id.toString() : undefined
    });

    if (bskt && !bskt.error) {
      let date = moment(bskt.hour).isAfter(new Date())
        ? bskt.hour
        : new Date(selectedDate);

      if (!moment(bskt.hour).isAfter(new Date())) {
        selectedHour &&
          new Date(date).setHours(parseInt(selectedHour.split(':')[0]));
        selectedHour &&
          new Date(date).setMinutes(parseInt(selectedHour.split(':')[1]));
        date = moment(date).format('YYYY-MM-DD HH:mm:SS');
      }

      const products =
        bskt.products &&
        bskt.products.reduce(
          (res: { product_id: number; quantity: number }[], prod) => {
            if (prod.product.type !== 'drink') {
              const obj = {
                product_id: prod.product.id,
                quantity: prod.quantity,
                option_id: prod.option ? prod.option.id : null
              };
              sharedPayments &&
                Object.assign(obj, { hiboutik_id: prod.product.hiboutik_id });
              res.push(obj);
              return res;
            }
            return res;
          },
          []
        );
      const drinks =
        bskt.drinks &&
        bskt.drinks.reduce(
          (res: { drink_id: number; quantity: number }[], prod) => {
            if (prod.product.type === 'drink') {
              const obj = {
                drink_id: prod.product.id,
                quantity: prod.quantity,
                option_id: prod.option ? prod.option.id : null
              };
              sharedPayments &&
                Object.assign(obj, { hiboutik_id: prod.product.hiboutik_id });
              res.push(obj);
              return res;
            }
            return res;
          },
          []
        );
      const orderType =
        bskt.order_type === 'BookedOrder'
          ? 'bookOnSite'
          : bskt.order_type === 'OnSiteOrder'
          ? 'alreadyOnSite'
          : 'takeAway';
      const restaurant = bskt.restaurant || selectedRestaurant;
      const count = bskt.person_number;

      const funcToExec =
        orderType === 'alreadyOnSite'
          ? sharedPayments
            ? bookingApi.orderSharedOnSite
            : bookingApi.orderOnSite
          : orderType === 'bookOnSite'
          ? bookingApi.orderAndBookOnSite
          : bookingApi.orderTakeAway;

      await setBasket(bskt.products.concat(bskt.drinks));
      await setPlaceChoice(
        bskt.order_type === 'BookedOrder'
          ? 'bookOnSite'
          : bskt.order_type === 'OnSiteOrder'
          ? 'alreadyOnSite'
          : 'takeAway'
      );
      bskt.restaurant && (await setSelectedRestaurant(bskt.restaurant));
      bskt.person_number && (await setPersonNumber(bskt.person_number));

      bskt.hour &&
        moment(bskt.hour).isAfter(new Date()) &&
        moment(bskt.hour).toDate() &&
        (await setSelectedHour(
          moment(bskt.hour)
            .toDate()
            .getHours()
            .toString() +
            ':' +
            moment(bskt.hour)
              .toDate()
              .getMinutes()
              .toString()
        ));
      date &&
        moment(bskt.hour).isAfter(new Date()) &&
        (await setSelectedDate(moment(bskt.hour).toDate()));

      const pi = await AsyncStorage.getItem(StorageKeys.paymentsAttempts);
      const ep = await AsyncStorage.getItem(StorageKeys.edenredPayments);
      const table = await AsyncStorage.getItem(StorageKeys.selectedTable);
      table && (await setSelectedTable(JSON.parse(table)));
      const sharedOrderId =
        sharedPayments && sharedPayments[0] && sharedPayments[0].order_id;
      const sharedProductsIds =
        sharedPayments &&
        sharedPayments.reduce((res: number[], p) => {
          if (!(p.payment || p.payment.length > 0)) {
            res.push(p.id);
            return res;
          }
          return res;
        }, []);

      const order = await funcToExec({
        restaurant_id: restaurant && restaurant.id,
        drinks: drinks,
        payments: pi ? JSON.parse(pi) : [...paymentsAttempts],
        edenredPayments: ep ? JSON.parse(ep) : [...edenredPayments],
        products: products,
        countPerson: count,
        booked_at: date,
        pickup_at: date,
        table_id: selectedTable ? selectedTable.id : undefined,
        description: bookingDescription,
        order_id: sharedOrderId || undefined,
        order_payment_product: sharedProductsIds || undefined
      });
      setBookingDescription('');
      return order;
    }
  }

  async function freeBasket(apiCall?: boolean) {
    // sometimes we don't need apiCall because when an order succeed, basket is automatically deleted
    setSharedPayments(null);

    const deleteBskt =
      apiCall && basketId && (await bookingApi.deleteBasket(basketId));
    if ((deleteBskt && !deleteBskt.error) || !apiCall) {
      setPaymentAttempts([]);
      setPlaceChoice(undefined);
      setSelectedRestaurant(undefined);
      setSelectedDate(new Date());
      setSelectedHour('');
      setRestauAlreadySet(false);
      setBasket([]);
    } else if (deleteBskt && deleteBskt.error) {
      console.log('==DELETE BASKET ERROR==>', deleteBskt.error);
    }
  }

  function getTotalPrice(reducedPrice?: boolean) {
    return basket
      .reduce((total, item): number => {
        let multiplicator = item.quantity;
        if (sharedPayments && paidProducts && paidProducts.length) {
          const index = paidProducts.findIndex(
            product => product.hiboutik_id === item.product.hiboutik_id
          );
          if (index !== -1 && index !== (null || undefined)) {
            multiplicator = item.quantity - paidProducts[index].quantity;
          }
        }
        return (total +=
          parseFloat(
            alreadySubscribed || reducedPrice
              ? item.product.reduced_price
              : item.product.price
          ) * multiplicator);
      }, 0)
      .toFixed(2);
  }

  async function assignBasket() {
    if (user && user.id) {
      const uniqueId = await AsyncStorage.getItem(StorageKeys.uniqueId);
      const assign =
        uniqueId &&
        (await bookingApi.assignBasket({
          customer_id: user.id.toString(),
          t_id: uniqueId
        }));
      if (assign && !assign.error) {
        await getBasket();
        await AsyncStorage.removeItem(StorageKeys.uniqueId);
      } else {
        console.log('error assign basket');
      }
    }
  }

  async function addToBasket(product: Product, selectedOptionId: number) {
    // if product needs options but we don't have it we quit function and we set productWithOptions to display the choosing option modal
    // addToBasket will be called inside the choosing option modal
    if (
      product &&
      product.options &&
      product.options.length > 0 &&
      !selectedOptionId
    ) {
      setProductWithOptions(product);
      return;
    }
    const uniqueId = await AsyncStorage.getItem(StorageKeys.uniqueId);
    if (!addingProvisionalProduct) {
      setAddingProvisionalProduct(true);
      const res = await bookingApi.updateBasket({
        action: 'reserve',
        restaurantId: selectedRestaurant && selectedRestaurant.id,
        products: [
          {
            product_id: product.id,
            quantity: 1,
            type: product.type === 'drink' ? 'drink' : 'product',
            option_id: selectedOptionId || null
          }
        ],
        customer_id: user && user.id ? user.id.toString() : undefined,
        t_id: !user && uniqueId ? uniqueId : undefined
      });
      if (res && !res.error) {
        setBasket(res.products.concat(res.drinks));
        setAddProductHasSucceed(true);
      } else {
        Alert.alert(I18n.t('error.error'), I18n.t('basket.addError'), [
          {
            text: I18n.t('app.ok'),
            style: 'cancel'
          }
        ]);
        setAddProductHasSucceed(false);
      }
      setAddingProvisionalProduct(false);
    }
    setWaitingProduct(undefined);
  }

  async function removeFromBasket(product: Product, removeAll?: boolean) {
    const uniqueId = await AsyncStorage.getItem(StorageKeys.uniqueId);

    // To avoid to delete already paid products when press delete all quantity of a product
    const quantityAlreadyPayed =
      paidProducts && paidProducts.length
        ? paidProducts[
            paidProducts.findIndex(
              (item): boolean => item.hiboutik_id === product.hiboutik_id
            )
          ].quantity
        : 0;

    const quantity = removeAll
      ? basket[
          basket.findIndex(
            (item: BasketItem): boolean => item.product.id === product.id
          )
        ].quantity - quantityAlreadyPayed
      : 0;

    const optionId = basket[
      basket.findIndex(
        (item: BasketItem): boolean => item.product.id === product.id
      )
    ].option
      ? basket[
          basket.findIndex(
            (item: BasketItem): boolean => item.product.id === product.id
          )
        ].option.id
      : null;

    const res = await bookingApi.updateBasket({
      action: 'free',
      restaurantId: selectedRestaurant && selectedRestaurant.id,
      products: [
        {
          product_id: product.id,
          quantity: removeAll ? quantity : 1,
          type: product.type === 'drink' ? 'drink' : 'product',
          option_id: optionId
        }
      ],
      customer_id: user && user.id ? user.id.toString() : undefined,
      t_id: !user && uniqueId ? uniqueId : undefined
    });

    if (res && !res.error) {
      setBasket(res.products.concat(res.drinks));
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.error'), [
        {
          text: I18n.t('app.ok'),
          style: 'cancel'
        }
      ]);
    }
  }

  async function getBasket() {
    const uniqueId = await AsyncStorage.getItem(StorageKeys.uniqueId);
    const data =
      user && user.id
        ? {
            customer_id: user.id.toString(),
            restaurant_id: selectedRestaurant
              ? selectedRestaurant.id.toString()
              : undefined
          }
        : uniqueId
        ? {
            t_id: uniqueId,
            restaurant_id: selectedRestaurant
              ? selectedRestaurant.id.toString()
              : undefined
          }
        : {
            restaurant_id: selectedRestaurant
              ? selectedRestaurant.id.toString()
              : undefined
          };
    const bskt = await bookingApi.getBasket(data);

    if (bskt && !bskt.error) {
      setBasket(bskt.products.concat(bskt.drinks));
      bskt.id && setBasketId(bskt.id);
      setBasketPlaceChoice(
        bskt.order_type === 'BookedOrder'
          ? 'bookOnSite'
          : bskt.order_type === 'OnSiteOrder'
          ? 'alreadyOnSite'
          : 'takeAway'
      );
      bskt.restaurant && setSelectedRestaurant(bskt.restaurant);
      bskt.person_number && setPersonNumber(bskt.person_number);
      const hour =
        bskt.order_type === 'OnSiteOrder' ? bskt.updated_at : bskt.hour;

      hour &&
        moment(hour).isAfter(new Date()) &&
        moment(hour).toDate() &&
        setSelectedHour(
          moment(hour)
            .toDate()
            .getHours()
            .toString() +
            ':' +
            (moment(hour)
              .toDate()
              .getMinutes() < 10
              ? '0'
              : '') +
            moment(hour)
              .toDate()
              .getMinutes()
              .toString()
        );
      hour &&
        moment(hour).isAfter(new Date()) &&
        setSelectedDate(moment(hour).toDate());

      if (!uniqueId && bskt.t_id && !user && !authLoading) {
        await AsyncStorage.setItem(StorageKeys.uniqueId, bskt.t_id);
      } else if (uniqueId && user && user.id) {
        await assignBasket();
      }
    } else if (
      (bskt && bskt.error && bskt.error.message.error === 'basket.not.found') ||
      !bskt
    ) {
      await AsyncStorage.removeItem(StorageKeys.uniqueId);
      await getBasket();
    }
  }

  useEffect(() => {
    selectedTable &&
      AsyncStorage.setItem(
        StorageKeys.selectedTable,
        JSON.stringify(selectedTable)
      );
  }, [selectedTable]);

  useEffect(() => {
    !authLoading && putBasketInfos();
  }, [
    user && user.id,
    selectedHour,
    selectedDate,
    personNumber,
    selectedRestaurant,
    placeChoice
  ]);

  async function putBasketInfos() {
    setUpdatingBasket(true);
    const uniqueId = await AsyncStorage.getItem(StorageKeys.uniqueId);

    const data = {
      t_id: !user && uniqueId ? uniqueId : undefined,
      customer_id: user && user.id ? user.id.toString() : undefined,
      hour: getDate(),
      personNumber: personNumber,
      selectedRestaurant: selectedRestaurant && selectedRestaurant.id,
      order_type:
        placeChoice === 'alreadyOnSite'
          ? 'OnSiteOrder'
          : placeChoice === 'bookOnSite'
          ? 'BookedOrder'
          : placeChoice === 'takeAway'
          ? 'TakeAwayOrder'
          : undefined
    };
    const res = await bookingApi.setBasketInfos(data);
    if (res && !res.error) {
      await setBasket(res.products.concat(res.drinks));
      if (!uniqueId && res.t_id && !user && !authLoading) {
        await AsyncStorage.setItem(StorageKeys.uniqueId, res.t_id);
      } else if (uniqueId && user && user.id) {
        await assignBasket();
      }
    } else if (
      (res && res.error && res.error.message.error === 'basket.not.found') ||
      !res
    ) {
      await AsyncStorage.removeItem(StorageKeys.uniqueId);
    } else if (res && res.error) {
      await putBasketInfos();
    }
    // if restaurant is not updated in basket -> we force to update basket
    if (
      (res &&
        res.restaurant &&
        selectedRestaurant &&
        res.restaurant.id !== selectedRestaurant.id) ||
      (!res.restaurant && selectedRestaurant)
    ) {
      await putBasketInfos();
    }
    setUpdatingBasket(false);
  }

  async function getSharedPayments() {
    if (!sharedPayments) {
      const shared = await bookingApi.getSharedPayments();
      if (shared && !shared.error && shared.length) {
        if (
          shared.findIndex(item => item.payment && item.payment.length) !== -1
        ) {
          setSharedPayments(shared);
        }
        waiterCalled && setWaiterCalled(false);
      } else {
        setSharedPayments(null);
        setPaidProducts([]);
      }
    }
  }

  async function notificationListener() {
    messaging().onMessage(remoteMessage => {
      checkNotification(remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      checkNotification(remoteMessage);
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          checkNotification(remoteMessage);
        }
      });
  }

  function checkNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) {
    if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.path === 'waiter-order-waiting'
    ) {
      getSharedPayments();
    }
    // when the waiter has done the order for the user
    if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.path === 'waiter-order-done'
    ) {
      getBasket();
      navigatorRef.current.navigate(RoutesNames.HomeStack, {
        screen: RoutesNames.OrderOnSiteSummaryPage,
        params: {
          executeOrder: false
        }
      });
    }
  }

  return (
    <Provider
      value={{
        placeChoice,
        setPlaceChoice,
        selectedDate,
        setSelectedDate,
        selectedHour,
        setSelectedHour,
        selectedRestaurant,
        setSelectedRestaurant,
        personNumber,
        setPersonNumber,
        ambiance,
        setAmbiance,
        basket,
        hasBasket,
        addToBasket,
        removeFromBasket,
        modalHeight,
        setModalHeight,
        getTotalPrice,
        selectedCard,
        setSelectedCard,
        freeBasket,
        paymentsAttempts,
        setPaymentAttempts,
        doOrder,
        restauAlreadySet,
        setRestauAlreadySet,
        setSelectedTable,
        selectedTable,
        setWaitingProduct,
        waitingProduct,
        userIsEating,
        setUserIsEating,
        verifyIfBookingIsRunning,
        addProductHasSucceed,
        setAddProductHasSucceed,
        setBasket,
        setPayWithEdenred,
        payWithEdenred,
        edenredPayments,
        setEdenredPayments,
        bookingDescription,
        setBookingDescription,
        returnToBasketVisible,
        setReturnToBasketVisible,
        basketPlaceChoice,
        setBasketPlaceChoice,
        sharedPayments,
        setWaiterCalled,
        paidProducts,
        productWithOptions,
        setProductWithOptions
      }}
    >
      {children}
    </Provider>
  );
}

export { Consumer as BookingConsumer };

export default (props: JSX.IntrinsicAttributes & BookingContextInterface) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <BookingProvider
          alreadySubscribed={ctx.alreadySubscribed}
          user={ctx.user}
          authLoading={ctx.authLoading}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
