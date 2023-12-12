/* eslint-disable @typescript-eslint/camelcase */
import { Basket, ProductNotation } from 'src/models/products';
import Api from 'src/services/api';

const getBasket = async (data: {
  customer_id?: string;
  t_id?: string;
  restaurant_id?: string;
}) => {
  try {
    const res = await Api.post('/basket', {
      customer_id: data.customer_id,
      t_id: data.t_id,
      restaurant_id: data.restaurant_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const setBasketInfos = async (data: {
  t_id?: string;
  customer_id?: string;
  hour?: string;
  personNumber?: number;
  selectedRestaurant?: number;
  order_type?: string | 'BookedOrder' | 'OnSiteOrder' | 'TakeAwayOrder';
}) => {
  !data.selectedRestaurant && delete data.selectedRestaurant;
  try {
    const res = await Api.put('/basket', data);
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const assignBasket = async (data: { customer_id: string; t_id: string }) => {
  if (data.t_id) {
    try {
      const res = await Api.post('/basket/assign', {
        customer_id: data.customer_id,
        t_id: data.t_id
      });
      return res;
    } catch (e) {
      return { error: { message: e.message } };
    }
  }
};

const updateBasket = async (data: {
  restaurantId?: number;
  action: 'reserve' | 'free';
  products: {
    product_id: number;
    quantity: number;
    type: 'product' | 'drink';
    option_id: number | null;
  }[];
  customer_id?: string;
  t_id?: string;
}) => {
  try {
    const res = await Api.post('/basket/products', {
      restaurant_id: data.restaurantId,
      products: data.products.reduce((res: any, prod) => {
        res.push({
          product_id: prod.type === 'product' ? prod.product_id : null,
          drink_id: prod.type === 'drink' ? prod.product_id : null,
          quantity: prod.quantity,
          type: prod.type,
          action: data.action,
          option_id: prod.option_id
        });
        return res;
      }, []),
      customer_id: data.customer_id,
      t_id: data.t_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const orderOnSite = async (data: {
  products?: {
    product_id: number;
    quantity: number;
    option_id: number | null;
  }[];
  drinks?: { drink_id: number; quantity: number; option_id: number | null }[];
  restaurant_id?: number;
  payments: number[];
  table_id?: number;
  edenredPayments?: number[];
}) => {
  try {
    const res = await Api.post('/orders/on-site', {
      products: data.products,
      drinks: data.drinks,
      restaurant_id: data.restaurant_id,
      payments: data.payments,
      edenRedPayments: data.edenredPayments,
      table_id: data.table_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const orderSharedOnSite = async (data: {
  order_id?: number;
  order_payment_product?: number[];
  products?: {
    product_id: number;
    quantity: number;
    hiboutik_id: number;
    option_id: number | null;
  }[];
  drinks?: {
    drink_id: number;
    quantity: number;
    hiboutik_id: number;
    option_id: number | null;
  }[];
  payments: number[];
  edenredPayments?: number[];
  restaurant_id?: number;
}) => {
  try {
    const res = await Api.post(`/orders/${data.order_id}/last-payment`, {
      products: data.products,
      drinks: data.drinks,
      payments: data.payments,
      edenRedPayments: data.edenredPayments,
      order_payment_products: data.order_payment_product,
      restaurant_id: data.restaurant_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const orderAndBookOnSite = async (data: {
  products?: {
    product_id: number;
    quantity: number;
    option_id: number | null;
  }[];
  drinks?: { drink_id: number; quantity: number; option_id: number | null }[];
  restaurant_id?: number;
  payments: number[];
  countPerson?: number;
  booked_at?: string;
  edenredPayments?: number[];
  description?: string;
}) => {
  try {
    const res = await Api.post('/orders/booked', {
      products: data.products,
      drinks: data.drinks,
      restaurant_id: data.restaurant_id,
      payments: data.payments,
      count: data.countPerson,
      booked_at: data.booked_at,
      edenRedPayments: data.edenredPayments,
      description:
        data.description && data.description.length > 0
          ? data.description
          : undefined
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const orderTakeAway = async (data: {
  products?: { product_id: number; quantity: number }[];
  drinks?: { drink_id: number; quantity: number }[];
  restaurant_id?: number;
  payments: number[];
  edenredPayments?: number[];
  pickup_at?: string;
}) => {
  try {
    const res = await Api.post('/orders/take-away', {
      products: data.products,
      drinks: data.drinks,
      restaurant_id: data.restaurant_id,
      payments: data.payments,
      pickup_at: data.pickup_at,
      edenRedPayments: data.edenredPayments
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const payOrder = async (
  amount: number,
  payment_method: string,
  restaurant_id?: number
) => {
  try {
    const res = await Api.post('/orders/payments/execute', {
      amount: amount * 100,
      payment_method: payment_method,
      restaurant_id: restaurant_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getOrderDetail = async (id: number) => {
  try {
    const res = await Api.get(`/orders/${id}`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const cancelPayment = async (id: number) => {
  try {
    const res = await Api.put(`/orders/payments/fail`, { order_payment: id });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getOrderHistory = async (page = 1) => {
  try {
    const res = await Api.get(`/customers/current/orders`, { page: page });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getBookingHistory = async () => {
  try {
    const res = await Api.get(`/reservation`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const book = async (
  restaurant_id: number,
  booked_at: string,
  count: number,
  description?: string
) => {
  try {
    const res = await Api.post(`/reservation`, {
      restaurant_id: restaurant_id,
      booked_at: booked_at,
      count: count,
      description: description
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const cancelBooking = async (id: number) => {
  try {
    const res = await Api.delete(`/reservation/${id}`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const openTable = async (data: {
  tableId: string;
  count?: number;
  reservation_id?: number;
}) => {
  try {
    const res = await Api.post(`/tables/${data.tableId}/open`, {
      nb_seats: data.count,
      reservation_id: data.reservation_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const closeTable = async (tableId: number) => {
  try {
    const res = await Api.post(`/tables/${tableId}/close`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const verifyCurrentBooking = async () => {
  try {
    const res = await Api.get(`/customers/current/table`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getOrderBill = async (orderId: number) => {
  try {
    const res = await Api.get(`/orders/${orderId}/invoice`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const responseAskJoin = async (askingId: string, response: boolean) => {
  try {
    const res = await Api.post(`/tables/${askingId}/response`, {
      responseType: response
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const callWaiter = async (restaurantId: number, tableId?: number) => {
  try {
    const res = await Api.patch(`/customers/${restaurantId}/callWaiter`, {
      table_id: tableId
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const deleteBasket = async (id: number) => {
  try {
    const res = await Api.delete(`/basket/${id}`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const sendRestaurantNotation = async (data: {
  restaurantId: number;
  restaurantNote?: number;
  waiterNote?: number;
  comment?: string;
  isTakeAway?: boolean;
}) => {
  try {
    const res = await Api.post(`/restaurants/${data.restaurantId}/score`, {
      scoreMood: data.restaurantNote,
      takeAway: data.isTakeAway ? 1 : 0,
      scoreService: data.waiterNote,
      comment: data.comment
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const sendProductsNotation = async (data: {
  productsNote: ProductNotation[];
  evaluationId: number;
  comment?: string;
}) => {
  try {
    const res = await Api.post(`/products/score`, {
      products: data.productsNote,
      restaurant_score_id: data.evaluationId,
      comment: data.comment
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const scanForClickAndCollect = async (code: string) => {
  try {
    const res = await Api.put(`/orders/click-and-collect/${code}`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getSharedPayments = async () => {
  try {
    const res = await Api.post(`/orders/to-pay`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  updateBasket,
  orderOnSite,
  payOrder,
  orderAndBookOnSite,
  orderTakeAway,
  getOrderDetail,
  cancelPayment,
  getOrderHistory,
  getBookingHistory,
  book,
  cancelBooking,
  openTable,
  closeTable,
  verifyCurrentBooking,
  getOrderBill,
  getBasket,
  assignBasket,
  setBasketInfos,
  responseAskJoin,
  callWaiter,
  deleteBasket,
  sendRestaurantNotation,
  sendProductsNotation,
  scanForClickAndCollect,
  getSharedPayments,
  orderSharedOnSite
};
