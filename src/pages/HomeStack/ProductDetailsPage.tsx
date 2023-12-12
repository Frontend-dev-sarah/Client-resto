/* eslint-disable @typescript-eslint/camelcase */
import I18n from 'resources/localization/I18n';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Animated
} from 'react-native';

import { AuthConsumer } from 'store/AuthContext';
import { Product } from 'src/models/products';
import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import Header from 'src/components/Headers/Header';
import { RouteProp } from '@react-navigation/native';
import ProductInfoItem from 'src/components/Products/ProductInfoItem';
import { screenHeight } from 'src/utils/constants';
import ProductTag from 'components/Products/ProductTag';
import { RestaurantsStackParamList } from 'src/navigation/RestaurantsStack';
import { BookingConsumer } from 'src/store/BookingContext';
import BasketPreviewComponent from 'src/components/Basket/BasketPreviewComponent';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import RoutesNames from 'src/navigation/RoutesNames';
import { PlaceChoice, Restaurant } from 'src/models/restaurants';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RecipeCard from 'src/components/Products/RecipeCard';
import { readProduct } from 'src/services/analytics/analytics';
import { TouchableRipple } from 'react-native-paper';
import AnimatedBasketIcon from 'src/components/Animated/AnimatedBasketIcon';
import { isRestaurantOpened } from 'src/utils/TimeHelper';

type ProductDetailsRouteProp = RouteProp<
  RestaurantsStackParamList,
  'ProductDetailsPage'
>;

type ProductDetailsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: ProductDetailsRouteProp;
  addToBasket: Function;
  alreadySubscribed: boolean;
  placeChoice?: PlaceChoice;
  setWaitingProduct?: Function;
  hasBasket?: boolean;
  setReturnToBasketVisible?: Function;
  selectedRestaurant?: Restaurant;
};

