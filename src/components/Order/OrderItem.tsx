import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';

import I18n from 'resources/localization/I18n';
import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import { screenWidth } from 'src/utils/constants';
import { Order } from 'src/models/payment';
import moment from 'moment';

type OrderItemProps = {
  onPress: Function;
  data: Order;
};

export default function OrderItem({ onPress, data }: OrderItemProps) {
  return (
    <TouchableRipple onPress={() => onPress()} style={styles.container}>
      <>
        <ImageBackground
          source={
            data.orderable.restaurant && data.orderable.restaurant.images[0]
              ? {
                  uri: data.orderable.restaurant.images[0].image
                }
              : AppImages.images.bgOnboarding
          }
          style={styles.image}
        >
          <View style={styles.iconContainer}>
            <Image
              source={
                data.type === 'take_away'
                  ? AppImages.images.basketIcon2
                  : AppImages.images.calendarIcon
              }
              style={styles.iconBasket}
            />
          </View>
        </ImageBackground>
        <View style={styles.content}>
          <Text style={styles.place}>
            {data.type === 'take_away'
              ? I18n.t('orderHistory.takeAway')
              : I18n.t('orderHistory.onSite')}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {data.orderable.restaurant && data.orderable.restaurant.name}
          </Text>
          <View style={styles.itemContainer}>
            <View style={styles.card}>
              <Image
                style={[styles.icon, styles.orangeIcon]}
                source={AppImages.images.basketIcon}
              />
              <Text style={[styles.cardText, styles.orangeText]}>
                {data.total &&
                  `${parseFloat(data.total.toString()).toFixed(2)} €`}
              </Text>
            </View>
            <View style={styles.card}>
              <Image
                style={styles.icon}
                source={AppImages.images.calendarIcon}
              />
              <Text style={styles.cardText}>
                {data.type === 'take_away'
                  ? moment(data.orderable.pickup_at).format('DD MMM')
                  : data.type === 'on_site'
                  ? moment(data.created_at).format('DD MMM')
                  : moment(data.orderable.booked_at).format('DD MMM')}
              </Text>
            </View>
            <View style={styles.card}>
              <Image style={styles.icon} source={AppImages.images.clock} />
              <Text style={styles.cardText}>
                {data.type === 'take_away'
                  ? moment(data.orderable.pickup_at).format('HH:mm')
                  : data.type === 'on_site'
                  ? moment(data.created_at).format('HH:mm')
                  : moment(data.orderable.booked_at).format('HH:mm')}
              </Text>
            </View>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    marginTop: 16,
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
  container: { flexDirection: 'row', marginBottom: 48 },
  content: { flex: 1 },
  icon: {
    height: 12,
    marginBottom: 6,
    tintColor: colors.white80,
    width: 12
  },
  iconBasket: { height: 16, tintColor: colors.white80, width: 16 },
  iconContainer: {
    backgroundColor: colors.black60,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 'auto',
    padding: 8
  },
  image: {
    backgroundColor: colors.veryLightGrey,
    borderRadius: 8,
    height: '100%',
    marginRight: 12,
    width: screenWidth / 4
  },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  name: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 8,
    minHeight: 36
  },
  orangeIcon: {
    tintColor: colors.paleOrange
  },
  orangeText: {
    color: colors.paleOrange
  },
  place: {
    color: colors.white60,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16
  }
});
