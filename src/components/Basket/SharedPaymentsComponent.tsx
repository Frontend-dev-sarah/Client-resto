import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Payment, SharedPayments } from 'src/models/payment';

import PaymentItem from './PaymentItem';

type SharedPaymentsComponentprops = {
  sharedPayments: SharedPayments;
};

export default function SharedPaymentsComponent({
  sharedPayments
}: SharedPaymentsComponentprops) {
  const [alreadyPayed, setAlreadyPayed] = useState<Payment[]>([]);

  useEffect(() => {
    filterAlreadyPayed();
  }, [sharedPayments]);

  function filterAlreadyPayed() {
    const tmp: Payment[] = [];
    sharedPayments &&
      sharedPayments.map(p => {
        p.payment.map(item => Object.assign(item, { couvert: p.couvert }));
        p.payment.map(payment => {
          const index = tmp.findIndex(
            item =>
              item.couvert === p.couvert &&
              item.payment_method === payment.payment_method
          );
          if (index !== -1 && index !== (null || undefined)) {
            tmp[index].amount =
              parseFloat(tmp[index].amount) + parseFloat(payment.amount);
          } else {
            tmp.push(payment);
          }
        });
      });
    setAlreadyPayed(tmp);
  }

  return (
    <FlatList
      data={alreadyPayed}
      style={styles.flatlist}
      renderItem={({ item }: { item: Payment }) => (
        <PaymentItem item={item} sharedPayments={sharedPayments} />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  flatlist: {
    marginBottom: 15
  }
});
