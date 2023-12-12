import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import I18n from 'i18n-js';

import CardComponent from 'src/components/Payment/CardComponent';
import { screenWidth } from 'src/utils/constants';
import TouchableIcon from 'src/components/Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import paymentApi from 'src/services/payment/paymentApi';
import colors from 'src/resources/common/colors';
import { PaymentConsumer } from 'src/store/PaymentContext';
import { PaymentMethod, Conecs } from 'src/models/payment';

type CardsListProps = {
  paymentMethodList?: PaymentMethod[];
  getAllPaymentMethod?: Function;
  subscriptionCard?: PaymentMethod;
  blockBack: Function;
  reload: boolean;
  setReload: Function;
};

function CardsList({
  paymentMethodList,
  getAllPaymentMethod,
  subscriptionCard,
  blockBack,
  reload,
  setReload
}: CardsListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading && paymentMethodList) {
      setIsLoading(false);
    }
  }, [paymentMethodList]);

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (reload) {
      setIsLoading(true);
      reloadData();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    if (deletingId && deletingId.length > 0) {
      blockBack(true);
    } else blockBack(false);
  }, [deletingId]);

  async function reloadData() {
    setIsLoading(true);
    getAllPaymentMethod && getAllPaymentMethod();
    setIsLoading(false);
  }

  async function deleteCard(id: string) {
    setDeletingId(deletingId => [...deletingId, id]);
    const res = await paymentApi.deletePaymentMethod(id);
    if (res && !res.error) {
      reloadData();
    }
    const tmp = deletingId.splice(deletingId.indexOf(id), 1);
    setDeletingId(tmp);
  }

  function renderCardItem(item: PaymentMethod) {
    return (
      <View style={styles.row}>
        <>
          {item.type === 'card' ? (
            <CardComponent
              date={`${item.card.exp_month}/${item.card.exp_year}`}
              name={item.billing_details.name}
              number={`••••  ••••  ••••  ${item.card.last4}`}
              type={
                item.metadata &&
                item.metadata.card_type &&
                item.metadata.card_type === 'swile'
                  ? item.metadata.card_type
                  : item.card.brand
              }
              customStyle={styles.card}
            />
          ) : (
            <CardComponent type={'edenred'} customStyle={styles.card} />
          )}
          {((subscriptionCard &&
            item &&
            item.id &&
            item.id !== subscriptionCard.id) ||
            (!subscriptionCard && item && item.id)) &&
          item.type !== 'edenred' &&
          deletingId.indexOf(item.id) === -1 ? (
            <TouchableIcon
              height={20}
              width={20}
              icon={AppImages.images.trash}
              onPress={() => deleteCard(item.id)}
              style={styles.trash}
            />
          ) : (
            deletingId.indexOf(item.id) !== -1 && (
              <ActivityIndicator
                color={colors.lightGrey}
                style={styles.paddingLoader}
              />
            )
          )}
        </>
      </View>
    );
  }

  return isLoading ? (
    <ActivityIndicator color={colors.lightGrey} style={styles.loader} />
  ) : (
    <>
      <FlatList
        data={paymentMethodList}
        renderItem={({ item }) => renderCardItem(item)}
        style={styles.flatList}
        ListFooterComponent={() => <View style={styles.bottom} />}
        keyExtractor={item => (item && item.id ? item.id : '')}
        ListEmptyComponent={() => (
          <Text style={styles.noData}>{I18n.t('savedCards.noCard')}</Text>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottom: {
    paddingBottom: 36
  },
  card: {
    width: screenWidth - 80
  },
  flatList: { paddingTop: 32 },
  loader: {
    marginTop: 50
  },
  noData: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center'
  },
  paddingLoader: {
    padding: 18
  },
  row: { flexDirection: 'row' },
  trash: { marginLeft: 'auto', marginRight: 25 }
});

export default (props: JSX.IntrinsicAttributes & CardsListProps) => (
  <PaymentConsumer>
    {ctx =>
      ctx && (
        <CardsList
          paymentMethodList={ctx.paymentMethodList}
          getAllPaymentMethod={ctx.getAllPaymentMethod}
          subscriptionCard={ctx.subscriptionCard}
          {...props}
        />
      )
    }
  </PaymentConsumer>
);
