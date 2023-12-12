import React, { useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  View
} from 'react-native';

import CardPreviewComponent from '../Payment/CardPreviewComponent';
import { PaymentConsumer } from 'src/store/PaymentContext';
import { BookingConsumer } from 'src/store/BookingContext';
import colors from 'src/resources/common/colors';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';
import { PaymentMethod } from 'src/models/payment';

type PaymentMethodListprops = {
  paymentMethodList?: PaymentMethod[];
  selectedCard?: PaymentMethod;
  setSelectedCard?: Function;
  isLoading?: boolean;
  setPayWithEdenred: Function;
  payWithEdenred: boolean;
};

function PaymentMethodList({
  paymentMethodList,
  setSelectedCard,
  selectedCard,
  isLoading,
  setPayWithEdenred,
  payWithEdenred
}: PaymentMethodListprops) {
  useEffect(() => {
    if (
      paymentMethodList &&
      paymentMethodList.length === 1 &&
      paymentMethodList[0].type &&
      paymentMethodList[0].type !== 'edenred'
    ) {
      setSelectedCard && setSelectedCard(paymentMethodList[0]);
    }
  }, [paymentMethodList]);

  function renderFooter() {
    return (
      <View style={styles.row}>
        {isLoading && <ActivityIndicator color={colors.lightGrey} />}
        <TouchableRipple
          style={styles.addContainer}
          onPress={() =>
            navigatorRef.current.navigate(RoutesNames.PaymentModalNavigator, {
              screen: RoutesNames.AddPaymentMethodPage,
              params: { addingCard: true, fromBasket: true }
            })
          }
        >
          <Image source={AppImages.images.plus} />
        </TouchableRipple>
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={paymentMethodList}
      contentContainerStyle={styles.flatlist}
      renderItem={({ item }) => {
        return (
          <CardPreviewComponent
            number={item.type !== 'edenred' ? item.card.last4 : undefined}
            type={
              item.type === 'edenred'
                ? 'edenred'
                : item.metadata && item.metadata.card_type === 'swile'
                ? item.metadata.card_type
                : item.card.brand
            }
            bordered={
              item.type === 'edenred'
                ? payWithEdenred
                : selectedCard && item.id === selectedCard.id
            }
            onPress={() =>
              item.type === 'edenred'
                ? setPayWithEdenred(!payWithEdenred)
                : selectedCard && item.id === selectedCard.id?setSelectedCard && setSelectedCard()  : setSelectedCard && setSelectedCard(item)
            }
          />
        );
      }}
      ListFooterComponent={renderFooter}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  addContainer: {
    borderColor: colors.white10,
    borderRadius: 4.3,
    borderStyle: 'solid',
    borderWidth: 1,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 27
  },
  flatlist: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 25
  },
  row: {
    flexDirection: 'row'
  }
});

export default (props: JSX.IntrinsicAttributes & PaymentMethodListprops) => (
  <BookingConsumer>
    {bookCtx => (
      <PaymentConsumer>
        {ctx =>
          ctx &&
          bookCtx && (
            <PaymentMethodList
              paymentMethodList={ctx.paymentMethodList}
              selectedCard={bookCtx.selectedCard}
              setSelectedCard={bookCtx.setSelectedCard}
              setPayWithEdenred={bookCtx.setPayWithEdenred}
              payWithEdenred={bookCtx.payWithEdenred}
              isLoading={ctx.isLoading}
              {...props}
            />
          )
        }
      </PaymentConsumer>
    )}
  </BookingConsumer>
);
