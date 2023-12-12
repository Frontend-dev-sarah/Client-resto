import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
// import { Camera, BarCodeScanningResult } from 'expo-camera';
import { RNCamera, Barcode } from 'react-native-camera';

import Constants from 'expo-constants';
import messaging from '@react-native-firebase/messaging';

import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import RoutesNames from 'src/navigation/RoutesNames';
import {
  NavigationScreenProp,
  NavigationParams,
  NavigationState
} from 'react-navigation';

import { BookingConsumer } from 'src/store/BookingContext';
import ModalOrderHeader from 'src/components/BottomTab/ModalOrderHeader';
import { screenHeight, isExpoApp, screenWidth } from 'src/utils/constants';
import { BarCodeScanner } from 'expo-barcode-scanner';
import bookingApi from 'src/services/bookingApi/bookingApi';
import PersonNumberSelector from 'src/components/Slider/PersonNumberSelector';
import AppImages from 'src/resources/common/AppImages';
import TouchableIcon from 'src/components/Buttons/TouchableIcon';
import { DistrictConsumer } from 'src/store/DistrictContext';
import { Booking } from 'src/models/payment';
import moment from 'moment';
import CustomButton from 'src/components/Buttons/CustomButton';

const closeContainerHeight = 58;

type ScanPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  setSelectedHour: Function;
  modalHeight: number;
  personNumber: number;
  setSelectedDistrict: Function;
  setSelectedRestaurant: Function;
  setSelectedTable: Function;
  setUserIsEating: Function;
};

