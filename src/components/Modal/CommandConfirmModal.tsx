import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import I18n from 'i18n-js';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';
import { Restaurant, PlaceChoice } from 'src/models/restaurants';
import moment from 'moment';
import { AuthConsumer } from 'src/store/AuthContext';
import { UserData } from 'src/models/user';

type CommandConfirmModalProps = {
  visible: boolean;
  cancelable?: boolean;
  hideModal: () => void;
  selectedRestaurant?: Restaurant;
  placeChoice?: PlaceChoice;
  ambiance?: string;
  selectedDate?: Date;
  selectedHour?: string;
  personNumber?: number;
  doOrder?: Function;
  freeBasket?: Function;
  setPlaceChoice?: Function;
  user?: UserData;
};

function CommandConfirmModal({
  visible,
  cancelable,
  hideModal,
  ambiance,
  personNumber,
  placeChoice,
  selectedDate,
  selectedHour,
  selectedRestaurant,
  doOrder,
  freeBasket,
  setPlaceChoice,
  user
}: CommandConfirmModalProps) {
  const [canDoOrder, setCanDoOrder] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(true);
  useEffect(() => {
    if (visible && user && canDoOrder) {
      order();
    }
  }, [visible, user]);

  async function order() {
    await setCanDoOrder(false);
    const res = doOrder && (await doOrder());
    if (res && !res.error) {
      await setSuccess(true);
    } else if (res.error) {
      await setSuccess(false);
    }
    setisLoading(false);
    await setCanDoOrder(true);
  }

  const children = (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <ActivityIndicator color={colors.white} />
          <Text style={styles.subtitle}>
            {I18n.t('orderOnSite.orderRunning')}
          </Text>
        </>
      ) : !success ? (
        <>
          <Text style={styles.title}>{I18n.t('basket.orderFailed')}</Text>
          <Text style={styles.subtitle}>{I18n.t('app.retry')}</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>{I18n.t('basket.commandDone')}</Text>
          <Text style={styles.subtitle}>
            {selectedRestaurant && selectedRestaurant.name}
          </Text>
          {placeChoice !== 'takeAway' && ambiance && (
            <Text style={styles.mood}>{`${I18n.t(
              'booking.ambianceName'
            )} : ${ambiance}`}</Text>
          )}
          <View style={styles.row}>
            <View style={styles.item}>
              <Image source={AppImages.images.clock} style={styles.icon} />
              <Text style={styles.mood}>{selectedHour}</Text>
            </View>

            <View style={styles.separator} />
            <View style={styles.item}>
              <Image
                source={AppImages.images.calendarIcon}
                style={styles.icon}
              />
              <Text style={styles.mood}>
                {selectedDate && moment(selectedDate).format('DD MMM')}
              </Text>
            </View>
            {placeChoice !== 'takeAway' && (
              <>
                <View style={styles.separator} />
                <View style={styles.item}>
                  <Image source={AppImages.images.order} style={styles.icon} />
                  <Text style={styles.mood}>{`${personNumber} per`}</Text>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );

  return (
    <Modal
      hideModal={() => {
        if (!isLoading) {
          hideModal();
          setisLoading(true);
          freeBasket && success && freeBasket();
          setPlaceChoice && setPlaceChoice();
        }
      }}
      visible={visible}
      children={children}
      onPress={() => {
        if (!isLoading) {
          hideModal();
          setisLoading(true);
          freeBasket && success && freeBasket();
          setPlaceChoice && setPlaceChoice();
        }
      }}
      cancelable={cancelable}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingBottom: 76,
    paddingHorizontal: 5,
    paddingTop: 56
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
    marginTop: 24
  },
  separator: {
    backgroundColor: colors.white40,
    height: 24,
    width: 1
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 48,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    marginHorizontal: 25,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & CommandConfirmModalProps) => (
  <AuthConsumer>
    {authCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <CommandConfirmModal
              selectedRestaurant={ctx.selectedRestaurant}
              placeChoice={ctx.placeChoice}
              ambiance={ctx.ambiance}
              selectedDate={ctx.selectedDate}
              selectedHour={ctx.selectedHour}
              personNumber={ctx.personNumber}
              doOrder={ctx.doOrder}
              freeBasket={ctx.freeBasket}
              setPlaceChoice={ctx.setPlaceChoice}
              user={authCtx.user}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
