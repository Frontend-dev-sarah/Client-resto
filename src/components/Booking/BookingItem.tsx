import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import I18n from 'resources/localization/I18n';
import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import { Booking } from 'src/models/payment';
import Animated, { Easing } from 'react-native-reanimated';
import moment from 'moment';
import bookingApi from 'src/services/bookingApi/bookingApi';
import TouchableText from '../Buttons/TouchableText';

type BookingItemProps = {
  data: Booking;
  goToDetails: Function;
};

export default function BookingItem({ data, goToDetails }: BookingItemProps) {
  const [opened, setOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(data.status);
  const [anim] = useState(new Animated.Value(0));

  function toggleMenu() {
    const minHeight = 0;
    const maxHeight =
      status === 'DELETED' && !data.order
        ? 64
        : status === 'DELETED' || !data.order
        ? 128
        : 192;

    const initialValue = opened ? maxHeight + minHeight : minHeight;
    const finalValue = opened ? minHeight : maxHeight + minHeight;

    setOpened(!opened);
    anim.setValue(initialValue);
    Animated.timing(anim, {
      toValue: finalValue,
      duration: 200,
      easing: Easing.linear
    }).start();
  }
  async function cancelBooking() {
    setIsLoading(true);
    const res = await bookingApi.cancelBooking(data.id);
    if (res && !res.error) {
      setStatus('DELETED');
    } else {
      Alert.alert(
        I18n.t('error.error'),
        res.error.message.error === 'error.date.toolate'
          ? I18n.t('booking.tooLate')
          : I18n.t('app.tryLater'),
        [{ text: I18n.t('app.ok'), style: 'cancel' }]
      );
    }
    setIsLoading(false);
  }

  function createGroupEvent() {
    const date = new Date(data.booked_at);
    const hour = date.getHours();
    const min = date.getMinutes();
    const eventConfig = {
      title: `${I18n.t('booking.booking')} ${data.restaurant.name}`,
      startDate: date.toISOString(),
      endDate: date.setHours(hour + 1, min) && date.toISOString(),
      allDay: false,
      location: data.restaurant.readable
    };

    return AddCalendarEvent.presentEventCreatingDialog(eventConfig);
  }

  return (
    <View style={styles.container}>
      <TouchableRipple onPress={toggleMenu}>
        <ImageBackground
          imageStyle={styles.bgContainer}
          source={{ uri: data.restaurant.images[0].image }}
          style={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <Text style={styles.name}>{data.restaurant.name}</Text>
            <Text
              style={[
                styles.state,
                new Date(data.booked_at).getTime() > new Date().getTime() &&
                  status !== 'DELETED' &&
                  styles.activeState
              ]}
            >
              {status === 'DELETED'
                ? I18n.t('booking.canceled')
                : status === 'WAITING'
                ? I18n.t('booking.waiting')
                : new Date(data.booked_at).getTime() > new Date().getTime()
                ? I18n.t('booking.future')
                : I18n.t('booking.closed')}
            </Text>
            <View style={styles.itemContainer}>
              <View style={styles.card}>
                <Image style={styles.icon} source={AppImages.images.clock} />
                <Text style={styles.cardText}>
                  {moment(data.booked_at).format('HH:mm')}
                </Text>
              </View>
              <View style={styles.card}>
                <Image
                  style={styles.icon}
                  source={AppImages.images.calendarIcon}
                />
                <Text style={styles.cardText}>
                  {moment(data.booked_at).format('DD MMM')}
                </Text>
              </View>
              <View style={styles.card}>
                <Image style={styles.icon} source={AppImages.images.order} />
                <Text style={styles.cardText}>{`${data.count} per`}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableRipple>
      <Animated.View style={[{ height: anim }, styles.menu]}>
        {opened && (
          <View style={styles.optionContainer}>
            <TouchableRipple style={styles.option} onPress={createGroupEvent}>
              <TouchableText
                icon={AppImages.images.calendarIcon}
                text={I18n.t('booking.addToCalendar')}
                iconRight
                iconSize={12}
                textStyle={styles.cardText}
                iconStyle={{ tintColor: colors.white }}
              />
            </TouchableRipple>
            {status !== 'DELETED' && (
              <TouchableRipple style={styles.option} onPress={cancelBooking}>
                {!isLoading ? (
                  <TouchableText
                    icon={AppImages.images.trash}
                    text={I18n.t('booking.cancel')}
                    iconRight
                    iconSize={12}
                    textStyle={styles.cardText}
                    iconStyle={{ tintColor: colors.white }}
                  />
                ) : (
                  <ActivityIndicator color={colors.white} />
                )}
              </TouchableRipple>
            )}
            {data.order && (
              <TouchableRipple
                style={styles.option}
                onPress={() => {
                  goToDetails(data.order);
                }}
              >
                <TouchableText
                  text={I18n.t('booking.details')}
                  iconSize={12}
                  textStyle={styles.cardText}
                  iconStyle={{ tintColor: colors.white }}
                />
              </TouchableRipple>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeState: {
    color: colors.paleOrange
  },
  bgContainer: { backgroundColor: colors.brownishGrey, borderRadius: 8 },
  card: {
    alignItems: 'center',
    backgroundColor: colors.black60,
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
  container: {
    borderRadius: 8,
    marginHorizontal: 25,
    marginVertical: 24
  },
  content: {
    backgroundColor: colors.black60,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 25
  },
  icon: {
    height: 12,
    marginBottom: 6,
    tintColor: colors.white80,
    width: 12
  },
  imageStyle: {
    borderRadius: 8,
    width: '100%'
  },
  itemContainer: { flexDirection: 'row' },
  menu: {
    backgroundColor: colors.white10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -8,
    zIndex: -1
  },
  name: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18
  },
  option: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 16,
    width: '100%'
  },
  optionContainer: {},
  state: {
    alignItems: 'center',
    backgroundColor: colors.black60,
    borderRadius: 4,
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 10,
    justifyContent: 'center',
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: 44,
    marginRight: 'auto',
    marginTop: 16,
    padding: 6
  }
});
