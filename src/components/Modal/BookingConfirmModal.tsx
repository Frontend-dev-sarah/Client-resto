import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import I18n from 'i18n-js';
import Share from 'react-native-share';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';
import { Restaurant } from 'src/models/restaurants';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';
import CustomButton from '../Buttons/CustomButton';

type BookingConfirmModalProps = {
  visible: boolean;
  cancelable?: boolean;
  hideModal: () => void;
  selectedRestaurant?: Restaurant;
  selectedDate?: Date;
  selectedHour?: string;
  personNumber?: number;
  setPlaceChoice?: Function;
};

function BookingConfirmModal({
  visible,
  cancelable,
  hideModal,
  personNumber,
  selectedDate,
  selectedHour,
  selectedRestaurant,
  setPlaceChoice
}: BookingConfirmModalProps) {
  async function share() {
    await Share.open({
      message: I18n.t('booking.shareText', {
        nb: personNumber,
        hour: selectedHour,
        date: selectedDate && moment(selectedDate).format('DD MMM'),
        restaurant: selectedRestaurant ? selectedRestaurant.name : ''
      }),
      subject: I18n.t('booking.booking'),
      type: 'text',
      showAppsToview: true
    })
      .then(() => {
        // send analytics event
      })
      .catch(() => {
        return;
      });
  }

  const children = (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('booking.done')}</Text>
      <Text style={styles.subtitle}>
        {selectedRestaurant && selectedRestaurant.name}
      </Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <Image source={AppImages.images.clock} style={styles.icon} />
          <Text style={styles.mood}>{selectedHour}</Text>
        </View>

        <View style={styles.separator} />
        <View style={styles.item}>
          <Image source={AppImages.images.calendarIcon} style={styles.icon} />
          <Text style={styles.mood}>
            {selectedDate && moment(selectedDate).format('DD MMM')}
          </Text>
        </View>

        <View style={styles.separator} />
        <View style={styles.item}>
          <Image source={AppImages.images.order} style={styles.icon} />
          <Text style={styles.mood}>{`${personNumber} per`}</Text>
        </View>
      </View>
      <CustomButton
        customStyle={styles.share}
        outlined
        text={I18n.t('app.share')}
        onPress={share}
      />
    </View>
  );

  return (
    <Modal
      hideModal={() => {
        hideModal();
        setPlaceChoice && setPlaceChoice();
      }}
      visible={visible}
      children={children}
      onPress={() => {
        hideModal();
        setPlaceChoice && setPlaceChoice();
      }}
      cancelable={cancelable}
    />
  );
}

const styles = StyleSheet.create({
  share: { marginBottom: 76, marginTop: 24 },
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 27,
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
    marginTop: 18
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

export default (props: JSX.IntrinsicAttributes & BookingConfirmModalProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <BookingConfirmModal
          selectedRestaurant={ctx.selectedRestaurant}
          selectedDate={ctx.selectedDate}
          selectedHour={ctx.selectedHour}
          personNumber={ctx.personNumber}
          setPlaceChoie={ctx.setPlaceChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
