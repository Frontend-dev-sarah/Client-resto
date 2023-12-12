import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationParams,
  NavigationState
} from 'react-navigation';
import BorderedRadiusButton from 'src/components/Buttons/BorderedRadiusButton';
import { BookingConsumer } from 'src/store/BookingContext';
import {
  Restaurant,
  Restaurants,
  District,
  PlaceChoice
} from 'src/models/restaurants';
import RoutesNames from 'src/navigation/RoutesNames';
import I18n from 'resources/localization/I18n';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import Appstyle from 'src/resources/common/Appstyle';
import AppImages from 'src/resources/common/AppImages';
import DropDownPosition from 'src/components/Headers/DropDownPosition';
import { DistrictConsumer } from 'src/store/DistrictContext';
import RestaurantItem from 'src/components/Restaurants/RestaurantItem';
import SkeletonRestaurantLoader from 'src/components/SkeletonLoader/SkeletonRestaurantLoader';
import { StackActions } from '@react-navigation/native';

type ChooseRestaurantPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  selectedRestaurant?: Restaurant;
  setSelectedRestaurant: Function;
  districts: District[];
  restaurants: Restaurants;
  dataLoading: boolean;
  refresh: Function;
  placeChoice: PlaceChoice;
  setFiltered: Function;
};

function ChooseRestaurantPage({
  navigation,
  selectedRestaurant,
  restaurants,
  dataLoading,
  refresh,
  setSelectedRestaurant,
  placeChoice,
  setFiltered
}: ChooseRestaurantPageProps) {
  const [listenPlaceChoise, setListenPlaceChoice] = useState(
    placeChoice && placeChoice === 'bookOnSite'
  );

  useEffect(() => {
    setSelectedRestaurant();
    setFiltered(true);
  }, []);

  useEffect(() => {
    // Force user to choose date + hour when choose oderOnSite first and then change to takeAway
    if (placeChoice === 'takeAway' && listenPlaceChoise) {
      navigation.dispatch(StackActions.replace(RoutesNames.ChooseDatePage));
      setListenPlaceChoice(false);
    }
    if (placeChoice === 'bookOnSite') {
      setListenPlaceChoice(true);
    }
  }, [placeChoice]);

  async function openBookTableModal() {
    await navigation.navigate(RoutesNames.RestaurantsStack);
    navigation.navigate(RoutesNames.RestaurantsStack, {
      screen: RoutesNames.RestaurantDetailsPage,
      params: { restaurant: selectedRestaurant, openBookingModal: true }
    });
  }

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.title}>{I18n.t('booking.restaurantChoice')}</Text>
      </View>
      <FlatList
        data={restaurants && restaurants.restaurants}
        renderItem={({ item }) => (
          <RestaurantItem
            item={item}
            key={item.id}
            onPress={() =>
              !dataLoading &&
              setSelectedRestaurant(
                selectedRestaurant && selectedRestaurant.id === item.id
                  ? null
                  : item
              )
            }
            selected={selectedRestaurant && selectedRestaurant.id === item.id}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={dataLoading}
            onRefresh={() => refresh()}
            colors={[colors.paleOrange]}
            tintColor={colors.paleOrange}
          />
        }
        ListEmptyComponent={
          dataLoading ? (
            <SkeletonRestaurantLoader />
          ) : (
            <Text style={styles.noData}>
              {I18n.t('restaurants.noDataFilters')}
            </Text>
          )
        }
        style={styles.containerList}
        contentContainerStyle={styles.paddingBottom}
        keyExtractor={item => item.id.toString()}
      />
      <DropDownPosition customStyle={styles.dropDown} />
      <View style={[styles.bottomView]}>
        {placeChoice !== 'bookOnSite' && (
          <BorderedRadiusButton
            onPress={() => {
              navigation.goBack();
              // placeChoice==='takeAway' && navigation.goBack()
            }}
            borderTopRight
            customStyle={[styles.backButton, styles.shadow]}
            icon={AppImages.images.backIcon}
            bottom
          />
        )}
        <BorderedRadiusButton
          primary
          inactive={!selectedRestaurant}
          onPress={async () => {
            if (!dataLoading) {
              if (placeChoice === 'bookOnSite') {
                openBookTableModal();
              } else {
                await navigation.navigate(RoutesNames.RestaurantsStack);
                navigation.navigate(RoutesNames.RestaurantsStack, {
                  screen: RoutesNames.CardPage,
                  params: { simpleCard: false }
                });
              }
            }
          }}
          text={I18n.t('app.next')}
          borderTopLeft
          customStyle={[styles.bottomButton, styles.shadow]}
          bottom
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    width: '30%',
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 74 + getBottomSpace() },
      {}
    ),
    flex: 0.5
  },
  bottomButton: {
    alignSelf: 'flex-end',
    flex: 1,
    width: '75%',
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 74 + getBottomSpace() },
      {}
    )
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 'auto'
  },
  containerList: {
    height: '100%',
    paddingTop: 15
  },

  dropDown: { marginTop: 30, paddingRight: 25 },
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
  },
  paddingBottom: { paddingBottom: 50 },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingTop: 32
  },
  shadow: Appstyle.shadowExtraBold(),
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  }
});

export default (props: JSX.IntrinsicAttributes & ChooseRestaurantPageProps) => (
  <DistrictConsumer>
    {districtCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          districtCtx && (
            <ChooseRestaurantPage
              placeChoice={ctx.placeChoice}
              selectedRestaurant={ctx.selectedRestaurant}
              setSelectedRestaurant={ctx.setSelectedRestaurant}
              districts={districtCtx.districts}
              restaurants={districtCtx.restaurants}
              dataLoading={districtCtx.isLoading}
              refresh={districtCtx.getRestaurants}
              setFiltered={districtCtx.setFiltered}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </DistrictConsumer>
);
