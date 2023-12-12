import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import I18n from 'resources/localization/I18n';
import colors from 'src/resources/common/colors';
import { District, Restaurants } from 'src/models/restaurants';
import { DistrictConsumer } from 'src/store/DistrictContext';
import AppImages from 'src/resources/common/AppImages';
import ProductCardPreview from '../Products/ProductCardPreview';
import TouchableText from '../Buttons/TouchableText';
import RoutesNames from 'src/navigation/RoutesNames';
import { BookingConsumer } from 'src/store/BookingContext';

type CardSuggestionsProps = {
  restaurants?: Restaurants;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  userIsEating?: boolean;
  selectedDistrict?: District;
  isLoading?: boolean;
};

function CardSuggestions({
  restaurants,
  navigation,
  userIsEating,
  selectedDistrict,
  isLoading
}: CardSuggestionsProps) {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.title}>{I18n.t('home.suggest')}</Text>
        {selectedDistrict &&
        selectedDistrict.catalogs &&
        selectedDistrict.catalogs.length ? (
          <TouchableText
            textStyle={styles.seecard}
            text={I18n.t('home.seeCard')}
            iconRight
            icon={AppImages.images.longRightArrow}
            iconStyle={styles.arrow}
            containerStyle={styles.seecard}
            onPress={() => {
              if (userIsEating) {
                navigation.navigate(RoutesNames.OrderOnSiteSummaryPage);
              } else {
                navigation.navigate(RoutesNames.CardPage, {
                  simpleCard: true
                });
              }
            }}
          />
        ) : null}
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        numColumns={2}
        data={
          restaurants &&
          restaurants.suggestions &&
          restaurants.suggestions.slice(0, 4)
        }
        renderItem={({ item }) => (
          <ProductCardPreview navigation={navigation} item={item} />
        )}
        ListEmptyComponent={() =>
          !isLoading ? (
            <Text style={styles.empty}>{I18n.t('home.noSuggest')}</Text>
          ) : (
            <ActivityIndicator color={colors.white} />
          )
        }
        contentContainerStyle={styles.flatlist}
      />
    </>
  );
}

const styles = StyleSheet.create({
  arrow: {
    height: 12,
    marginLeft: 8,
    width: 12
  },
  empty: {
    color: colors.white70,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 15,
    textAlign: 'center'
  },
  flatlist: { paddingHorizontal: 25 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 25
  },
  seecard: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginLeft: 'auto'
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24
  }
});

export default (props: JSX.IntrinsicAttributes & CardSuggestionsProps) => (
  <DistrictConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          ctx &&
          bookCtx && (
            <CardSuggestions
              {...props}
              userIsEating={bookCtx.userIsEating}
              restaurants={ctx.restaurants}
              selectedDistrict={ctx.selectedDistrict}
              isLoading={ctx.isLoading}
            />
          )
        }
      </BookingConsumer>
    )}
  </DistrictConsumer>
);
