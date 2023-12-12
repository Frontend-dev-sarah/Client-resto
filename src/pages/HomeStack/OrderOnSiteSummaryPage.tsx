import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import Constants from 'expo-constants';
import I18n from 'resources/localization/I18n';
import LottieView from 'lottie-react-native';
import waitingTable from 'src/resources/lottie/waitingTable.json';
import servedTable from 'src/resources/lottie/servedTable.json';
import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import { HomeStackParamList } from 'src/navigation/HomeStack';
import { RouteProp } from '@react-navigation/native';
import { BookingConsumer } from 'src/store/BookingContext';
import colors from 'src/resources/common/colors';
import AvatarComponent from 'src/components/Avatar/AvatarComponent';
import CustomButton from 'src/components/Buttons/CustomButton';
import BasketItemComponent from 'src/components/Basket/BasketItemComponent';
import RoutesNames from 'src/navigation/RoutesNames';
import { Product, ShortProduct } from 'src/models/products';
import { Table, Restaurant } from 'src/models/restaurants';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { Order } from 'src/models/payment';
import { screenWidth } from 'src/utils/constants';
import productsApi from 'src/services/products/productsApi';
import HaveToClaimProductModal from 'src/components/Modal/HaveToClaimProductModal';

type RecipePageRouteProp = RouteProp<
  HomeStackParamList,
  'OrderOnSiteSummaryPage'
>;

type OrderOnSiteSummaryPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  selectedTable: Table;
  freeBasket: Function;
  doOrder: Function;
  verifyIfBookingIsRunning: Function;
  route: RecipePageRouteProp;
  setSelectedTable: Function;
  setSelectedRestaurant: Function;
  setPlaceChoice: Function;
  user: UserData;
  userIsEating?: boolean;
  selectedRestaurant: Restaurant;
  hasBasket?: boolean;
};

