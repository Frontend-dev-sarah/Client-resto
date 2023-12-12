import React, { useState, useEffect, createContext, ReactNode } from 'react';
import paymentApi from 'src/services/payment/paymentApi';
import { AuthConsumer } from './AuthContext';
import { UserData } from 'src/models/user';
import { PaymentMethod } from 'src/models/payment';
import { dateIsPassed } from 'src/utils/TimeHelper';

type PaymentContextInterface = {
  children: ReactNode;
  user?: UserData;
};

type State = {
  paymentMethodList?: PaymentMethod[];
  setPaymentMethodList: Function;
  getAllPaymentMethod: Function;
  subscriptionCard?: PaymentMethod;
  alreadySubscribed: boolean;
  getSubscriptionPaymentMethod: Function;
  loadData?: Function;
  subscriptionEnd?: string;
  isLoading: boolean;
  hasExpiredCard: boolean;
};

const { Provider, Consumer } = createContext<State | undefined>(undefined);

function PaymentProvider({ children, user }: PaymentContextInterface) {
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethod[] | any
  >(user && user.edenred && [{ type: 'edenred' }]);
  const [subscriptionCard, setSubscriptionCard] = useState<PaymentMethod>();
  const [alreadySubscribed, setAlreadySubscribed] = useState<boolean>(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasExpiredCard, setHasExpiredCard] = useState(false);

  useEffect(() => {
    checkSubscription();
    if (user && user.id) {
      loadData();
    }
    if (!user) {
      setPaymentMethodList(undefined);
      setSubscriptionCard(undefined);
    }
  }, [user]);

  useEffect(() => {
    let hasToUpdate = false;
    if (paymentMethodList && paymentMethodList.length > 0) {
      paymentMethodList.map((pm: PaymentMethod): void => {
        if (
          pm.card &&
          pm.card.exp_month &&
          pm.card.exp_year &&
          dateIsPassed(pm.card.exp_month, pm.card.exp_year)
        ) {
          hasToUpdate = true;
        }
      });
      if (hasToUpdate && !hasExpiredCard) {
        setHasExpiredCard(true);
      } else if (hasExpiredCard && !hasToUpdate) {
        setHasExpiredCard(false);
      }
    }
  }, [paymentMethodList]);

  async function loadData() {
    setIsLoading(true);
    getAllPaymentMethod();
    user &&
      user.subscriptions &&
      user.subscriptions[0] &&
      (await getSubscriptionPaymentMethod());
  }

  async function getAllPaymentMethod() {
    const res = await paymentApi.getAllPaymentMethod();
    if (!res.error) {
      await setPaymentMethodList(
        user && user.edenred ? [{ type: 'edenred' }, ...res] : res
      );
    }
    setIsLoading(false);
  }

  function checkSubscription() {
    if (user && user.subscriptions && user.subscriptions[0]) {
      setAlreadySubscribed(true);
      user.subscriptions[0].pivot &&
        user.subscriptions[0].pivot.payment_end &&
        setSubscriptionEnd(user.subscriptions[0].pivot.payment_end);
    } else {
      setAlreadySubscribed(false);
      setSubscriptionEnd(undefined);
    }
  }

  async function getSubscriptionPaymentMethod() {
    const res = await paymentApi.getSubscriptionPaymentMethod();
    if (res && !res.error) {
      setSubscriptionCard(res);
    }
  }

  return (
    <Provider
      value={{
        paymentMethodList,
        setPaymentMethodList,
        getAllPaymentMethod,
        subscriptionCard,
        alreadySubscribed,
        getSubscriptionPaymentMethod,
        loadData,
        subscriptionEnd,
        isLoading,
        hasExpiredCard
      }}
    >
      {children}
    </Provider>
  );
}

export { Consumer as PaymentConsumer };

export default (props: JSX.IntrinsicAttributes & PaymentContextInterface) => (
  <AuthConsumer>
    {ctx => ctx && <PaymentProvider user={ctx.user} {...props} />}
  </AuthConsumer>
);
