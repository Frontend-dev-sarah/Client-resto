import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ImageBackground, View } from 'react-native';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { screenWidth } from 'src/utils/constants';
import { Product } from 'models/products';
import I18n from 'resources/localization/I18n';
import { TouchableRipple } from 'react-native-paper';
import { UserData } from 'src/models/user';
import AppImages from 'src/resources/common/AppImages';
import { AuthConsumer } from 'src/store/AuthContext';
import { BookingConsumer } from 'src/store/BookingContext';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';
import { PlaceChoice, Restaurant } from 'src/models/restaurants';
import AnimatedBasketIcon from '../Animated/AnimatedBasketIcon';
import { isRestaurantOpened } from 'src/utils/TimeHelper';

type ProductCardProps = {
  item: Product;
  user?: UserData;
  onPress?: () => void;
  addToBasket?: Function;
  alreadySubscribed?: boolean;
  placeChoice?: PlaceChoice;
  setWaitingProduct?: Function;
  hasBasket?: boolean;
  setReturnToBasketVisible?: Function;
  selectedRestaurant?: Restaurant;
  simpleCard?: boolean;
};

function ProductCard({
  item,
  user,
  onPress,
  addToBasket,
  alreadySubscribed,
  placeChoice,
  setWaitingProduct,
  hasBasket,
  setReturnToBasketVisible,
  selectedRestaurant,
  simpleCard
}: ProductCardProps) {
  const [hasRecommandation, setHasRecommandation] = useState<boolean>(false);
  const [hasAllergie, setHasAllergie] = useState<boolean>(false);
  const [addingIsLoading, setAddingIsLoading] = useState<boolean>(false);
  const [emptyStock, setEmptyStock] = useState<boolean>(false);
  useEffect(() => {
    getRecommandation();
    getAllergies();
  }, [user]);

  useEffect(() => {
    if (!simpleCard) {
      const index =
        selectedRestaurant &&
        item.stock.findIndex(s => s.restaurant_id === selectedRestaurant.id);
      if (
        item &&
        item.stock[index] &&
        item.stock[index].provisional_stock <= 0
      ) {
        setEmptyStock(true);
      }
    }
  }, [item && item.stock, selectedRestaurant]);

  function getRecommandation(): void {
    let recommandation = false;
    user &&
      user.meal_tags &&
      user.meal_tags.map(userTag => {
        if (
          item.meal_tags &&
          item.meal_tags.find(mealTag => userTag.name === mealTag.name)
        ) {
          recommandation = true;
        }
      });
    if (recommandation !== hasRecommandation) {
      setHasRecommandation(recommandation);
    }
  }

  function getAllergies(): void {
    let allergie = false;
    user &&
      user.meal_allergies &&
      user.meal_allergies.map(userAllergie => {
        if (
          item.meal_allergies &&
          item.meal_allergies.find(
            mealAllergie => userAllergie.name === mealAllergie.name
          )
        ) {
          allergie = true;
        }
      });
    if (allergie !== hasAllergie) {
      setHasAllergie(allergie);
    }
  }
  return (
    <TouchableRipple style={styles.shadow} onPress={onPress}>
      <ImageBackground
        style={[
          styles.container,
          styles.shadow,
          (item.is_sucessful || emptyStock) && styles.succesfulCard
        ]}
        source={item.images && item.images[0] && { uri: item.images[0].image }}
        imageStyle={styles.image}
      >
        <>
          {!(item.is_sucessful || emptyStock) &&
            (!placeChoice ||
              placeChoice === 'takeAway' ||
              isRestaurantOpened({ restaurant: selectedRestaurant })) && (
              <TouchableRipple
                disabled={addingIsLoading}
                style={[styles.basketContainer]}
                onPress={async () => {
                  if (hasBasket && !placeChoice) {
                    setReturnToBasketVisible && setReturnToBasketVisible(true);
                  } else if (placeChoice) {
                    setAddingIsLoading(true);
                    addToBasket && (await addToBasket(item));
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
            )}

          <Text
            style={[
              styles.text,
              styles.name,
              (item.is_sucessful || emptyStock) && styles.margintop
            ]}
          >
            {item.name}
          </Text>
          {(item.is_sucessful || emptyStock) && (
            <View style={styles.succesfulItemInformations}>
              <Image source={AppImages.images.utensils} />
              <Text style={styles.noData}>{I18n.t('menu.successful')}</Text>
            </View>
          )}
          <View style={styles.itemInformations}>
            <View style={[styles.iconView, styles.priceView]}>
              <Text style={styles.text}>{`${parseFloat(
                alreadySubscribed ? item.reduced_price : item.price
              ).toFixed(2)} €`}</Text>
            </View>
            {hasRecommandation && !hasAllergie && (
              <View style={styles.iconView}>
                <Image source={AppImages.images.heart} />
              </View>
            )}
            {hasAllergie && (
              <View style={[styles.iconView, styles.allergieView]}>
                <Image
                  source={AppImages.images.warning}
                  width={13}
                  height={16}
                />
              </View>
            )}

            {item &&
              item.thematics &&
              item.thematics.map(them => (
                <View style={[styles.iconView, styles.thematicView]}>
                  <Image source={{ uri: them.icon }} style={styles.icon} />
                </View>
              ))}
          </View>
        </>
      </ImageBackground>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  allergieView: {
    backgroundColor: colors.deepRose51
  },
  basketContainer: {
    backgroundColor: colors.deepRose,
    borderRadius: 18,
    padding: 8,
    position: 'absolute',
    right: 12,
    top: 12,
    width: 36,
    zIndex: 1
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.lightBlack,
    borderRadius: 6,
    flex: 1,
    height: 112,
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginTop: 24,
    paddingTop: 16,
    width: screenWidth - 50
  },
  icon: {
    height: 16,
    width: 16
  },
  iconView: {
    backgroundColor: colors.black30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  image: {
    borderRadius: 6,
    opacity: 0.8
  },
  itemInformations: {
    flexDirection: 'row'
  },
  margintop: { marginTop: 12 },
  name: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingRight: 50
  },
  noData: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  },
  priceView: {
    backgroundColor: colors.black30,
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
    paddingLeft: 16,
    width: 82
  },
  shadow: Appstyle.shadowExtraBold(colors.black),
  succesfulCard: {
    backgroundColor: colors.black30,
    paddingTop: 0
  },
  succesfulItemInformations: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  text: {
    color: colors.white80,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0.25,
    lineHeight: 14
  },
  thematicView: { backgroundColor: colors.greenishGrey }
});

export default (props: JSX.IntrinsicAttributes & ProductCardProps) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          bookCtx &&
          ctx && (
            <ProductCard
              user={ctx.user}
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