function OrderOnSiteSummaryPage({
  navigation,
  selectedTable,
  freeBasket,
  doOrder,
  verifyIfBookingIsRunning,
  route,
  setSelectedTable,
  setSelectedRestaurant,
  setPlaceChoice,
  user,
  userIsEating,
  selectedRestaurant,
  hasBasket
}: OrderOnSiteSummaryPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ user: UserData; orders: Order[] }[]>();
  const [hasProducts, setHasProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productsSelectable, setProductsSelectable] = useState<boolean>(false);
  const [askingLoading, setAskingLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (route.params && route.params.executeOrder) {
      doTheOrder();
    } else {
      getInfos();
    }
    verifyIfBookingIsRunning();
  }, []);

  useEffect(() => {
    if (!userIsEating && !isLoading) {
      navigation.navigate(RoutesNames.HomePage);
    }
  }, [userIsEating, isLoading]);

  async function getInfos(hideLoader?: boolean) {
    !hideLoader && setIsLoading(true);
    const res = await bookingApi.verifyCurrentBooking();
    if (res && !res.error) {
      res.orders_on_table && setData(res.orders_on_table);
      res.table && setSelectedTable(res.table);
    }
    await verifyIfBookingIsRunning();
    !hideLoader && setIsLoading(false);
  }

  async function doTheOrder() {
    const res = await doOrder();
    if (res && !res.error) {
      freeBasket && freeBasket();
      setPlaceChoice && setPlaceChoice();
      setModalVisible(true);
    } else if (res.error) {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    getInfos();
  }

  async function onPressProduct(product: ShortProduct) {
    await setPlaceChoice('alreadyOnSite');
    data &&
      data[0] &&
      data[0].orders[0] &&
      (await setSelectedRestaurant(data[0].orders[0].orderable.restaurant));
    navigation.navigate(RoutesNames.ProductDetailsPage, {
      product: product,
      orderDisabled: true
    });
  }

  async function newOrder() {
    await setPlaceChoice('alreadyOnSite');
    data &&
      data[0] &&
      data[0].orders[0] &&
      (await setSelectedRestaurant(data[0].orders[0].orderable.restaurant));

    navigation.navigate(RoutesNames.CardPage, { simpleCard: false });
  }

  function askCloseTable() {
    Alert.alert(
      I18n.t('orderOnSite.closeTable'),
      I18n.t('orderOnSite.closeConfirm'),
      [
        { text: I18n.t('app.cancel'), style: 'cancel' },
        { text: I18n.t('app.ok'), onPress: closeTable }
      ]
    );
  }

  async function closeTable() {
    const res = await bookingApi.closeTable(selectedTable.id);

    if (res && !res.error) {
      await freeBasket();
      navigation.navigate(RoutesNames.HomePage);
    }
    verifyIfBookingIsRunning();
  }

  function renderAvatar(user: UserData) {
    return (
      <AvatarComponent
        customStyle={styles.avatar}
        textStyle={styles.avatarText}
        size={32}
        name={user.lastname}
        firstName={user.firstname}
        avatar={user.avatar ? user.avatar : null}
      />
    );
  }

  function renderStatusText() {
    const index =
      data &&
      data.findIndex(data => user && data.user && data.user.id === user.id);

    if (user && index && data) {
      const status =
        data[index].orders[data[index].orders.length - 1] &&
        data[index].orders[data[index].orders.length - 1].kitchen_status;

      const text =
        status === 'done'
          ? I18n.t('orderOnSite.goodApetit')
          : status === 'starter'
          ? I18n.t('orderOnSite.starterIsRunning')
          : status === 'main_course'
          ? I18n.t('orderOnSite.mainCourseIsRunning')
          : status === 'dessert'
          ? I18n.t('orderOnSite.dessertIsRunning')
          : I18n.t('orderOnSite.orderSent');
      return (
        <>
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={status === 'done' ? servedTable : waitingTable}
              hardwareAccelerationAndroid
              autoPlay
              loop={false}
            />
          </View>
          <Text style={styles.title2}>{text}</Text>
        </>
      );
    } else return null;
  }

  function renderStatusSubtext() {
    const index =
      data && data.findIndex(data => user && data.user.id === user.id);
    if (user && data && index) {
      return data[index].orders[data[index].orders.length - 1] &&
        data[index].orders[data[index].orders.length - 1].kitchen_status ===
          'done'
        ? I18n.t('orderOnSite.done')
        : I18n.t('orderOnSite.orderSent2');
    } else return '';
  }

  function onSelectProduct(item: Product) {
    const tmpSelectedProducts = [...selectedProducts];
    const alreadyAddedIndex = tmpSelectedProducts.indexOf(item.id);
    if (alreadyAddedIndex !== -1) {
      tmpSelectedProducts.splice(alreadyAddedIndex, 1);
    } else {
      tmpSelectedProducts.push(item.id);
    }
    setSelectedProducts(tmpSelectedProducts);
  }

  useEffect(() => {
    if (!productsSelectable && selectedProducts.length > 0) {
      setProductsSelectable(true);
    } else if (productsSelectable && selectedProducts.length === 0) {
      setProductsSelectable(false);
    }
  }, [selectedProducts]);

  async function askProducts() {
    setAskingLoading(true);
    // ask products by id to the api
    const ask = await productsApi.askProducts(selectedProducts);
    if (ask && !ask.error) {
      // get infos again when we asked products to know if our products are ordered
      await getInfos(true);
      setSelectedProducts([]);
    } else if (ask.error) {
      console.log('==ASK PRODUCTS ERROR==>', ask.error);
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setAskingLoading(false);
  }

  return (
    <View style={styles.mainContainer}>
      <HaveToClaimProductModal
        visible={modalVisible}
        hideModal={() => setModalVisible(false)}
      />
      <>
        <Text style={styles.title}>{selectedTable && selectedTable.name}</Text>
        <View style={styles.bigBarre} />
        <FlatList
          horizontal
          data={data}
          contentContainerStyle={styles.avatarlist}
          renderItem={({ item }) => renderAvatar(item.user)}
        />
        <View style={styles.bigBarre} />

        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => getInfos()}
              colors={[colors.darkGrey]}
            />
          }
        >
          {renderStatusText()}

          <Text style={styles.subtitle}>{renderStatusSubtext()}</Text>

          {!isLoading && (
            <>
              <CustomButton
                text={I18n.t('orderOnSite.neworder')}
                primary
                outlined
                customStyle={styles.button}
                onPress={newOrder}
                badge={hasBasket}
              />
              <CustomButton
                text={I18n.t('orderOnSite.closeTable')}
                primary
                outlined
                customStyle={[styles.button, styles.button2]}
                onPress={askCloseTable}
              />
            </>
          )}
          {hasProducts ? (
            <>
              <Text style={styles.title2}>
                {I18n.t('orderOnSite.orderRunning')}
              </Text>
              <Text style={[styles.claim]}>{I18n.t('orderOnSite.claim')}</Text>
            </>
          ) : (
            isLoading === false && (
              <Text style={styles.title2}>
                {
                  'Miam, c\'était bon ? Nous espérons que vous vous êtes régalés. Envie d\'autre chose ? "Revoir la carte". Si vous partez, n\'oubliez pas de fermer votre table. "Fermer la table"'
                }
              </Text>
            )
          )}

          {data &&
            data.map(item => (
              <>
                <View>
                  <View style={styles.row}>
                    <View style={styles.barre} />
                    <AvatarComponent
                      customStyle={styles.bigavatar}
                      textStyle={styles.bigavatarText}
                      size={48}
                      name={item.user.lastname}
                      firstName={item.user.firstname}
                      avatar={item.user.avatar ? item.user.avatar : null}
                    />
                    <View style={styles.barre} />
                  </View>
                  <Text style={styles.name}>
                    {item.user.firstname || '' + ' ' + item.user.lastname || ''}
                  </Text>
                </View>

                <FlatList
                  style={styles.flatlist}
                  data={item.orders.reduce((res: ShortProduct[], order) => {
                    return res.concat(order.products);
                  }, [])}
                  renderItem={({ item }) => {
                    setHasProducts(true);
                    return (
                      <BasketItemComponent
                        disableDelete
                        item={{
                          product: item,
                          quantity: item.quantity,
                          option: item.option
                        }}
                        onPressProduct={onPressProduct}
                        selectProduct={onSelectProduct}
                        isSelected={selectedProducts.indexOf(item.id) !== -1}
                        selectable={productsSelectable}
                      />
                    );
                  }}
                  keyExtractor={item => item.id.toString()}
                />
              </>
            ))}
          {selectedProducts && selectedProducts.length > 0 && (
            <CustomButton
              text={I18n.t('basket.askProducts')}
              primary
              customStyle={styles.askBtn}
              onPress={askProducts}
              isLoading={askingLoading}
            />
          )}
        </ScrollView>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 16,
    height: 32,
    marginHorizontal: 8,
    marginVertical: 24,
    width: 32
  },
  avatarText: {
    fontSize: 15
  },
  avatarlist: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  barre: {
    borderColor: colors.white40,
    borderRadius: 0.5,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 1,
    width: 55
  },
  bigBarre: {
    borderColor: colors.white40,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 1,
    width: screenWidth - 50
  },
  bigavatar: {
    borderRadius: 24,
    height: 48,
    marginHorizontal: 12,
    width: 48
  },
  bigavatarText: {
    fontSize: 24
  },
  button: {
    marginTop: 24,
    width: 'auto'
  },
  askBtn: {
    marginTop: 15
  },
  button2: { marginBottom: 40 },
  container: {
    alignItems: 'center',
    paddingBottom: 168,
    paddingHorizontal: 25
  },
  flatlist: {
    paddingTop: 24
  },
  lottie: {
    height: 128,
    width: 128
  },
  lottieContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  mainContainer: {
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 15
  },
  name: {
    color: colors.paleOrange,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 18,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center'
  },
  row: { alignItems: 'center', flexDirection: 'row', marginTop: 16 },
  subtitle: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 13,
    textAlign: 'center'
  },
  title2: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 28,
    marginTop: 32,
    paddingHorizontal: 25,
    textAlign: 'center'
  },
  claim: {
    marginTop: 10,
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 13,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 13,
    textAlign: 'center'
  }
});

export default (
  props: JSX.IntrinsicAttributes & OrderOnSiteSummaryPageProps
) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          ctx &&
          bookCtx && (
            <OrderOnSiteSummaryPage
              basket={bookCtx.basket}
              selectedTable={bookCtx.selectedTable}
              setSelectedTable={bookCtx.setSelectedTable}
              setSelectedRestaurant={bookCtx.setSelectedRestaurant}
              selectedRestaurant={bookCtx.selectedRestaurant}
              setPlaceChoice={bookCtx.setPlaceChoice}
              freeBasket={bookCtx.freeBasket}
              doOrder={bookCtx.doOrder}
              verifyIfBookingIsRunning={bookCtx.verifyIfBookingIsRunning}
              user={ctx.user}
              userIsEating={bookCtx.userIsEating}
              hasBasket={bookCtx.hasBasket}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
