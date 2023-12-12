import I18n from 'resources/localization/I18n';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { Restaurants } from 'src/models/restaurants';
import RestaurantItem from 'src/components/Restaurants/RestaurantItem';
import DropDownHeader from 'src/components/Headers/DropDownHeader';
import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import RoutesNames from 'src/navigation/RoutesNames';
import { DistrictConsumer } from 'src/store/DistrictContext';
import SkeletonRestaurantLoader from 'src/components/SkeletonLoader/SkeletonRestaurantLoader';

type RestaurantsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  getRestaurants: Function;
  restaurants: Restaurants;
  dataLoading: boolean;
  setFiltered: Function;
};

function RestaurantsPage({
  navigation,
  getRestaurants,
  restaurants,
  dataLoading,
  setFiltered
}: RestaurantsPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function refresh() {
    setIsLoading(true);
    await getRestaurants();
    setIsLoading(false);
  }

  useEffect(() => {
    setFiltered(false);
  }, []);

  useEffect(() => {
    if (restaurants) {
      setIsLoading(false);
    }
  }, [restaurants]);

  function navigateOnMap(): void {
    navigation.navigate(RoutesNames.RestaurantsMapPage, {
      items: restaurants && restaurants.restaurants
    });
  }

  return (
    <>
      <DropDownHeader
        title={I18n.t('restaurants.restaurants')}
        onPress={navigateOnMap}
      />
      <View style={styles.container}>
        <FlatList
          data={restaurants && restaurants.restaurants}
          renderItem={({ item, index }) => (
            <RestaurantItem
              item={item}
              key={item.id}
              last={
                restaurants &&
                restaurants.restaurants &&
                restaurants.restaurants.length - 1 === index
                  ? true
                  : false
              }
              onPress={() =>
                navigation.navigate(RoutesNames.RestaurantDetailsPage, {
                  restaurant: item
                })
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || dataLoading}
              onRefresh={refresh}
              colors={[colors.darkGrey]}
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <SkeletonRestaurantLoader />
            ) : (
              <Text style={styles.noData}>{I18n.t('restaurants.noData')}</Text>
            )
          }
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 180
  },
  noData: {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginHorizontal: 50,
    marginTop: 50,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & RestaurantsPageProps) => (
  <DistrictConsumer>
    {districtCtx =>
      districtCtx && (
        <RestaurantsPage
          getRestaurants={districtCtx.getRestaurants}
          restaurants={districtCtx.restaurants}
          dataLoading={districtCtx.isLoading}
          setFiltered={districtCtx.setFiltered}
          {...props}
        />
      )
    }
  </DistrictConsumer>
);