function ScanPage({
  navigation,
  setSelectedHour,
  modalHeight,
  personNumber,
  setSelectedDistrict,
  setSelectedRestaurant,
  setSelectedTable,
  setUserIsEating
}: ScanPageProps) {
  const [selectorVisible, setSelectorVisible] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableName, setTableName] = useState<string>('');
  const [detectedOrder, setDetectedOrder] = useState<Booking | undefined>();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  //waitingAccess is used to know when we are waiting other users to accept or decline us on same table
  const [waitingAccess, setWaitingAccess] = useState(false);
  const [takeAwaySoon, setTakeAwaySoon] = useState(false);
  const [takeAwayAlreadyCalled, setTakeAwayAlreadyCalled] = useState(false);

  useEffect(() => {
    setSelectedHour();
    notificationListener();
  }, []);

  async function notificationListener() {
    messaging().onMessage(remoteMessage => {
      if (remoteMessage && remoteMessage.data) {
        if (remoteMessage.data.path === 'accept-join') {
          setWaitingAccess(false);
          if (
            detectedOrder &&
            detectedOrder.order &&
            detectedOrder.order.products &&
            detectedOrder.order.products.length > 0
          ) {
            navigation.navigate(RoutesNames.OrderOnSiteSummaryPage);
          } else {
            navigation.navigate(RoutesNames.CardPage, { simpleCard: false });
          }
        } else if (remoteMessage.data.path === 'decline-join') {
          setWaitingAccess(false);
          Alert.alert(
            I18n.t('app.sorry'),
            'Vous ne pouvez pas rejoindre cette table',
            [
              {
                text: I18n.t('app.ok'),
                style: 'cancel',
                onPress: () => setWaitingAccess(false)
              }
            ]
          );
        }
      }
    });
  }

  function renderHeader() {
    return <ModalOrderHeader />;
  }

  async function detectQRCode(qrcode: Barcode) {
    if (!isScanning) {
      setIsScanning(true);
      setCode(qrcode.data);
      if (qrcode.data.includes('click-and-collect')) {
        const res = await bookingApi.scanForClickAndCollect(qrcode.data);
        if (res && !res.error) {
          // if (res.includes('Already called the waiter')) {
          //   setTakeAwayAlreadyCalled(true);
          // }
          setTakeAwaySoon(true);
        }
      } else {
        const res = await bookingApi.openTable({
          tableId: qrcode.data
        });

        if (res && !res.error && res.booked_at) {
          setDetectedOrder(res);
        } else if (res && !res.error) {
          // detect if the qr code is well handled by api
          setTableName(
            res.table &&
              res.table.room.name + ' - ' + res.table &&
              res.table.name
          );
          setSelectorVisible(true);
        } else if (
          res &&
          res.error &&
          (res.error.message.error === 'error.table.full' ||
            res.error.message.error === 'errors.table.full')
        ) {
          Alert.alert(I18n.t('app.sorry'), I18n.t('booking.tableFull'), [
            {
              text: I18n.t('app.ok'),
              style: 'cancel'
            }
          ]);
        } else {
          Alert.alert(I18n.t('app.error'), '', [
            {
              text: I18n.t('app.ok'),
              style: 'cancel'
            }
          ]);
        }
      }
      setIsScanning(false);
    }
  }

  async function submit() {
    setIsLoading(true);
    const res = await bookingApi.openTable({
      tableId: code,
      count: personNumber
    });
    if (res && !res.error) {
      await setSelectedDistrict({
        data: res.data || res[0].data,
        catalogs: res.catalogs || res[0].catalogs
      });
      await setSelectedRestaurant(res.restaurant || res[0].restaurant);
      await setSelectedTable(res.table || res[0].table);
      if (res.waiting_response) {
        setWaitingAccess(true); // we set true because we wait the response from other users
      } else if (res.table || res[0].table) {
        setUserIsEating(true);
        navigation.navigate(RoutesNames.CardPage, { simpleCard: false });
      }
    } else if (
      res &&
      res.error &&
      (res.error.message.error === 'error.table.full' ||
        res.error.message.error === 'errors.table.full')
    ) {
      Alert.alert(I18n.t('app.sorry'), I18n.t('booking.tableFull'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setSelectorVisible(false);
    setIsLoading(false);
  }

  async function launchBooking() {
    setIsLoading(true);
    if (detectedOrder) {
      const res = await bookingApi.openTable({
        tableId: code,
        // eslint-disable-next-line @typescript-eslint/camelcase
        reservation_id: detectedOrder.id
      });
      if (res && !res.error) {
        await setSelectedDistrict({
          data: res.data || res[0].data,
          catalogs: res.catalogs || res[0].catalogs
        });
        await setSelectedRestaurant(res.restaurant || res[0].restaurant);
        await setSelectedTable(res.table || res[0].table);
        if (res.waiting_response) {
          setWaitingAccess(true); // we set true beacause we wait the response from other users
        } else if (res.table) {
          if (
            detectedOrder &&
            detectedOrder.order &&
            detectedOrder.order.products &&
            detectedOrder.order.products.length > 0
          ) {
            navigation.navigate(RoutesNames.OrderOnSiteSummaryPage);
          } else {
            navigation.navigate(RoutesNames.CardPage, { simpleCard: false });
          }
        }
      } else if (
        res &&
        res.error &&
        (res.error.message.error === 'error.table.full' ||
          res.error.message.error === 'errors.table.full')
      ) {
        Alert.alert(I18n.t('app.sorry'), I18n.t('booking.tableFull'), [
          { text: I18n.t('app.ok'), style: 'cancel' }
        ]);
      }
    }
    setSelectorVisible(false);
    setIsLoading(false);
  }

  return (
    <>
      <>
        <RNCamera
          captureAudio={false}
          onStatusChange={status => {
            if (status.cameraStatus && status.cameraStatus !== 'READY') {
              navigation.goBack();
              Alert.alert(
                I18n.t('app.permission'),
                I18n.t('app.cameraPermission'),
                [
                  {
                    text: I18n.t('app.ok'),
                    style: 'cancel'
                  }
                ]
              );
            }
          }}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={code => detectQRCode(code)}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: isExpoApp
              ? screenHeight - modalHeight + closeContainerHeight
              : screenHeight -
                modalHeight +
                closeContainerHeight -
                Constants.statusBarHeight,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              backgroundColor: selectorVisible
                ? colors.black80
                : colors.transparent,
              height: '100%',
              width: '100%'
            }}
          />
        </RNCamera>
        {waitingAccess && (
          <View
            style={[
              styles.selector,
              { top: (screenHeight - modalHeight - 200) * 0.3 }
            ]}
          >
            <View style={styles.selectorContainer}>
              <Text style={styles.title}>{tableName}</Text>
              <Text style={styles.title}>
                {I18n.t('booking.waitingTableAccess')}
              </Text>
              <ActivityIndicator
                style={styles.button}
                color={colors.paleOrange}
              />
            </View>
          </View>
        )}
        {isScanning && (
          <View
            style={[
              styles.selector,
              { top: (screenHeight - modalHeight - 200) * 0.3 }
            ]}
          >
            <View style={styles.loading}>
              <ActivityIndicator
                style={styles.loader}
                color={colors.paleOrange}
              />
            </View>
          </View>
        )}
        {takeAwaySoon && (
          <View
            style={[
              styles.selector,
              { top: (screenHeight - modalHeight - 200) * 0.3 }
            ]}
          >
            <TouchableIcon
              icon={AppImages.images.checkIcon}
              height={20}
              width={20}
              style={styles.button}
              onPress={() => {
                setTakeAwaySoon(false);
                navigation.goBack();
              }}
            />
            <View style={styles.selectorContainer}>
              <Text style={[styles.title, styles.soon]}>
                {takeAwayAlreadyCalled
                  ? I18n.t('booking.takeAwayAlreadyCalled')
                  : I18n.t('booking.takeAwaySoon')}
              </Text>
            </View>
          </View>
        )}
        {selectorVisible && !waitingAccess && (
          <View
            style={[
              styles.selector,
              { top: (screenHeight - modalHeight - 200) * 0.3 }
            ]}
          >
            {!isLoading ? (
              <TouchableIcon
                icon={AppImages.images.checkIcon}
                height={20}
                width={20}
                style={styles.button}
                onPress={submit}
              />
            ) : (
              <ActivityIndicator
                style={styles.button}
                color={colors.paleOrange}
              />
            )}
            <View style={styles.selectorContainer}>
              <Text style={styles.title}>{tableName}</Text>
              <Text style={styles.title}>{I18n.t('booking.personNumber')}</Text>
              <PersonNumberSelector />
            </View>
          </View>
        )}
        {detectedOrder && (
          <View
            style={[
              styles.selector,
              { top: (screenHeight - modalHeight - 200) * 0.3 }
            ]}
          >
            <View style={styles.selectorContainer}>
              <Text style={styles.title}>
                {I18n.t('orderOnSite.bookingDetected')}
              </Text>
              <View style={styles.row}>
                <View style={styles.item}>
                  <Image source={AppImages.images.clock} style={styles.icon} />
                  <Text style={styles.mood}>
                    {moment(detectedOrder.booked_at).format('HH:mm')}
                  </Text>
                </View>

                <View style={styles.separator} />
                <View style={styles.item}>
                  <Image
                    source={AppImages.images.calendarIcon}
                    style={styles.icon}
                  />
                  <Text style={styles.mood}>
                    {moment(detectedOrder.booked_at).format('DD MMM')}
                  </Text>
                </View>

                <View style={styles.separator} />
                <View style={styles.item}>
                  <Image source={AppImages.images.order} style={styles.icon} />
                  <Text
                    style={styles.mood}
                  >{`${detectedOrder.count} per`}</Text>
                </View>
              </View>
              <CustomButton
                text={I18n.t('orderOnSite.openTable')}
                onPress={launchBooking}
                primary
                outlined
                isLoading={isLoading}
              />
            </View>
          </View>
        )}
      </>
      <View style={styles.bottomView}>{renderHeader()}</View>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    padding: 50,
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: 32,
    justifyContent: 'center'
  },
  bottomView: {
    backgroundColor: colors.transparent,
    marginTop: -closeContainerHeight
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    bottom: -28,
    height: 56,
    position: 'absolute',
    width: 56,
    zIndex: 10
  },
  loader: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    height: 56,
    width: 56,
    zIndex: 10
  },
  icon: {
    height: 12,
    tintColor: colors.white80,
    width: 12
  },
  item: {
    alignItems: 'center',
    width: (screenWidth - 154) / 3
  },
  mood: {
    color: colors.white60,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 12,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 36,
    marginTop: 24
  },
  selector: {
    alignSelf: 'center',
    position: 'absolute'
  },
  selectorContainer: {
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: 32,
    justifyContent: 'center',
    marginHorizontal: 30,
    padding: 20,
    paddingBottom: 40
  },
  separator: {
    backgroundColor: colors.white40,
    height: 24,
    width: 1
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0,
    marginBottom: 15,
    textAlign: 'center'
  },
  soon: { marginTop: 20 }
});

export default (props: JSX.IntrinsicAttributes & ScanPageProps) => (
  <DistrictConsumer>
    {distCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          distCtx && (
            <ScanPage
              setSelectedHour={ctx.setSelectedHour}
              modalHeight={ctx.modalHeight}
              personNumber={ctx.personNumber}
              setSelectedRestaurant={ctx.setSelectedRestaurant}
              setSelectedDistrict={distCtx.setSelectedDistrict}
              setSelectedTable={ctx.setSelectedTable}
              setUserIsEating={ctx.setUserIsEating}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </DistrictConsumer>
);
