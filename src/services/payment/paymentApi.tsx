/* eslint-disable @typescript-eslint/camelcase */
import Api from 'src/services/api';

const subscribe = async ({
  token,
  discountCode
}: {
  token: string;
  discountCode: string | null;
}) => {
  try {
    const res = await Api.post(`/customers/current/subscribe`, {
      payment_method: token,
      discount_code: discountCode
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const subscribeRetry = async (token: string, invoice: string) => {
  try {
    const res = await Api.post(`/customers/current/subscribe/retry`, {
      invoice: invoice,
      payment_method: token
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const unSubscribe = async () => {
  try {
    const res = await Api.post(`/customers/current/unsubscribe`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const modifySubscriptionPayment = async (token: string) => {
  try {
    const res = await Api.put(
      `/customers/current/subscription/payment-method`,
      {
        payment_method: token
      }
    );
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getSubscriptionPaymentMethod = async () => {
  try {
    const res = await Api.get(
      'customers/current/subscription/payment-method',
      {}
    );
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getAllPaymentMethod = async () => {
  try {
    const res = await Api.get(`/customers/current/payment-methods`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const addPaymentMethod = async (id: string, type: string) => {
  try {
    const res = await Api.post(`/customers/current/payment-methods`, {
      token: id,
      card_type: type
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const deletePaymentMethod = async (id: string) => {
  try {
    const res = await Api.delete(`/customers/current/payment-methods`, {
      payment_method: id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getPaymentHistory = async (data: {
  payments?: number[];
  stripes?: string[];
  retries?: boolean;
}) => {
  try {
    const res = await Api.get(`/orders/payments/history`, {
      payments: data.payments,
      stripes: data.stripes,
      retries: data.retries
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const edenredConnect = async (code: string) => {
  try {
    const res = await Api.post(`/edenred/authenticate`, {
      authorization_code: code
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const edenredDisconnect = async () => {
  try {
    const res = await Api.get(`/edenred/disconnect`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const edenredAuthorize = async (amount: number) => {
  try {
    const res = await Api.post(`/edenred/authorize`, {
      amount
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  subscribe,
  subscribeRetry,
  unSubscribe,
  modifySubscriptionPayment,
  getSubscriptionPaymentMethod,
  getAllPaymentMethod,
  addPaymentMethod,
  deletePaymentMethod,
  getPaymentHistory,
  edenredConnect,
  edenredDisconnect,
  edenredAuthorize
};
