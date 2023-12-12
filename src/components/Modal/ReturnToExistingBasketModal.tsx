import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import I18n from 'i18n-js';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';
import { PlaceChoice, Restaurant } from 'src/models/restaurants';
import moment from 'moment';
import CustomButton from '../Buttons/CustomButton';
import TouchableIcon from '../Buttons/TouchableIcon';
import { Basket } from 'src/models/products';
import { SharedPayments } from 'src/models/payment';

type ReturnToExistingBasketModalProps = {
  visible: boolean;
  hideModal: () => void;
  onPress: () => void;
  freeBasket?: Function;
  restaurantName?: string;
  basketPlaceChoice?: PlaceChoice;
  date?: Date;
  hour?: string;
  sharedPayments?: SharedPayments;
};

function ReturnToExistingBasketModal({
  visible,
  hideModal,
  onPress,
  freeBasket,
  restaurantName,
  basketPlaceChoice,
  date,
  hour,
  sharedPayments
}: ReturnToExistingBasketModalProps) {
  const children = (
    <View style={styles.container}>
      <TouchableIcon
        icon={AppImages.images.closeIcon}
        style={styles.close}
        height={20}
        width={20}
        onPress={hideModal}
      />
      <Text style={styles.title}>{I18n.t('basket.existingBasket')}</Text>
      <Text style={styles.subtitle}>
        {`${I18n.t('basket.returnToBasket', {
          placeChoice:
            basketPlaceChoice && basketPlaceChoice === 'takeAway'
              ? I18n.t('orderHistory.takeAway')
              : basketPlaceChoice
              ? I18n.t('orderHistory.onSite')
              : '',
          restaurant: restaurantName
        })}${
          basketPlaceChoice !== 'alreadyOnSite'
            ? I18n.t('basket.returnToBasketDate', {
                date: moment(date).format('L'),
                hour: hour
              })
            : ''
        }`}
      </Text>
      <CustomButton
        text={I18n.t('app.continue')}
        onPress={() => {
          hideModal();
          onPress();
        }}
        primary
        customStyle={styles.btn}
      />
      <CustomButton
        text={I18n.t('basket.cancelBasket')}
        onPress={() => {
          // if (sharedPayments) {
          //   Alert.alert(
          //     I18n.t('basket.cancelBasket'),
          //     I18n.t('basket.cannotCancel'),
          //     [{ text: I18n.t('app.ok'), style: 'cancel' }]
          //   );
          // } else {
          freeBasket && freeBasket(true);
          hideModal();
          // }
        }}
        outlined
      />
    </View>
  );

  return (
    <Modal
      hideModal={hideModal}
      visible={visible}
      children={children}
      onPress={hideModal}
      cancelable
      noButton
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 10
  },
  close: { position: 'absolute', right: 0, top: 0 },
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 27,
    paddingVertical: 56
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginVertical: 30,

    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginHorizontal: 25,
    textAlign: 'center'
  }
});

export default (
  props: JSX.IntrinsicAttributes & ReturnToExistingBasketModalProps
) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <ReturnToExistingBasketModal
          freeBasket={ctx.freeBasket}
          restaurantName={ctx.selectedRestaurant && ctx.selectedRestaurant.name}
          basketPlaceChoice={ctx.basketPlaceChoice}
          date={ctx.selectedDate}
          hour={ctx.selectedHour}
          sharedPayments={ctx.sharedPayments}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
