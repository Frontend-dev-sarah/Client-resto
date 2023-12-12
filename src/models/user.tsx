export type UserData = {
  created_at?: string;
  email?: string;
  email_verified_at?: string;
  firstname?: string;
  hiboutik_id?: number;
  id?: number;
  lastname?: string;
  newsletter?: boolean;
  phone?: string;
  updated_at?: string;
  meal_tags?: MealTag[];
  meal_allergies?: MealTag[];
  stripe_id?: string;
  subscriptions?: Subscription[];
  password?: string;
  password_confirmation?: string;
  birthdate?: string;
  sex?: 'M' | 'F' | 'O' | string;
  nb_orders?: number;
  amount_economized: string;
  edenred: any;
  avatar: string;
};

export type Avatar = {
  name: string;
  url: string;
};

export type Subscription = {
  id: number;
  name: string;
  description: string;
  price: string;
  plan_id: string;
  limit_lunch: number;
  limit_dinner: number;
  created_at: string;
  updated_at: string;
  pivot: {
    customer_id: number;
    subscription_id: number;
    stripe_id?: string;
    payment_end?: string;
    created_at: string;
    updated_at: string;
  };
};

export type Preferences = {
  meal_tags: string[];
  meal_allergies: string[];
};

export type MealTag = {
  id: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};