function ProductDetailsPage({
  navigation,
  route,
  addToBasket,
  alreadySubscribed,
  placeChoice,
  setWaitingProduct,
  hasBasket,
  setReturnToBasketVisible,
  selectedRestaurant
}: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product>();
  const [addingIsLoading, setAddingIsLoading] = useState<boolean>(false);
  const [emptyStock, setEmptyStock] = useState<boolean>(false);

  useEffect(() => {
    route.params && route.params.product && setProduct(route.params.product);
  }, []);

  useEffect(() => {
    const index =
      selectedRestaurant &&
      product &&
      product.stock.findIndex(s => s.restaurant_id === selectedRestaurant.id);
    if (
      product &&
      product.stock[index] &&
      product.stock[index].provisional_stock <= 0
    ) {
      setEmptyStock(true);
    }
  }, [product && product.stock, selectedRestaurant]);

  useEffect(() => {
    if (product) {
      readProduct({
        product_name: product.name,
        product_id: product.id,
        price: product.price,
        reduced_price: product.reduced_price
      });
    }
  }, [product]);

  const orderDisabled = route.params && route.params.orderDisabled;

  const [anim] = useState(new Animated.Value(0));
  function animateHeader() {
    return anim.interpolate({
      inputRange: [0, screenHeight - 120],
      outputRange: [screenHeight / 2.2, 0],
      extrapolate: 'clamp'
    });
  }
  const onScroll = Animated.event([
    {
      nativeEvent: { contentOffset: { y: anim } }
    }
  ]);

  function goToRecipe() {
    navigation.navigate(RoutesNames.RecipePage, {
      recipe: product && product.recipe ? product.recipe : null
    });
  }

  if (!product) {
    return (
      <ActivityIndicator style={styles.indicator} color={colors.lightGrey} />
    );
  } else {
    return (
      <>
        <View style={styles.header}>
          <Header backIcon navigation={navigation} />
        </View>
        <View style={styles.mainContainer}>
          <ProductInfoItem
            product={product}
            successFull={
              (product.is_sucessful || emptyStock) &&
              !(route.params && route.params.simpleCard)
            }
          />
          <Animated.View
            style={[styles.contentContainer, { top: animateHeader() }]}
          >
            <View style={styles.titleInformations}>
              <Text style={styles.priceText}>{`${parseFloat(
                alreadySubscribed && product.reduced_price
                  ? product.reduced_price
                  : product.price
              ).toFixed(2)} €`}</Text>
              {!placeChoice ||
              placeChoice === 'takeAway' ||
              isRestaurantOpened({ restaurant: selectedRestaurant }) ? (
                <TouchableRipple
                  disabled={
                    (addingIsLoading ||
                      product.is_sucessful ||
                      emptyStock ||
                      orderDisabled) &&
                    !(route.params && route.params.simpleCard)
                  }
                  style={[
                    styles.orderButton,
                    (product.is_sucessful || emptyStock || orderDisabled) &&
                      !(route.params && route.params.simpleCard) &&
                      styles.orderButtonInactive
                  ]}
                  onPress={async () => {
                    if (
                      !(product.is_sucessful || emptyStock) ||
                      (route.params && route.params.simpleCard)
                    ) {
                      if (hasBasket && !placeChoice) {
                        setReturnToBasketVisible &&
                          setReturnToBasketVisible(true);
                      } else if (placeChoice) {
                        setAddingIsLoading(true);
                        await addToBasket(product);
                      } else {
                        setWaitingProduct && setWaitingProduct(product);
                        navigatorRef.current.navigate(
                          RoutesNames.ModalOrderNavigator
                        );
                      }
                    }
                  }}
                >
                  <AnimatedBasketIcon
                    isLoading={addingIsLoading}
                    onAnimEnd={() => setAddingIsLoading(false)}
                    big
                    inactive={
                      (product.is_sucessful || emptyStock || orderDisabled) &&
                      !(route.params && route.params.simpleCard)
                    }
                  />
                </TouchableRipple>
              ) : (
                <></>
              )}
            </View>
            <ScrollView
              scrollEventThrottle={16}
              onScroll={onScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentInformations}>
                <Text style={styles.name}>{product.name}</Text>
                {/* <Notation notation={3} /> */}
                <View style={styles.tagsContainer}>
                  <ProductTag tags={product.meal_tags} />
                  <ProductTag allergies={product.meal_allergies} />
                </View>
                {product.description && product.description.length > 0 && (
                  <Text style={styles.text}>{product.description}</Text>
                )}
                <View style={styles.dataWrapper}>
                  {product.calories ? (
                    <View style={styles.dataItem}>
                      <View style={styles.dataValue}>
                        <Text style={styles.dataValueText}>
                          {product.calories}
                        </Text>
                      </View>
                      <Text style={styles.text}>
                        {I18n.t('product.calories')}
                      </Text>
                    </View>
                  ) : null}
                  {product.fats ? (
                    <View style={styles.dataItem}>
                      <View style={styles.dataValue}>
                        <Text style={styles.dataValueText}>{product.fats}</Text>
                      </View>
                      <Text style={styles.text}>{I18n.t('product.fats')}</Text>
                    </View>
                  ) : null}
                  {product.carbohydrates ? (
                    <View style={styles.dataItem}>
                      <View style={styles.dataValue}>
                        <Text style={styles.dataValueText}>
                          {product.carbohydrates}
                        </Text>
                      </View>
                      <Text style={styles.text}>
                        {I18n.t('product.carbohydrates')}
                      </Text>
                    </View>
                  ) : null}
                  {product.proteins ? (
                    <View style={styles.dataItem}>
                      <View style={styles.dataValue}>
                        <Text style={styles.dataValueText}>
                          {product.proteins}
                        </Text>
                      </View>
                      <Text style={styles.text}>
                        {I18n.t('product.proteins')}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {product.recipe && (
                  <RecipeCard recipe={product.recipe} goToRecipe={goToRecipe} />
                )}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
        <BasketPreviewComponent navigation={navigation} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.darkGrey,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    bottom: 0,
    paddingHorizontal: 25,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    ...ifIphoneX({ paddingBottom: getBottomSpace() }, {})
  },
  contentInformations: {
    paddingBottom: 75,
    paddingVertical: 16
  },
  dataItem: {
    alignItems: 'center',
    marginBottom: 32
  },
  dataValue: {
    alignItems: 'center',
    backgroundColor: colors.lightBlack,
    borderRadius: 16,
    height: 65,
    justifyContent: 'center',
    marginBottom: 12,
    width: 55
  },
  dataValueText: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 8
  },
  dataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36
  },
  header: { position: 'absolute', top: 0, zIndex: 1 },
  indicator: {
    marginTop: 150
  },
  mainContainer: { flex: 1 },
  name: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 20,
    lineHeight: 32,
    paddingBottom: 8
  },
  orderButton: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderColor: colors.paleOrange,
    borderRadius: 6,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 24,
    zIndex: 10
  },
  orderButtonInactive: {
    borderColor: colors.brownishGrey,
    borderRadius: 6,
    borderWidth: 1
  },
  priceText: {
    color: colors.paleOrange,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    lineHeight: 24
  },
  tagsContainer: {
    marginBottom: 8,
    marginTop: 16
  },
  text: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 7
  },
  titleInformations: {
    alignItems: 'center',
    borderBottomColor: colors.white40,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24
  }
});

export default (props: JSX.IntrinsicAttributes & ProductDetailsPageProps) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          bookCtx &&
          ctx && (
            <ProductDetailsPage
              alreadySubscribed={ctx.alreadySubscribed}
              addToBasket={bookCtx.addToBasket}
              placeChoice={bookCtx.placeChoice}
              setWaitingProduct={bookCtx.setWaitingProduct}
              hasBasket={bookCtx.hasBasket}
              setReturnToBasketVisible={bookCtx.setReturnToBasketVisible}
              selectedRestaurant={bookCtx.selectedRestaurant}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
