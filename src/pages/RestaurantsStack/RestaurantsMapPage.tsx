import React, { useState, Fragment, useRef, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import Carousel from 'react-native-snap-carousel';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import I18n from 'resources/localization/I18n';

import Appstyle from 'resources/common/Appstyle';
import AppImages from 'resources/common/AppImages';
import RestaurantItem from 'components/Restaurants/RestaurantItem';
import { Restaurant, LocationType, Restaurants } from 'models/restaurants';
import TouchableIcon from 'components/Buttons/TouchableIcon';
import colors from 'src/resources/common/colors';
import { screenWidth } from 'src/utils/constants';
import RoutesNames from 'src/navigation/RoutesNames';
import { DistrictConsumer } from 'src/store/DistrictContext';
import restaurantApi from 'src/services/restaurant/restaurantApi';

type RestaurantsMapPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  location: LocationType;
};

function RestaurantsMapPage({ navigation, location }: RestaurantsMapPageProps) {
  const mapRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [restaurantSelected, setRestaurarntSelected] = useState<Restaurant>();
  const [items, setItems] = useState<Restaurant[]>();

  function getFirstRestaurant() {
    if (items && items.length > 0) {
      selectRestaurant(items[0], true);
      setCarouselIndex(0);
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    const res = await restaurantApi.getAllRestaurants();
    if (res && !res.error) {
      setItems(res);
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('restaurants.loadingFail'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
  }

  const MAP_PADDING = {
    top: 32,
    right: 32,
    bottom: 154,
    left: 32
  };

  const selectRestaurant = (item: Restaurant, first?: boolean): void => {
    setRestaurarntSelected(item);
    mapRef && mapRef.current && first
      ? mapRef.current.animateCamera(
          {
            center: {
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lng)
            },
            pitch: 15,
            zoom: 15
          },
          0.5
        )
      : mapRef.current.setCamera({
          center: {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lng)
          },
          pitch: 15,
          zoom: 15
        });
  };

  const onMarkerPress = (items: Restaurant[], id: number): void => {
    items.map((item, index) => {
      if (item.id === id) {
        selectRestaurant(item);
        setCarouselIndex(index);
      }
    });
  };

  const onBeforeSnapItem = (event: number): void => {
    const direction = carouselIndex > event ? 'left' : 'right';
    if (restaurantSelected) {
      items &&
        items.map((item, index) => {
          if (
            (direction === 'right' && index === carouselIndex + 1) ||
            (direction === 'left' && index === carouselIndex - 1)
          ) {
            selectRestaurant(item);
            setCarouselIndex(index);
          }
        });
    }
  };

  const localizeUser = (): void => {
    mapRef &&
      mapRef.current &&
      location &&
      mapRef.current.animateCamera(
        {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          pitch: 15,
          zoom: 15
        },
        0.5
      );
  };

  const markers =
    items &&
    items.map(item => {
      return {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lng)
      };
    });

  const renderRestaurantItem = ({
    item,
    index
  }: {
    item: Restaurant;
    index: number;
  }): JSX.Element => {
    return (
      <View key={item.id} style={styles.restaurantItemWrapper}>
        <RestaurantItem
          item={item}
          key={index}
          map
          onPress={() =>
            navigation.navigate(RoutesNames.RestaurantDetailsPage, {
              restaurant: restaurantSelected
            })
          }
        />
      </View>
    );
  };

  return (
    <>
      {markers && (
        <>
          <MapView
            style={styles.map}
            customMapStyle={Appstyle.mapStyle}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            minZoomLevel={5}
            maxZoomLevel={20}
            onLayout={getFirstRestaurant}
            showsMyLocationButton={false}
            showsUserLocation={true}
            mapPadding={MAP_PADDING}
          >
            {items &&
              Object.values(items).map(
                (item): JSX.Element => (
                  <Fragment key={item.id}>
                    <Marker
                      coordinate={{
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.lng)
                      }}
                      icon={
                        restaurantSelected && item.id === restaurantSelected.id
                          ? AppImages.images.pinSelected
                          : AppImages.images.pinUnselected
                      }
                      key={item.id}
                      onPress={(): void => onMarkerPress(items, item.id)}
                    />
                  </Fragment>
                )
              )}
          </MapView>
          <TouchableIcon
            height={20}
            width={20}
            icon={AppImages.images.closeMap}
            onPress={() => {
              navigation.navigate(RoutesNames.RestaurantsPage);
            }}
            style={styles.closeIcon}
          />
          <TouchableIcon
            height={20}
            width={20}
            icon={AppImages.images.locationArrow}
            onPress={localizeUser}
            style={[
              styles.geolocItem,
              !restaurantSelected && styles.geolocItemWithoutCarousel
            ]}
          />
          {restaurantSelected && (
            <View style={[styles.carouselWrapper, styles.shadow]}>
              <Carousel
                data={items}
                renderItem={renderRestaurantItem}
                sliderWidth={screenWidth}
                inactiveSlideScale={1}
                itemWidth={screenWidth - 62}
                useScrollView
                firstItem={
                  items &&
                  items.findIndex(item => item.id === restaurantSelected.id)
                }
                onBeforeSnapToItem={(e: number) => {
                  onBeforeSnapItem(e);
                }}
                inactiveSlideOpacity={1}
              />
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    bottom: 0,
    paddingBottom: 24,
    position: 'absolute'
  },
  closeIcon: {
    position: 'absolute',
    right: 4,
    top: Constants.statusBarHeight
  },
  geolocItem: {
    backgroundColor: colors.white40,
    borderRadius: 28,
    bottom: 196,
    height: 56,
    position: 'absolute',
    right: 20,
    width: 56
  },
  geolocItemWithoutCarousel: {
    bottom: 24
  },
  map: {
    height: '100%',
    width: '100%'
  },
  restaurantItemWrapper: {
    paddingHorizontal: 6
  },
  shadow: Appstyle.shadowExtraBold(colors.black)
});

export default (props: JSX.IntrinsicAttributes & RestaurantsMapPageProps) => (
  <DistrictConsumer>
    {districtCtx =>
      districtCtx && (
        <RestaurantsMapPage location={districtCtx.location} {...props} />
      )
    }
  </DistrictConsumer>
);
