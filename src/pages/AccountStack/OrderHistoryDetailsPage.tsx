import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
  Image,
  ImageBackground,
  FlatList,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import * as Permissions from 'expo-permissions';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import { Order } from 'src/models/payment';
import { RouteProp } from '@react-navigation/native';
import { AccountStackParamList } from 'src/navigation/AccountStack';
import Appstyle from 'src/resources/common/Appstyle';
import AppImages from 'src/resources/common/AppImages';
import moment from 'moment';
import BasketItemComponent from 'src/components/Basket/BasketItemComponent';
import CardComponent from 'src/components/Payment/CardComponent';
import CustomButton from 'src/components/Buttons/CustomButton';
import bookingApi from 'src/services/bookingApi/bookingApi';

import RNFetchBlob from 'rn-fetch-blob';
import { getBackendUrl } from 'src/utils/constants';
import StorageKeys from 'src/utils/StorageKeys';

import Share from 'react-native-share';

type OrderHistoryDetailsPageRouteProps = RouteProp<
  AccountStackParamList,
  'OrderHistoryDetailsPage'
>;

type OrderHistoryDetailsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: OrderHistoryDetailsPageRouteProps;
};

export default function OrderHistoryDetailsPage({
  navigation,
  route
}: OrderHistoryDetailsPageProps) {
  const [order, setOrder] = useState<Order>();
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    if (route.params && route.params.order && !order) {
      setOrder(route.params.order);
    }
  }, [route.params]);

  function renderFooter() {
    return (
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.total}>{I18n.t('orderHistory.total')}</Text>
          <Text style={styles.total}>{`${order &&
            parseFloat(order.total.toString()).toFixed(2)} €`}</Text>
        </View>
        {order &&
          order.order_payment &&
          order.order_payment[0] &&
          order.order_payment[0].payment_method &&
          order.order_payment[0].payment_method.card && (
            <>
              <Text style={styles.placeChoice}>
                {I18n.t('orderHistory.payedWith')}
              </Text>
              <CardComponent
                type={
                  order.order_payment[0].payment_method.metadata &&
                  order.order_payment[0].payment_method.metadata.card_type &&
                  order.order_payment[0].payment_method.metadata.card_type ===
                    'swile'
                    ? 'swile'
                    : order.order_payment[0].payment_method.type === 'card'
                    ? order && order.order_payment[0].payment_method.card.brand
                    : 'edenred'
                }
                date={
                  order.order_payment[0].payment_method.type === 'card'
                    ? order.order_payment[0].payment_method.card.exp_month +
                      ' / ' +
                      order.order_payment[0].payment_method.card.exp_year
                    : `${order.order_payment[0].payment_method.expiration.slice(
                        0,
                        2
                      )} / ${order.order_payment[0].payment_method.expiration.slice(
                        -2
                      )}`
                }
                name={
                  order.order_payment[0].payment_method.type === 'card'
                    ? order.order_payment[0].payment_method.billing_details.name
                    : order.order_payment[0].payment_method.name
                }
                number={
                  order.order_payment[0].payment_method.type === 'card'
                    ? `••••  ••••  ••••  ${order.order_payment[0].payment_method.card.last4}`
                    : order.order_payment[0].payment_method.pan
                }
              />
            </>
          )}
        <CustomButton
          customStyle={styles.button}
          outlined
          isLoading={downloadLoading}
          text={I18n.t('orderHistory.saveBill')}
          onPress={() => {
            getBill();
          }}
        />
      </View>
    );
  }

  async function getBill() {
    setDownloadLoading(true);

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (
      granted === PermissionsAndroid.RESULTS.GRANTED ||
      Platform.OS === 'ios'
    ) {
      const token = await AsyncStorage.getItem(StorageKeys.userToken);

      await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf'
      })
        // possible de passer ça dans le body :
        //       {
        // details: false,
        //     couvert: 2
        // }
        .fetch('GET', `${getBackendUrl()}/orders/${order.id}/invoice`, {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token
        })
        .then(async res => {
          await Share.open({
            url: 'data:application/pdf;base64,' + (await res.base64()),
            type: 'pdf',
            showAppsToview: true
          }).catch(() => {
            return;
          });
        })
        .catch(() => {
          Alert.alert(I18n.t('error.error'), I18n.t('app.error'), [
            { text: I18n.t('app.ok'), style: 'cancel' }
          ]);
        });
    } else if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(I18n.t('error.error'), I18n.t('app.storageError'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setDownloadLoading(false);
  }

  return (
    <>
      <Header backIcon navigation={navigation} />
      {!order ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.paddingView}>
            <Text style={styles.title}>{I18n.t('orderHistory.order')}</Text>
            <ImageBackground
              source={
                order.orderable.restaurant
                  ? { uri: order.orderable.restaurant.images[0].image }
                  : AppImages.images.bgOnboarding
              }
              style={[styles.image, styles.shadow]}
              imageStyle={styles.image}
            >
              <View style={styles.basketIconContainer}>
                <Image
                  style={styles.basketIcon}
                  source={
                    order.type === 'take_away'
                      ? AppImages.images.basketIcon2
                      : AppImages.images.calendarIcon
                  }
                />
              </View>
            </ImageBackground>
            <Text style={styles.placeChoice}>
              {order.type === 'take_away'
                ? I18n.t('orderHistory.takeAway')
                : I18n.t('orderHistory.onSite')}
            </Text>
            <Text style={styles.name}>
              {order.orderable.restaurant && order.orderable.restaurant.name}
            </Text>
            {order.type === 'take_away' && (
              <Text style={styles.orderNb}>
                {I18n.t('orderHistory.orderNb') + order.id}
              </Text>
            )}
            <View style={styles.itemContainer}>
              <View style={styles.card}>
                <Image
                  style={[styles.icon, styles.orangeIcon]}
                  source={AppImages.images.basketIcon}
                />
                <Text style={[styles.cardText, styles.orangeText]}>
                  {`${parseFloat(order.total.toString()).toFixed(2)} €`}
                </Text>
              </View>
              <View style={styles.card}>
                <Image
                  style={styles.icon}
                  source={AppImages.images.calendarIcon}
                />
                <Text style={styles.cardText}>
                  {order.type === 'take_away'
                    ? moment(order.orderable.pickup_at).format('DD MMM')
                    : order.type === 'on_site'
                    ? moment(order.created_at).format('DD MMM')
                    : moment(order.orderable.booked_at).format('DD MMM')}
                </Text>
              </View>
              <View style={styles.card}>
                <Image style={styles.icon} source={AppImages.images.clock} />
                <Text style={styles.cardText}>
                  {order.type === 'take_away'
                    ? moment(order.orderable.pickup_at).format('HH:mm')
                    : order.type === 'on_site'
                    ? moment(order.created_at).format('HH:mm')
                    : moment(order.orderable.booked_at).format('HH:mm')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.basketDetails}>
            <Text style={styles.placeChoice}>
              {I18n.t('orderHistory.details')}
            </Text>
            {order && order.table && order.table.name && (
              <Text style={styles.tableName}>{order.table.name}</Text>
            )}
            <FlatList
              style={styles.flatlist}
              data={order.products}
              renderItem={({ item }) => {
                return (
                  <BasketItemComponent
                    disableDelete
                    noStyle
                    item={{
                      product: item,
                      quantity: item.quantity,
                      option: item.option
                    }}
                    onPressProduct={() => {
                      return;
                    }}
                  />
                );
              }}
              ListFooterComponent={renderFooter}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  basketDetails: {
    backgroundColor: colors.black,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 40,
    paddingHorizontal: 25,
    paddingTop: 48
  },
  basketIcon: {
    height: 16,
    tintColor: colors.white80,
    width: 16
  },
  basketIconContainer: {
    backgroundColor: colors.black60,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 'auto',
    padding: 8
  },
  button: { marginVertical: 40 },
  card: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    marginRight: 14,
    padding: 10
  },
  cardText: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center'
  },
  flatlist: {
    marginTop: 10
  },
  footer: {
    borderTopColor: colors.white40,
    borderTopWidth: 1
  },
  icon: {
    height: 12,
    marginBottom: 6,
    tintColor: colors.white80,
    width: 12
  },
  image: {
    borderRadius: 8,
    height: 132,
    width: '100%'
  },
  itemContainer: { flexDirection: 'row', marginTop: 34 },
  name: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18
  },
  orangeIcon: {
    tintColor: colors.paleOrange
  },
  orangeText: {
    color: colors.paleOrange
  },
  paddingView: {
    paddingHorizontal: 25
  },
  placeChoice: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginBottom: 8,
    marginTop: 24
  },
  tableName: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginBottom: 8,
    marginTop: 5
  },
  orderNb: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginTop: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
    marginTop: 20
  },
  shadow: Appstyle.shadowExtraBold(),
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 32,
    marginTop: 20
  },
  total: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18
  }
});
