import { Product, ShortProduct } from './products';
import { Restaurant, Table } from './restaurants';

export type CardType = {
  brand: string;
  checks: {
    address_line1_check?: string;
    address_postal_code_check?: string;
    cvc_check: string;
  };
  country: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  generated_from?: string;
  last4: string;
  three_d_secure_usage: {
    supported: boolean;
  };
  wallet?: string;
};

export type PaymentMethod = {
  billing_details: {
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    email?: string;
    name: string;
    phone?: string;
  };
  card: CardType;
  created?: number;
  customer: string;
  id: string;
  livemode: boolean;
  metadata: { card_type: 'bank' | 'swile' };
  object: string;
  type: 'card' | 'edenred' | string;
  created_at: string;
  customer_id: number;
  cvv: string;
  expiration: string;
  name: string;
  pan: string;
  updated_at: string;
};

export type Conecs = {
  created_at: string;
  customer_id: number;
  cvv: string;
  expiration: string;
  id: number;
  name: string;
  pan: string;
  type: 'edenred' | string;
  updated_at: string;
};

export type Payment = {
  amount: string;
  created_at: string;
  customer_id: number;
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  payment_method_id: string;
  status: string;
  stripe_id: string;
  updated_at: string;
};

export type Order = {
  id: number;
  hiboutik_id: number;
  customer_id: number;
  paid_at: string;
  status: 'paid' | 'pending' | string;
  created_at: string;
  updated_at: string;
  products: Product[] | ShortProduct[];
  table_id: number;
  restaurant_id: number;
  reservation_id: number;
  count: number;
  hiboutik_calendar_id: number;
  type: 'booked' | 'take_away' | 'on_site';
  orderable: {
    booked_at: string;
    pickup_at: string;
    count: number;
    hiboutik_calendar_id: number;
    reservation_id: number;
    restaurant: Restaurant;
    restaurant_id: number;
    table_id: number;
  };
  total: number;
  order_payment: Payment | any;
  kitchen_status?: 'starter' | 'main_course' | 'dessert' | 'done';
  table?: Table;
};

export type Booking = {
  booked_at: string;
  count: number;
  created_at: string;
  customer_id: number;
  deleted_at: string;
  description: string;
  id: number;
  restaurant: Restaurant;
  restaurant_id: number;
  status: string;
  table: Table;
  table_id: number;
  updated_at: string;
  order?: Order;
};

export type PaymentType = {
  key: string;
  value: string;
};

export type SharedPayment = {
  created_at: string;
  customer_id: number;
  hiboutik_id: number;
  id: number;
  order_payments_id: number;
  payment_history_id: number;
  product_price: string;
  quantity: number;
  updated_at: string;
  payment: Payment[];
  order_id: number;
};

export type SharedPayments = SharedPayment[];

export type PaidProducts = {
  hiboutik_id: number;
  quantity: number;
}[];
