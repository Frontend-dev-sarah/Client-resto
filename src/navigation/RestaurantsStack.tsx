import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';

import { AuthConsumer } from 'store/AuthContext';
import RestaurantsPage from 'src/pages/RestaurantsStack/RestaurantsPage';
import RestaurantsMapPage from 'src/pages/RestaurantsStack/RestaurantsMapPage';
import RestaurantDetailsPage from 'src/pages/RestaurantsStack/RestaurantDetailsPage';
import { Restaurant } from 'src/models/restaurants';
import CardPage from 'src/pages/AccountStack/CardPage';
import ProductDetailsPage from 'src/pages/HomeStack/ProductDetailsPage';
import { Product, Recipe } from 'src/models/products';
import SubscriptionDescriptionPage from 'src/pages/AuthStack/SubscriptionDescriptionPage';
import PreferencesPage from 'src/pages/AuthStack/PreferencesPage';
import RecipePage from 'src/pages/HomeStack/RecipePage';
import NotationPage from 'src/pages/RestaurantsStack/NotationPage';

export type RestaurantsStackParamList = {
  RestaurantDetailsPage: { restaurant: Restaurant; openBookingModal: boolean };
  RestaurantsPage: undefined;
  RestaurantsMapPage: undefined;
  CardPage: { simpleCard: boolean };
  ProductDetailsPage: {
    product: Product;
    orderDisabled?: boolean;
    simpleCard?: boolean;
  };
  RecipePage: { recipe?: Recipe };
  PreferencesPage: { showSubscriptionConfirm: boolean };
  SubscriptionDescriptionPage: {
    showHeader: boolean;
    previous_screen?: string;
  };
  NotationPage: { orderId: number; orderType: string };
};

const Stack = createStackNavigator<RestaurantsStackParamList>();

type RestaurantsStackProps = {};

type Props = RestaurantsStackProps;

function RestaurantsStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <Stack.Screen name="RestaurantsPage" component={RestaurantsPage} />
      <Stack.Screen name="RestaurantsMapPage" component={RestaurantsMapPage} />
      <Stack.Screen
        name="RestaurantDetailsPage"
        component={RestaurantDetailsPage}
      />
      <Stack.Screen name="CardPage" component={CardPage} />
      <Stack.Screen name="ProductDetailsPage" component={ProductDetailsPage} />
      <Stack.Screen
        name="SubscriptionDescriptionPage"
        component={SubscriptionDescriptionPage}
      />

      <Stack.Screen name="PreferencesPage" component={PreferencesPage} />
      <Stack.Screen name="RecipePage" component={RecipePage} />
      <Stack.Screen name="NotationPage" component={NotationPage} />
    </Stack.Navigator>
  );
}

export { RestaurantsStackProps };

export default (props: JSX.IntrinsicAttributes) => (
  <AuthConsumer>{ctx => ctx && <RestaurantsStack {...props} />}</AuthConsumer>
);
