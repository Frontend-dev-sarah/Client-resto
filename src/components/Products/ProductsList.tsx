import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View } from 'react-native';

import ProductCard from 'components/Products/ProductCard';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import { Product, Basket } from 'src/models/products';
import DrinksList from '../Drinks/DrinksList';
import TagsItem from '../Menu/TagsItem';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import RoutesNames from 'src/navigation/RoutesNames';
import { DistrictConsumer } from 'src/store/DistrictContext';
import { District } from 'src/models/restaurants';
import { BookingConsumer } from 'src/store/BookingContext';

type ProductsListProps = {
  category: string;
  onScroll: () => void;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  selectedDistrict?: District;
  basket?: Basket;
  simpleCard?: boolean;
};

function ProductsList({
  basket,
  category,
  onScroll,
  navigation,
  selectedDistrict,
  simpleCard
}: ProductsListProps) {
  const [starters, setStarters] = useState<Product[]>();
  const [mainCourses, setMainCourses] = useState<Product[]>();
  const [desserts, setDesserts] = useState<Product[]>();
  const [drinks, setDrinks] = useState<Product[]>();
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [selectedThematicsDrinks, setSelectedThematicsDrinks] = useState<
    string[]
  >([]);

  useEffect(() => {
    sortProductsByType();
  }, [selectedDistrict]);

  useEffect(() => {
    sortProductsByTheme();
  }, [selectedThematics, selectedThematicsDrinks]);

  function sortProductsByType() {
    let starters: Product[] = [];
    let mainCourses: Product[] = [];
    let desserts: Product[] = [];
    let drinks: Product[] = [];
    selectedDistrict &&
      selectedDistrict.catalogs &&
      selectedDistrict.catalogs[0] &&
      selectedDistrict.catalogs[0].menus &&
      selectedDistrict.catalogs[0].menus.map(menu => {
        starters = starters.concat(menu.entrée.filter(item => item !== null));
        mainCourses = mainCourses.concat(
          menu.plats.filter(item => item !== null)
        );
        desserts = desserts.concat(menu.dessert.filter(item => item !== null));
      });

    selectedDistrict &&
      selectedDistrict.catalogs &&
      selectedDistrict.catalogs[0] &&
      selectedDistrict.catalogs[0].menu_drinks &&
      selectedDistrict.catalogs[0].menu_drinks.map(menu => {
        drinks = drinks.concat(menu.drinks.filter(item => item !== null));
      });

    setStarters(starters);
    setMainCourses(mainCourses);
    setDesserts(desserts);
    setDrinks(drinks);
  }

  function sortProductsByTheme() {
    const tempProducts: Product[] = [];
    if (
      selectedDistrict &&
      selectedDistrict.catalogs &&
      selectedDistrict.catalogs[0] &&
      selectedDistrict.catalogs[0].menus
    ) {
      if (
        selectedThematics &&
        selectedThematics.length > 0 &&
        category === I18n.t('menu.mainCourses')
      ) {
        selectedDistrict.catalogs[0].menus.map(menu => {
          // on parcourt la liste des plats
          // on parcourt la liste des thematics de chaque plat
          // on vérifie pour chaque plat si une de ses thematics est dans les thematics sélectionnées
          // si le plat n'est pas déjà dans tempProducts => on l'ajoute (push)
          menu.plats &&
            menu.plats
              .filter(item => item !== null)
              .map(plat => {
                plat.thematics &&
                  plat.thematics.map(them => {
                    if (
                      selectedThematics.indexOf(them.name) !== -1 &&
                      tempProducts.indexOf(plat) === -1
                    ) {
                      tempProducts.push(plat);
                    }
                  });
              });
        });
        setMainCourses(tempProducts);
      } else if (
        selectedThematicsDrinks &&
        selectedThematicsDrinks.length > 0 &&
        category === I18n.t('menu.drinks')
      ) {
        selectedDistrict.catalogs[0].menu_drinks.map(menu => {
          menu.drinks &&
            menu.drinks
              .filter(item => item !== null)
              .map(drink => {
                drink.thematics.map(them => {
                  if (
                    selectedThematicsDrinks.indexOf(them.name) !== -1 &&
                    tempProducts.indexOf(drink) === -1
                  ) {
                    tempProducts.push(drink);
                  }
                });
              });
        });
        setDrinks(tempProducts);
      } else {
        sortProductsByType();
      }
    }
  }

  function renderList() {
    switch (category) {
      case I18n.t('menu.starter'):
        return renderListItem(starters);
      case I18n.t('menu.mainCourses'):
        return renderListItem(mainCourses);
      case I18n.t('menu.desserts'):
        return renderListItem(desserts);
      case I18n.t('menu.drinks'):
        return (
          <DrinksList
            onScroll={onScroll}
            data={drinks}
            onPressProduct={onPressProduct}
            customStyle={basket && basket.length > 0 && styles.bigPadding}
          />
        );
      default:
        return renderListItem(starters);
    }
  }

  function onPressThematic(thematic: string): void {
    setSelectedThematics([thematic]);
    // uncomment to enable many thematics filters
    // selectedThematics.find(selectedThematic => selectedThematic === thematic)
    //   ? setSelectedThematics(
    //       selectedThematics.filter(selectedThematics => {
    //         return selectedThematics !== thematic;
    //       })
    //     )
    //   : setSelectedThematics(selectedThematics => [
    //       ...selectedThematics,
    //       thematic
    //     ]);
  }

  function onPressThematicDrinks(thematic: string): void {
    setSelectedThematicsDrinks([thematic]);
    // uncomment to enable many thematics filters
    // selectedThematicsDrinks.find(
    //   selectedThematicsDrinks => selectedThematicsDrinks === thematic
    // )
    //   ? setSelectedThematicsDrinks(
    //       selectedThematicsDrinks.filter(selectedThematicsDrinks => {
    //         return selectedThematicsDrinks !== thematic;
    //       })
    //     )
    //   : setSelectedThematicsDrinks(selectedThematicsDrinks => [
    //       ...selectedThematicsDrinks,
    //       thematic
    //     ]);
  }

  function onPressProduct(item: Product) {
    navigation.navigate(RoutesNames.ProductDetailsPage, {
      product: item,
      simpleCard: simpleCard
    });
  }

  function renderListItem(dataList: Product[] | undefined) {
    return (
      <FlatList
        data={dataList}
        renderItem={({ item }) => (
          <ProductCard
            onPress={() => {
              onPressProduct(item);
            }}
            item={item}
            simpleCard={simpleCard}
          />
        )}
        contentContainerStyle={[
          styles.typeView,
          basket && basket.length > 0 && styles.bigPadding
        ]}
        ListEmptyComponent={() => (
          <Text style={styles.noData}>{I18n.t('menu.productNoData')}</Text>
        )}
        keyExtractor={item => item.id.toString()}
        onScroll={onScroll}
      />
    );
  }

  function renderThematics(): string[] {
    const thematicList: string[] = [];
    switch (category) {
      case I18n.t('menu.mainCourses'):
        selectedDistrict &&
          selectedDistrict.catalogs &&
          selectedDistrict.catalogs[0] &&
          selectedDistrict.catalogs[0].thematics_plats_list &&
          selectedDistrict.catalogs[0].thematics_plats_list.map(them => {
            thematicList.push(them.name);
          });
        return thematicList;
      case I18n.t('menu.drinks'):
        selectedDistrict &&
          selectedDistrict.catalogs &&
          selectedDistrict.catalogs[0] &&
          selectedDistrict.catalogs[0].thematics_drinks_list &&
          selectedDistrict.catalogs[0].thematics_drinks_list.map(them => {
            thematicList.push(them.name);
          });
        return thematicList;
      default:
        return [];
    }
  }

  function renderThematicMenu() {
    const thematics = renderThematics();
    return thematics.length > 0 ? (
      <FlatList
        data={thematics}
        horizontal
        renderItem={({ item }) => (
          <TagsItem
            thematic={item}
            onPress={
              category === I18n.t('menu.mainCourses')
                ? onPressThematic
                : category === I18n.t('menu.drinks')
                ? onPressThematicDrinks
                : () => {
                    return;
                  }
            }
            active={
              category === I18n.t('menu.mainCourses')
                ? selectedThematics.find(t => t === item)
                : selectedThematicsDrinks.find(t => t === item)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.flatlist}
        keyExtractor={item => item}
      />
    ) : (
      <></>
    );
  }

  return (
    <View>
      {renderThematicMenu()}
      {renderList()}
    </View>
  );
}

const styles = StyleSheet.create({
  bigPadding: { paddingBottom: 200 },
  flatlist: {
    marginBottom: 32,
    marginTop: 32,
    minHeight: 32,
    paddingHorizontal: 25
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
  },
  separator: { width: 12 },
  typeView: { paddingBottom: 120 }
});

export default (props: JSX.IntrinsicAttributes & ProductsListProps) => (
  <DistrictConsumer>
    {districtCtx => (
      <BookingConsumer>
        {ctx =>
          districtCtx &&
          ctx && (
            <ProductsList
              selectedDistrict={districtCtx.selectedDistrict}
              basket={ctx.basket}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </DistrictConsumer>
);
