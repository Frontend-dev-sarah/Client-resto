import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ImageBackground, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import I18n from 'resources/localization/I18n';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { screenWidth } from 'src/utils/constants';
import { Product } from 'models/products';
import { TouchableRipple } from 'react-native-paper';
import { UserData } from 'src/models/user';
import AppImages from 'src/resources/common/AppImages';
import { AuthConsumer } from 'src/store/AuthContext';
import RoutesNames from 'src/navigation/RoutesNames';

const ITEM_WIDTH = screenWidth / 2 - 33;

type ProductCardPreviewProps = {
  item: Product;
  user?: UserData;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  alreadySubscribed?: boolean;
};

function ProductCardPreview({
  item,
  user,
  navigation,
  alreadySubscribed
}: ProductCardPreviewProps) {
  const [hasRecommandation, setHasRecommandation] = useState<boolean>(false);
  const [hasAllergie, setHasAllergie] = useState<boolean>(false);
  const [priceWidth, setPriceWidth] = useState<number>();

  // to adapt layout to screenwidth
  const iconContainerWidth =
    priceWidth &&
    (ITEM_WIDTH - priceWidth) /
    (item.thematics && item.thematics.length + (hasRecommandation || hasAllergie ? 1 : 0));

  //function to know if we have to adapt icon size, if screen width is too small
  function changeIconSize() {
    if (
      priceWidth &&
      priceWidth +
      (item.thematics && item.thematics.length + (hasRecommandation || hasAllergie ? 1 : 0)) *
      32 >
      ITEM_WIDTH
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    getRecommandation();
    getAllergies();
  }, [user]);

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
    <TouchableRipple
      onPress={() => {
        navigation.navigate(RoutesNames.ProductDetailsPage, {
          product: item
        });
      }}
      style={styles.mainContainer}
    >
      <>
        <ImageBackground
          style={[styles.container, styles.shadow]}
          source={
            item.images && item.images[0] && { uri: item.images[0].image }
          }
          imageStyle={styles.image}
        >
          <View
            style={[
              styles.subContainer,
              item.is_sucessful && {
                backgroundColor: colors.black60
              }
            ]}
          >
            {item.is_sucessful && (
              <View style={styles.succesfulItemInformations}>
                <Image source={AppImages.images.utensils} />
                <Text style={styles.noData}>{I18n.t('menu.successful')}</Text>
              </View>
            )}
            <View style={styles.itemInformations}>
              <View
                style={[styles.iconView, styles.priceView]}
                onLayout={event => {
                  const { width } = event.nativeEvent.layout;
                  setPriceWidth(width);
                }}
              >
                <Text style={styles.text}>{`${parseFloat(
                  alreadySubscribed ? item.reduced_price : item.price
                ).toFixed(2)} €`}</Text>
              </View>

              {hasRecommandation && !hasAllergie && (
                <View
                  style={[
                    styles.iconView,
                    ,
                    changeIconSize()
                      ? {
                        width: iconContainerWidth
                      }
                      : styles.paddingH
                  ]}
                >
                  <Image
                    source={AppImages.images.heart}
                    style={
                      changeIconSize() && {
                        width: iconContainerWidth && iconContainerWidth / 2,
                        height: iconContainerWidth && iconContainerWidth / 2
                      }
                    }
                  />
                </View>
              )}
              {hasAllergie && (
                <View
                  style={[
                    styles.iconView,
                    styles.allergieView,
                    changeIconSize()
                      ? {
                        width: iconContainerWidth
                      }
                      : styles.paddingH
                  ]}
                >
                  <Image
                    source={AppImages.images.warning}
                    style={[
                      styles.icon,
                      changeIconSize() && {
                        width: iconContainerWidth && iconContainerWidth / 2,
                        height: iconContainerWidth && iconContainerWidth / 2
                      }
                    ]}
                  />
                </View>
              )}

              {item.thematics && item.thematics.map(them => (
                <View
                  style={[
                    styles.iconView,
                    styles.thematicView,
                    changeIconSize()
                      ? {
                        width: iconContainerWidth
                      }
                      : styles.paddingH
                  ]}
                >
                  <Image
                    source={{ uri: them.icon }}
                    style={[
                      styles.icon,
                      changeIconSize() && {
                        width: iconContainerWidth && iconContainerWidth / 2,
                        height: iconContainerWidth && iconContainerWidth / 2
                      }
                    ]}
                  />
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
        <Text style={styles.name}>{item.name}</Text>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  allergieView: {
    backgroundColor: colors.deepRose51
  },
  container: {
    backgroundColor: colors.lightBlack,
    borderRadius: 8,
    flex: 1,
    height: 100,
    justifyContent: 'flex-end',
    marginRight: 16,
    marginTop: 20,
    width: ITEM_WIDTH
  },
  icon: {
    height: 16,
    width: 16
  },
  iconView: {
    alignItems: 'center',
    backgroundColor: colors.black30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 24,
    justifyContent: 'center'
  },
  image: {
    borderRadius: 8
  },
  itemInformations: {
    bottom: 0,
    flexDirection: 'row',
    maxWidth: ITEM_WIDTH,
    position: 'absolute'
  },
  mainContainer: { marginRight: 16, width: ITEM_WIDTH },
  name: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 12
  },
  noData: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center'
  },
  paddingH: { paddingHorizontal: 8 },
  priceView: {
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
    paddingHorizontal: 16
  },
  shadow: Appstyle.shadowExtraBold(colors.black),
  subContainer: { flex: 1, justifyContent: 'flex-end' },
  succesfulItemInformations: {
    alignItems: 'center',
    flex: 1,
    marginTop: '10%',
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

export default (props: JSX.IntrinsicAttributes & ProductCardPreviewProps) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <ProductCardPreview
          user={ctx.user}
          alreadySubscribed={ctx.alreadySubscribed}
          {...props}
        />
      )
    }
  </AuthConsumer>
);
