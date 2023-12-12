import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';

import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import HomePage from 'src/pages/HomeStack/HomePage';
import OnboardingPage from 'src/pages/AuthStack/OnboardingPage';
import ProductDetailsPage from 'src/pages/HomeStack/ProductDetailsPage';
import CardPage from 'src/pages/AccountStack/CardPage';
import OrderOnSiteSummaryPage from 'src/pages/HomeStack/OrderOnSiteSummaryPage';
import RecipePage from 'src/pages/HomeStack/RecipePage';
import { Recipe } from 'src/models/products';

export type HomeStackParamList = {
  HomePage: { showOrderConfirm: boolean; showBookingConfirm: boolean };
  OnboardingPage: undefined;
  ProductDetailsPage: { orderDisabled?: boolean };
  CardPage: { simpleCard: boolean };
  OrderOnSiteSummaryPage: { executeOrder?: boolean };
  RecipePage: { recipe?: Recipe };
};

const Stack = createStackNavigator<HomeStackParamList>();

type HomeStackProps = {
  user?: UserData;
  showOnBoarding: boolean;
};

type Props = HomeStackProps;

function HomeStack({ showOnBoarding }: HomeStackProps) {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      {showOnBoarding ? (
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
      ) : (
        <>
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen
            name="ProductDetailsPage"
            component={ProductDetailsPage}
          />
          <Stack.Screen name="CardPage" component={CardPage} />
          <Stack.Screen
            name="OrderOnSiteSummaryPage"
            component={OrderOnSiteSummaryPage}
          />
          <Stack.Screen name="RecipePage" component={RecipePage} />
        </>
      )}
    </Stack.Navigator>
  );
}

export { HomeStackProps };

export default (props: JSX.IntrinsicAttributes) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <HomeStack
          user={ctx.user}
          showOnBoarding={ctx.showOnBoarding}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
