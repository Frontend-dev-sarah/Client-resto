import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Payment, SharedPayments } from 'src/models/payment';

import colors from 'src/resources/common/colors';
import { formatPrice } from 'src/utils/PriceHelper';

type PaymentItemprops = {
  item: Payment;
  sharedPayments: SharedPayments;
};

export default function PaymentItem({ item }: PaymentItemprops) {
  function formatTitle(item: Payment) {
    let title = 'Paiement ';

    if (item.payment_method === 'bank') {
      title += `par CB : -${formatPrice(item.amount)}`;
    }
    if (item.payment_method === 'tr_carte') {
      title += `par TR carte : -${formatPrice(item.amount)}`;
    }
    if (item.payment_method === 'tr_papier') {
      title += `par TR papier : -${formatPrice(item.amount)}`;
    }
    if (item.payment_method === 'esp') {
      title += `par ESP : -${formatPrice(item.amount)}`;
    }
    return title;
  }

  return (
    <>
      <TouchableOpacity style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text}>{formatTitle(item)}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10
  },
  text: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 14,
    opacity: 0.8
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  img: { marginLeft: 8 },
  product: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 12,
    opacity: 0.6,
    textAlign: 'right',
    marginVertical: 4
  }
});
