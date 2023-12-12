import { ImageType } from 'models/images';
import { Product, ThematicType } from './products';

export type Restaurants = {
  restaurants: Restaurant[];
  suggestions: Product[];
};

export type Restaurant = {
  id: number;
  hiboutik_id: number;
  name: string;
  description: string;
  address_raw: {
    address: string;
    city: string;
    lat: string;
    lng: string;
    readable: string;
    zip_code: string;
  };
  readable: string;
  address: string;
  city: string;
  zip_code: string;
  lat: string;
  lng: string;
  phone_number: string;
  max_size: number;
  opening_hours_monday: OpeningInfos;
  opening_hours_tuesday: OpeningInfos;
  opening_hours_wednesday: OpeningInfos;
  opening_hours_thursday: OpeningInfos;
  opening_hours_friday: OpeningInfos;
  opening_hours_saturday: OpeningInfos;
  opening_hours_sunday: OpeningInfos;
  created_at: string;
  updated_at: string;
  images: ImageType[];
  distance?: string;
  average?: number;
};

export type OpeningInfos = {
  opening_hours: string[];
  slots: string[];
};

export type LocationType = {
  lat?: number;
  lng?: number;
};

export type Catalog = {
  id: number;
  name: string;
  is_active: boolean;
  start?: string;
  end?: string;
  created_at: string;
  updated_at: string;
  pivot: {
    district_id: number;
    catalog_id: number;
    created_at?: string;
    updated_at?: string;
  };
  menus: Meal[];
  menu_drinks: Meal[];
  thematics_plats_list: ThematicType[];
  thematics_drinks_list: ThematicType[];
};

export type Meal = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    catalog_id: number;
    menu_id: number;
    created_at?: string;
    updated_at?: string;
  };
  entrée: Product[];
  plats: Product[];
  dessert: Product[];
  boisson: Product[];
  drinks: Product[];
};

export type District = {
  data: {
    id: number;
    name: string;
    readable?: string;
    address?: string;
    city?: string;
    zip_code?: string;
  };
  catalogs?: Catalog[];
  restaurants?: Restaurants;
};

export type PlaceChoice = 'takeAway' | 'bookOnSite' | 'alreadyOnSite';

export type Table = {
  capacity: number;
  created_at: string;
  id: number;
  name: string;
  occupation: number;
  room: Room;
  room_id: number;
  status: string;
  updated_at: string;
};

export type Room = {
  created_at: string;
  current_capacity: number;
  id: number;
  max_capacity: number;
  name: string;
  restaurant_id: number;
  updated_at: string;
};

export type Slot = {
  created_at: string;
  id: number;
  restaurant: Restaurant;
  restaurant_id: number;
  schedule_end: string;
  schedule_start: string;
  updated_at: string;
};
