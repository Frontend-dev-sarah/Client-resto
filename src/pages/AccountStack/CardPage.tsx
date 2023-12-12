import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, BackHandler } from 'react-native';
import Constants from 'expo-constants';

import Header from 'src/components/Headers/Header';
import ProductsList from 'src/components/Products/ProductsList';
import MenuHeader from 'src/components/Menu/MenuHeader';
import { FOOD_CATEGORIES } from 'src/utils/constants';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import RoutesNames from 'src/navigation/RoutesNames';
import BasketPreviewComponent from 'src/components/Basket/BasketPreviewComponent';
import { PlaceChoice, Restaurant } from 'src/models/restaurants';
import { BookingConsumer } from 'src/store/BookingContext';
import I18n from 'resources/localization/I18n';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RestaurantsStackParamList } from 'src/navigation/RestaurantsStack';
import { Product } from 'src/models/products';

type ProductDetailsRouteProp = RouteProp<RestaurantsStackParamList, 'CardPage'>;

type CardPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  placeChoice: PlaceChoice;
  selectedRestaurant: Restaurant;
  route: ProductDetailsRouteProp;
  freeBasket: Function;
  waitingProduct?: Product;
  addToBasket: Function;
  setPlaceChoice: Function;
  setSelectedRestaurant: Function;
  setRestauAlreadySet: Function;
};

function CardPage({
  navigation,
  placeChoice,
  selectedRestaurant,
  route,
  freeBasket,
  waitingProduct,
  setPlaceChoice,
  addToBasket,
  setSelectedRestaurant,
  setRestauAlreadySet
}: CardPageProps) {
  const [anim] = useState(new Animated.Value(0));
  function animateHeader() {
    return anim.interpolate({
      inputRange: [0, 140],
      outputRange: [68, 0],
      extrapolate: 'clamp'
    });
  }
  const onScroll = Animated.event([
    {
      nativeEvent: { contentOffset: { y: anim } }
    }
  ]);

  useEffect(() => {
    if (waitingProduct && selectedRestaurant) {
      addToBasket(waitingProduct);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setPlaceChoice();
          setSelectedRestaurant();
          setRestauAlreadySet(false);
        }
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        backIcon
        navigation={navigation}
        black
        onGoBack={() => {
          navigation.goBack();
          navigation.navigate(RoutesNames.RestaurantsStack, {
            screen: RoutesNames.RestaurantsPage
          });
          navigation.navigate(RoutesNames.HomeStack);
          setPlaceChoice();
          setSelectedRestaurant();
          setRestauAlreadySet(false);
        }}
        title={
          route.params && route.params.simpleCard
            ? I18n.t('menu.title')
            : placeChoice === 'alreadyOnSite'
            ? I18n.t('booking.scanOrder')
            : placeChoice === 'bookOnSite'
            ? I18n.t('booking.bookOnSite')
            : I18n.t('booking.takeAway')
        }
        subtitle={
          route.params && !route.params.simpleCard
            ? selectedRestaurant && selectedRestaurant.name
            : undefined
        }
        titleStyle={{ marginTop: Constants.statusBarHeight }}
      />
      <MenuHeader
        anim={animateHeader()}
        starter={
          <ProductsList
            category={FOOD_CATEGORIES[0]}
            onScroll={onScroll}
            navigation={navigation}
            simpleCard={route.params && route.params.simpleCard}
          />
        }
        mainCourses={
          <ProductsList
            category={FOOD_CATEGORIES[1]}
            onScroll={onScroll}
            navigation={navigation}
          />
        }
        desserts={
          <ProductsList
            category={FOOD_CATEGORIES[2]}
            onScroll={onScroll}
            navigation={navigation}
          />
        }
        drinks={
          <ProductsList
            category={FOOD_CATEGORIES[3]}
            onScroll={onScroll}
            navigation={navigation}
          />
        }
      />

      <BasketPreviewComponent navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default (props: JSX.IntrinsicAttributes & CardPageProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <CardPage
          placeChoice={ctx.placeChoice}
          selectedRestaurant={ctx.selectedRestaurant}
          setSelectedRestaurant={ctx.setSelectedRestaurant}
          freeBasket={ctx.freeBasket}
          waitingProduct={ctx.waitingProduct}
          addToBasket={ctx.addToBasket}
          setPlaceChoice={ctx.setPlaceChoice}
          setRestauAlreadySet={ctx.setRestauAlreadySet}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
