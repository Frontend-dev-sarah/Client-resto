import I18n from 'resources/localization/I18n';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Constants from 'expo-constants';

import { Restaurant } from 'src/models/restaurants';
import { ImageType } from 'src/models/images';
import colors from 'src/resources/common/colors';
import BorderedRadiusButton from 'src/components/Buttons/BorderedRadiusButton';
import { screenWidth, screenHeight } from 'src/utils/constants';
import { TextMask } from 'react-native-masked-text';
import { TouchableRipple } from 'react-native-paper';
import Notation from '../Products/Notation';
import RestaurantHours from './RestaurantHours';

type RestaurantInfosItemProps = {
  restaurant: Restaurant;
  onPressOrder: Function;
};

export default function RestaurantInfosItem({
  restaurant,
  onPressOrder
}: RestaurantInfosItemProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  async function phoneCall(phoneNb: string) {
    Linking.openURL('tel:' + phoneNb);
  }

  async function openMap(fullAddress: string) {
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`
    });
    url && Linking.openURL(url);
  }

  function renderPagination() {
    if (restaurant && restaurant.images && restaurant.images.length > 1) {
      return (
        <Pagination
          dotsLength={restaurant.images.length}
          activeDotIndex={currentIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={1}
        />
      );
    } else {
      return <View style={styles.paginationContainer} />;
    }
  }
  return (
    <View>
      <Carousel
        data={
          restaurant.images && restaurant.images.length
            ? restaurant.images
            : ['']
        }
        renderItem={(item: { item: ImageType }) => (
          <ImageBackground
            style={[styles.carousel]}
            source={{
              uri: item.item.image
            }}
            imageStyle={[styles.image]}
          />
        )}
        useScrollView={false}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={(index: number) => setCurrentIndex(index)}
      />

      <LinearGradient
        pointerEvents={'none'}
        colors={[colors.black, colors.transparent]}
        style={styles.shadowView}
      >
        <View style={styles.row}>{renderPagination()}</View>
      </LinearGradient>
      <View
        pointerEvents={'box-none'}
        style={[styles.paddingView, styles.shadowView]}
      >
        <Text style={styles.name}>{restaurant.name}</Text>
        <RestaurantHours restaurant={restaurant} />
        <TouchableRipple onPress={() => openMap(restaurant.readable)}>
          <>
            <Text style={styles.time}>{restaurant.readable}</Text>
            {restaurant.distance && parseInt(restaurant.distance) <= 5000 && (
              <View style={styles.distContainer}>
                <Text style={styles.distText}>
                  {parseInt(restaurant.distance) >= 1000
                    ? `${parseInt(restaurant.distance) / 1000}km`
                    : `${restaurant.distance}m`}
                </Text>
              </View>
            )}
          </>
        </TouchableRipple>
        {restaurant.phone_number && (
          <TouchableRipple
            style={styles.phoneNb}
            onPress={() => phoneCall(restaurant.phone_number)}
          >
            <TextMask
              type="custom"
              options={{ mask: '99 99 99 99 99' }}
              style={styles.time}
              value={restaurant.phone_number}
            />
          </TouchableRipple>
        )}
        {restaurant.average && <Notation notation={restaurant.average} />}
      </View>
      <BorderedRadiusButton
        text={I18n.t('restaurants.bookeTable')}
        onPress={() => {
          onPressOrder();
        }}
        borderTopLeft
        customStyle={styles.bookButton}
        primary
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 4,
    width: 12
  },
  bookButton: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    width: screenWidth - 90
  },
  carousel: {
    height: screenHeight * 0.8
  },
  distContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginBottom: 26,
    marginRight: 'auto',
    marginTop: 13,
    opacity: 0.9,
    padding: 6
  },
  distText: {
    color: colors.paleOrange,
    fontFamily: 'GothamBold',
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 14
  },
  image: {
    borderBottomLeftRadius: 32
  },
  inactiveDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  name: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginTop: 70 + Constants.statusBarHeight
  },
  paddingView: {
    paddingHorizontal: 45
  },
  paginationContainer: { width: 90 },
  phoneNb: {
    paddingVertical: 8
  },
  row: {
    flexDirection: 'row',
    marginTop: 'auto'
  },
  shadowView: {
    height: screenHeight * 0.8,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  time: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 7
  }
});
