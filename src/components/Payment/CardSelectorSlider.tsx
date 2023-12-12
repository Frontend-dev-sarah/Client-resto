import React, { useEffect, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { ActivityIndicator, StyleSheet } from 'react-native';

import CardComponent from 'src/components/Payment/CardComponent';
import { screenWidth } from 'src/utils/constants';
import colors from 'src/resources/common/colors';
import { PaymentConsumer } from 'src/store/PaymentContext';
import paymentApi from 'src/services/payment/paymentApi';
import { PaymentMethod } from 'src/models/payment';
import { AuthConsumer } from 'src/store/AuthContext';
import { UserData } from 'src/models/user';

type CardSelectorSliderProps = {
  paymentMethodList?: PaymentMethod[];
  subscriptionCard?: PaymentMethod;
  loadData?: Function;
  subscription?: boolean;
  editingCard?: {
    number: string;
    name: string;
    date: string;
    cvv: string;
  };
  onCardFocus?: Function;
  user: UserData;
};

function CardSelectorSlider({
  paymentMethodList,
  subscriptionCard,
  loadData,
  subscription,
  editingCard,
  onCardFocus,
  user
}: CardSelectorSliderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingName, setEditingName] = useState<string>(
    editingCard ? editingCard.name : ''
  );
  const [editingNumber, setEditingNumber] = useState<string>(
    editingCard ? editingCard.number : ''
  );
  const [editingDate, setEditingDate] = useState<string>(
    editingCard ? editingCard.date : ''
  );
  const [editingCvv, setEditingCvv] = useState<string>(
    editingCard ? editingCard.cvv : ''
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    onCardFocus &&
      paymentMethodList &&
      paymentMethodList.filter(
        pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
      )[0] &&
      onCardFocus(
        paymentMethodList.filter(
          pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
        )[0].billing_details.name,
        `••••  ••••  ••••  ${
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          )[0].card.last4
        }`,
        `${
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          )[0].card.exp_month
        }/${
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          )[0].card.exp_year
        }`,
        '***',
        false,
        paymentMethodList.filter(
          pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
        )[0].id
      );
  }, []);

  useEffect(() => {
    if (
      subscription
        ? isLoading && paymentMethodList && subscriptionCard
        : isLoading && paymentMethodList
    ) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (editingCard && paymentMethodList) {
      ((editingNumber.length === 0 &&
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) ||
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) &&
        setEditingNumber(editingCard.number);
      ((editingName.length === 0 &&
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) ||
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) &&
        setEditingName(editingCard.name);
      ((editingDate.length === 0 &&
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) ||
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) &&
        setEditingDate(editingCard.date);
      ((editingCvv.length === 0 &&
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) ||
        currentIndex ===
          paymentMethodList.filter(
            pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
          ).length) &&
        setEditingCvv(editingCard.cvv);
    }
  }, [editingCard]);

  async function selectCard(item: PaymentMethod) {
    setIsLoading(true);
    await paymentApi.modifySubscriptionPayment(item.id);
    if (loadData) {
      await loadData();
    }
    setIsLoading(false);
  }

  function renderCardItem(item: PaymentMethod, first: boolean) {
    if (first && editingCard) {
      return (
        <CardComponent
          date={editingCard.date}
          name={editingCard.name}
          number={editingCard.number}
        />
      );
    }
    if (item && item.card) {
      return (
        <CardComponent
          date={`${item.card.exp_month}/${item.card.exp_year}`}
          name={item.billing_details && item.billing_details.name}
          number={`••••  ••••  ••••  ${item.card.last4}`}
          type={item.metadata.card_type === 'swile' ? 'swile' : item.card.brand}
          bordered={subscriptionCard && subscriptionCard.id === item.id}
          onPress={() => subscription && selectCard(item)}
        />
      );
    }
  }

  return isLoading ? (
    <ActivityIndicator color={colors.lightGrey} style={styles.loader} />
  ) : (
    <Carousel
      data={
        paymentMethodList && !subscription
          ? paymentMethodList
              .filter(
                pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
              )
              .concat([{}])
          : paymentMethodList &&
            paymentMethodList.filter(
              pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
            )
      }
      renderItem={({ item, index }: { item: PaymentMethod; index: number }) =>
        renderCardItem(
          item,
          index ===
            (user.edenred
              ? paymentMethodList.filter(
                  pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
                ).length - 1
              : paymentMethodList.filter(
                  pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
                ).length) && !subscription
        )
      }
      useScrollView={true}
      inactiveSlideScale={0.9}
      sliderWidth={screenWidth}
      itemWidth={screenWidth - 100}
      firstItem={
        paymentMethodList &&
        paymentMethodList.findIndex(
          pm => subscriptionCard && pm.id === subscriptionCard.id
        )
      }
      onSnapToItem={(index: number) => {
        const realIndex = user.edenred ? index + 1 : index;
        setCurrentIndex(realIndex);
        if (
          paymentMethodList &&
          realIndex ===
            paymentMethodList.filter(
              pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
            ).length &&
          !subscription
        ) {
          onCardFocus &&
            onCardFocus(
              editingName,
              editingNumber,
              editingDate,
              editingCvv,
              true,
              undefined
            );
        } else if (paymentMethodList) {
          onCardFocus &&
            onCardFocus(
              paymentMethodList.filter(
                pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
              )[realIndex].billing_details.name,
              `••••  ••••  ••••  ${
                paymentMethodList.filter(
                  pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
                )[realIndex].card.last4
              }`,
              `${
                paymentMethodList.filter(
                  pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
                )[realIndex].card.exp_month
              }/${
                paymentMethodList.filter(
                  pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
                )[realIndex].card.exp_year
              }`,
              '***',
              false,
              paymentMethodList.filter(
                pm => pm.type === 'card' && pm.metadata.card_type === 'bank'
              )[realIndex].id
            );
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  loader: { marginVertical: 80 }
});

export default (props: JSX.IntrinsicAttributes & CardSelectorSliderProps) => (
  <AuthConsumer>
    {userCtx => (
      <PaymentConsumer>
        {ctx =>
          ctx &&
          userCtx && (
            <CardSelectorSlider
              paymentMethodList={ctx.paymentMethodList}
              subscriptionCard={ctx.subscriptionCard}
              loadData={ctx.loadData}
              user={userCtx.user}
              {...props}
            />
          )
        }
      </PaymentConsumer>
    )}
  </AuthConsumer>
);
