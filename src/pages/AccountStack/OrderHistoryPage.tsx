import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import OrderItem from 'src/components/Order/OrderItem';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { Order } from 'src/models/payment';
import RoutesNames from 'src/navigation/RoutesNames';
import moment from 'moment';

type OrderHistoryPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function OrderHistoryPage({
  navigation
}: OrderHistoryPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [history, setHistory] = useState<Order[]>([]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const DATA = [
    {
      title: I18n.t('orderHistory.actual'),
      data: history.filter(
        data =>
          moment(
            data.type === 'take_away'
              ? data.orderable.pickup_at
              : data.type === 'on_site'
                ? data.created_at
                : data.orderable.booked_at
          )
            .toDate()
            .getTime() > new Date().getTime()
      )
    },
    {
      title: I18n.t('orderHistory.passed'),
      data: history.filter(
        data =>
          moment(
            data.type === 'take_away'
              ? data.orderable.pickup_at
              : data.type === 'on_site'
                ? data.created_at
                : data.orderable.booked_at
          )
            .toDate()
            .getTime() < new Date().getTime()
      )
    }
  ];

  async function getData() {
    setIsLoading(true);
    const res = await bookingApi.getOrderHistory(currentPage);
    if (res && !res.error && currentPage === res.current_page[0]) {
      setLastPage(res.last_page[0]);
      setHistory([...history].concat(res.data));
    }
    setIsLoading(false);
  }

  function onPressOrder(order: Order) {
    navigation.navigate(RoutesNames.OrderHistoryDetailsPage, { order: order });
  }

  return (
    <>
      <Header backIcon navigation={navigation} />
      <SectionList
        sections={DATA}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <OrderItem onPress={() => onPressOrder(item)} data={item} />
        )}
        renderSectionHeader={({ section: { title, data } }) =>
          data && data.length > 0 ? (
            <Text style={styles.sectionTitle}>{title}</Text>
          ) : (
              <></>
            )
        }
        ListHeaderComponent={
          <Text style={styles.title}>{I18n.t('orderHistory.title')}</Text>
        }
        ListFooterComponent={
          <>
            {isLoading && <ActivityIndicator color={colors.lightGrey} />}
            {!isLoading && history.length === 0 && (
              <Text style={styles.nodata}>{I18n.t('orderHistory.noData')}</Text>
            )}
          </>
        }
        style={styles.container}
        onEndReached={() =>
          history.length > 0 &&
          currentPage < lastPage &&
          setCurrentPage(currentPage + 1)
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 25 },
  nodata: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    marginTop: '10%',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  sectionTitle: {
    backgroundColor: colors.darkGrey,
    color: colors.white80,
    fontFamily: 'GothamBold',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: 16
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginBottom: 32
  }
});
