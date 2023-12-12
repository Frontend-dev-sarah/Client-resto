import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator
} from 'react-native';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { screenWidth } from 'src/utils/constants';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';
import { Product } from 'src/models/products';
import { AuthConsumer } from 'src/store/AuthContext';
import { BookingConsumer } from 'src/store/BookingContext';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';
import { PlaceChoice, Restaurant } from 'src/models/restaurants';
import AnimatedBasketIcon from '../Animated/AnimatedBasketIcon';
import { isRestaurantOpened } from 'src/utils/TimeHelper';

type DrinkCardProps = {
  item: Product;
  onPress: Function;
  addToBasket?: Function;
  alreadySubscribed: boolean;
  setWaitingProduct?: Function;
  placeChoice?: PlaceChoice;
  hasBasket?: boolean;
  setReturnToBasketVisible?: Function;
  selectedRestaurant?: Restaurant;
};

function DrinkCard({
  item,
  onPress,
  addToBasket,
  alreadySubscribed,
  setWaitingProduct,
  placeChoice,
  hasBasket,
  setReturnToBasketVisible,
  selectedRestaurant
}: DrinkCardProps) {
  const [addingIsLoading, setAddingIsLoading] = useState<boolean>(false);

  return (
    <TouchableRipple style={[styles.container]} onPress={() => onPress(item)}>
      <>
        <ImageBackground
          style={[styles.background, styles.shadow]}
          source={
            item.images && item.images[0] && { uri: item.images[0].image }
          }
          imageStyle={[styles.image]}
        >
          {!placeChoice ||
          placeChoice === 'takeAway' ||
          isRestaurantOpened({ restaurant: selectedRestaurant }) ? (
            <TouchableRipple
              disabled={addingIsLoading}
              style={[styles.basketContainer]}
              onPress={async () => {
                if (hasBasket && !placeChoice) {
                  setReturnToBasketVisible && setReturnToBasketVisible(true);
                } else if (placeChoice) {
                  setAddingIsLoading(true);
                  addToBasket && (await addToBasket(item));
                  // setAddingIsLoading(false);
                } else {
                  setWaitingProduct && setWaitingProduct(item);
                  await navigatorRef.current.navigate(
                    RoutesNames.ModalOrderNavigator
                  );
                }
              }}
            >
              <AnimatedBasketIcon
                isLoading={addingIsLoading}
                onAnimEnd={() => setAddingIsLoading(false)}
              />
            </TouchableRipple>
          ) : (
            <></>
          )}
          <Text style={[styles.price]}>{`${parseFloat(
            alreadySubscribed ? item.reduced_price : item.price
          ).toFixed(2)} €`}</Text>
        </ImageBackground>
        <Text style={[styles.name]}>{item.name}</Text>
        {item.degre && parseInt(item.degre) > 0 && (
          <Text style={[styles.deg]}>{`${item.degre}°`}</Text>
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 245,
    width: screenWidth / 2 - 35
  },
  // basket: {
  //   height: 20,
  //   width: 20
  // },
  basketContainer: {
    backgroundColor: colors.deepRose,
    borderRadius: 18,
    marginLeft: 12,
    marginTop: 16,
    padding: 8,
    width: 36
  },
  container: {
    marginBottom: 35,
    width: screenWidth / 2 - 12
  },
  deg: {
    color: colors.lightGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    width: screenWidth / 2 - 35
  },
  image: {
    borderRadius: 6,
    opacity: 0.8
  },
  name: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 3,
    marginTop: 12,
    width: screenWidth / 2 - 35
  },
  price: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 3,
    marginLeft: 16,
    marginTop: 'auto'
  },
  shadow: Appstyle.shadowExtraBold()
});

export default (props: JSX.IntrinsicAttributes & DrinkCardProps) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          bookCtx &&
          ctx && (
            <DrinkCard
              alreadySubscribed={ctx.alreadySubscribed}
              addToBasket={bookCtx.addToBasket}
              setWaitingProduct={bookCtx.setWaitingProduct}
              placeChoice={bookCtx.placeChoice}
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
