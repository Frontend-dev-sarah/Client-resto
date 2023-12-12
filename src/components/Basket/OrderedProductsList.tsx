import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, Animated, FlatList } from 'react-native';

import { ShortProduct } from 'src/models/products';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import AppImages from 'src/resources/common/AppImages';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BasketItemComponent from './BasketItemComponent';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { UserData } from 'src/models/user';
import { Order } from 'src/models/payment';

type OrderedProductsListProps = {};

export default function OrderedProductsList({}: OrderedProductsListProps) {
  const [opened, setOpened] = useState<boolean>(false);
  const [display, setDisplay] = useState<boolean>(false);
  const [animIcon] = useState(new Animated.Value(0));
  const [data, setData] = useState<{ user: UserData; orders: Order[] }[]>();

  const interpolateRotation = animIcon.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  const animatedStyle = {
    transform: [{ translateY: 0 }, { rotateX: interpolateRotation }]
  };

  useEffect(() => {
    getInfos();
  }, []);

  useEffect(() => {
    checkProducts();
  }, [data]);

  function toggle() {
    setOpened(!opened);
    Animated.timing(animIcon, {
      toValue: opened ? 0 : 1,
      duration: 300
    }).start();
  }

  // check if we have products to display
  function checkProducts() {
    const hasToDisplay = data
      ? data
          .concat(data)
          .map(item => item.orders)
          .reduce((res, orders) => {
            return res.concat(orders);
          }, [])
          .reduce((res, order) => {
            return res.concat(order.products);
          }, []).length > 0
      : false;
    hasToDisplay !== display && setDisplay(hasToDisplay);
  }

  async function getInfos() {
    const res = await bookingApi.verifyCurrentBooking();
    if (res && !res.error && res.orders_on_table) {
      setData(res.orders_on_table);
    }
  }

  return display ? (
    <>
      <TouchableOpacity style={styles.row} onPress={toggle}>
        <Text style={styles.title}>{I18n.t('basket.alreadyOrdered')}</Text>
        <Animated.View style={animatedStyle}>
          <Image source={AppImages.images.arrowDown} />
        </Animated.View>
      </TouchableOpacity>
      {opened && (
        <>
          {data &&
            data.map(
              item =>
                item.orders.reduce((res: ShortProduct[], order) => {
                  return res.concat(order.products);
                }, []).length > 0 && (
                  <>
                    <Text style={styles.name}>
                      {item.user.firstname ||
                        '' + ' ' + item.user.lastname ||
                        ''}
                    </Text>
                    <FlatList
                      data={item.orders.reduce((res: ShortProduct[], order) => {
                        return res.concat(order.products);
                      }, [])}
                      renderItem={({ item }) => {
                        return (
                          <BasketItemComponent
                            onPressProduct={() => {
                              return;
                            }}
                            disableDelete
                            item={{
                              product: item,
                              quantity: item.quantity,
                              option: item.option
                            }}
                          />
                        );
                      }}
                      listKey={item => item.id.toString()}
                    />
                  </>
                )
            )}
        </>
      )}
    </>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: 16,
    marginTop: 20
  },
  name: {
    color: colors.paleOrange,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: 15
  }
});
