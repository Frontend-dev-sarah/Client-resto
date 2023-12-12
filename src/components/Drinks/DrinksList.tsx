import React from 'react';
import { StyleSheet, FlatList, Text, ViewStyle } from 'react-native';

import DrinkCard from 'src/components/Drinks/DrinkCard';
import { Product } from 'src/models/products';
import I18n from 'resources/localization/I18n';
import colors from 'src/resources/common/colors';

type DrinksListProps = {
  data?: Product[];
  onScroll: () => void;
  onPressProduct: Function;
  customStyle?: ViewStyle;
};

export default function DrinksList({
  data,
  onScroll,
  onPressProduct,
  customStyle
}: DrinksListProps) {
  return (
    <FlatList
      numColumns={2}
      data={data}
      renderItem={({ item }) => (
        <DrinkCard item={item} onPress={onPressProduct} />
      )}
      contentContainerStyle={[styles.listContainer, customStyle]}
      onScroll={onScroll}
      ListEmptyComponent={() => (
        <Text style={styles.noData}>{I18n.t('menu.productNoData')}</Text>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { marginLeft: 25, paddingBottom: 120, paddingTop: 24 },
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
