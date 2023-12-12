/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, createContext, ReactNode } from 'react';
import * as Location from 'expo-location';

import {
  Restaurant,
  District,
  Restaurants,
  LocationType,
  PlaceChoice
} from 'src/models/restaurants';
import restaurantApi from 'src/services/restaurant/restaurantApi';
import { aroundMe } from 'src/utils/constants';
import { BookingConsumer } from './BookingContext';
import { AuthConsumer } from './AuthContext';
import { UserData } from 'src/models/user';
import moment from 'moment';
import { AsyncStorage } from 'react-native';
import StorageKeys from 'src/utils/StorageKeys';

type DistrictContextInterface = {
  children?: ReactNode;
  selectedHour?: string;
  selectedDate?: Date;
  selectedRestaurant?: Restaurant;
  placeChoice?: PlaceChoice;
  user?: UserData;
  personNumber?: number;
};

type State = {
  districts: District[];
  setSelectedDistrict: Function;
  selectedDistrict: District;
  restaurants?: Restaurants;
  getRestaurants: Function;
  location: LocationType;
  isLoading: boolean;
  setFiltered: Function;
};

const { Consumer, Provider } = createContext<State | undefined>(undefined);

function DistrictProvider({
  children,
  selectedDate,
  selectedHour,
  placeChoice,
  user,
  personNumber
}: DistrictContextInterface) {
  const [districts, setDistricts] = useState<District[]>([aroundMe]);
  const [selectedDistrict, setSelectedDistrict] = useState<District>(aroundMe);
  const [restaurants, setRestaurants] = useState<Restaurants>();
  const [location, setLocation] = useState<LocationType>();
  // add default location if we don't want to have empty pages on starting app
  //   {
  //   lat: 45.7620335385769,
  //   lng: 4.83565081081271
  // }
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // this const is usefull to know if we have to pass date, hour and personNumber when we get restaurants
  const [filtered, setFiltered] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    !isLoading && getRestaurants();
  }, [selectedDistrict, filtered, placeChoice, personNumber]);

  useEffect(() => {
    selectedDistrict &&
      AsyncStorage.setItem(
        StorageKeys.selectedDistrict,
        JSON.stringify(selectedDistrict)
      );
  }, [selectedDistrict]);

  async function loadData() {
    const district = await AsyncStorage.getItem(StorageKeys.selectedDistrict);
    district && (await setSelectedDistrict(JSON.parse(district)));
    getLocation();
    getDistricts();
  }

  useEffect(() => {
    // when we have location we load data
    if (location && location.lat && location.lng) {
      getRestaurants();
    }
  }, [location]);

  async function getLocation() {
    await Location.requestPermissionsAsync();
    const res = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    }).catch(e => {
      setIsLoading(false);
    });
    if (res && res.coords) {
      await setIsLoading(true);
      await setLocation({
        lat: res.coords.latitude,
        lng: res.coords.longitude
      });
    } else {
      setIsLoading(false);
    }
  }

  function getDate() {
    if (selectedHour) {
      const hour = selectedHour.split(':')[0];
      const min = selectedHour.split(':')[1];
      const date = selectedDate;
      return moment(date)
        .toDate()
        .setHours(parseInt(hour), parseInt(min), 0);
    }
  }

  async function getRestaurants() {
    setIsLoading(true);
    const res = await restaurantApi.getRestaurants({
      district: selectedDistrict.data.id,
      lat:
        selectedDistrict.data.id === 0 ? location && location.lat : undefined,
      lng:
        selectedDistrict.data.id === 0 ? location && location.lng : undefined,
      reservation_date:
        selectedDate && selectedHour && filtered ? getDate() : undefined,
      togo: placeChoice === 'takeAway',
      user_id: user ? user.id : undefined,
      reservation_customer_count:
        placeChoice !== 'takeAway' ? personNumber : undefined
    });
    if (!res.error) {
      setRestaurants(res);
      const tmp = { ...selectedDistrict };
      tmp.catalogs = res.catalogs; // on met à jour le catalogue du district en fonction du getRestaurants -> comme on stocke le district en local on évite avec ça d'avoir d'ancienne données
      setSelectedDistrict(tmp);
    }
    setIsLoading(false);
  }

  async function getDistricts() {
    const res = await restaurantApi.getAllDistricts();
    if (!res.error) {
      await setDistricts(districts && districts.concat(res));
    }
  }

  return (
    <Provider
      value={{
        districts,
        selectedDistrict,
        setSelectedDistrict,
        restaurants,
        getRestaurants,
        location,
        isLoading,
        setFiltered,
        getLocation
      }}
    >
      {children}
    </Provider>
  );
}

export { Consumer as DistrictConsumer };

export default (props: JSX.IntrinsicAttributes & DistrictContextInterface) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookingCtx =>
          bookingCtx &&
          ctx && (
            <DistrictProvider
              selectedDate={bookingCtx.selectedDate}
              selectedHour={bookingCtx.selectedHour}
              selectedRestaurant={bookingCtx.selectedRestaurant}
              placeChoice={bookingCtx.placeChoice}
              personNumber={bookingCtx.personNumber}
              user={ctx.user}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
