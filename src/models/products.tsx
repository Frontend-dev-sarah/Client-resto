import { ImageType } from 'models/images';

export type Products = {
  current_page: number[];
  last_page: number[];
  data: Product[];
};

export type Product = {
  id: number;
  hiboutik_id: number;
  price: string;
  reduced_price: string;
  name: string;
  type: 'starter' | 'main_course' | 'dessert' | 'drink';
  description: string;
  tva: string;
  calories: number;
  fats: number;
  carbohydrates: number;
  proteins: number;
  is_sucessful: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  images: ImageType[];
  meal_allergies: AllergieType[];
  meal_tags: TagsType[];
  degre: string;
  thematics: ThematicType[];
  recipe?: Recipe;
  status?: string;
  stock?: any;
  options?: ProductOption[];
  option?: ProductOption;
};

export type ProductOption = {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type ProductNotation = {
  score: number;
  id: number;
};

export type AllergieType = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: number;
    meal_allergy_id: number;
    created_at: string;
    updated_at: string;
  };
};

export type TagsType = {
  id: number;
  icon: string;
  is_for_children: boolean;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: number;
    meal_tag_id: number;
    created_at: string;
    updated_at: string;
  };
};

export type Basket = BasketItem[];

export type BasketItem = {
  product: Product;
  option?: ProductOption;
  quantity: number;
};

export type ShortProduct = {
  created_at: string;
  id: number;
  images: ImageType[];
  name: string;
  price: string;
  quantity: number;
  updated_at: string;
};

export type ThematicType = {
  id: number;
  icon: string;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: number;
    meal_tag_id: number;
    created_at: string;
    updated_at: string;
  };
};

export type Recipe = {
  created_at: string;
  description: string;
  id: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  name: string;
  product_id: number;
};

export type Ingredient = {
  created_at: string;
  id: number;
  name: string;
  quantity: number;
  recipe_id: number;
  unity: string;
  updated_at: string;
};

export type RecipeStep = {
  created_at: string;
  description: string;
  id: number;
  name: string;
  number: number;
  recipe_id: number;
  updated_at: string;
};
