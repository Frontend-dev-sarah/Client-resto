import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { Booking, Order } from 'src/models/payment';
import { FlatList } from 'react-native-gesture-handler';
import BookingItem from 'src/components/Booking/BookingItem';
import RoutesNames from 'src/navigation/RoutesNames';

type BookingHistoryPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function BookingHistoryPage({
  navigation
}: BookingHistoryPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<Booking[]>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setIsLoading(true);
    const res = await bookingApi.getBookingHistory();
    if (res && !res.error) {
      setHistory(res);
    }
    setIsLoading(false);
  }

  function goToDetailss(order: Order) {
    navigation.navigate(RoutesNames.OrderHistoryDetailsPage, { order: order });
  }
  return (
    <>
      <Header backIcon navigation={navigation} />
      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BookingItem data={item} goToDetails={goToDetailss} />
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{I18n.t('booking.bookings')}</Text>
            {isLoading && <ActivityIndicator color={colors.lightGrey} />}
          </>
        }
        ListEmptyComponent={() =>
          !isLoading ? (
            <Text style={styles.nodata}>{I18n.t('booking.noData')}</Text>
          ) : (
            <></>
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  nodata: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    marginTop: '10%',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginLeft: 25
  }
});
