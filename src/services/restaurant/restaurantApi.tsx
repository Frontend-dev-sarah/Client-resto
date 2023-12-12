/* eslint-disable @typescript-eslint/camelcase */
import Api from 'src/services/api';

const getRestaurants = async ({
  district = 0,
  lat,
  lng,
  reservation_date,
  reservation_customer_count = 2,
  togo = false,
  user_id
}: {
  district: number;
  lat?: number;
  lng?: number;
  reservation_date?: number;
  reservation_customer_count?: number;
  togo?: boolean;
  user_id?: number;
}) => {
  try {
    const res = await Api.get('/restaurants', {
      district: district,
      user_lat: lat,
      user_lng: lng,
      reservation_date: reservation_date,
      reservation_customer_count: reservation_customer_count,
      togo: togo,
      user_id: user_id
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getAllDistricts = async () => {
  try {
    const res = await Api.get('/districts', {
      getCatalogs: false
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getAllRestaurants = async () => {
  try {
    const res = await Api.get('/restaurants/list', {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getRestaurantAvailability = async (
  restaurant: number,
  date: string,
  nb: number
) => {
  try {
    const res = await Api.get(
      `/restaurants/${restaurant}/${date}/reservations-slots/${nb}`,
      {}
    );
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getTakeAwayClosedSlots = async (restaurantId: number) => {
  try {
    const res = await Api.get(
      `/restaurants/${restaurantId}/closedSchedule`,
      {}
    );
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  getRestaurants,
  getAllDistricts,
  getRestaurantAvailability,
  getAllRestaurants,
  getTakeAwayClosedSlots
};
