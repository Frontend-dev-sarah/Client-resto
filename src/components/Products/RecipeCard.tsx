import React from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';

import colors from 'resources/common/colors';
import I18n from 'resources/localization/I18n';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';
import { Recipe } from 'src/models/products';

type RecipeCardProps = {
  goToRecipe: Function;
  recipe: Recipe;
};

// console.log({
//   created_at: '2020-05-27 15:10:59',
//   description: 'Classique',
//   id: 2,
//   images: [
//     {
//       created_at: '2020-06-26 10:36:47',
//       id: 1,
//       image:
//         'http://uni.dev2.soluti.fr/storage/recipe-images/ZBPEJQ8geqfD4Ge4sFNBeXyh17CVpZ7dUZTOruA5.png',
//       name: 'fzf',
//       recipe_id: 2,
//       updated_at: '2020-06-26 10:36:47'
//     }
//   ],
//   ingredients: [
//     {
//       created_at: '2020-05-27 15:10:59',
//       id: 3,
//       name: 'Veau',
//       quantity: 100,
//       recipe_id: 2,
//       unity: 'g',
//       updated_at: '2020-05-27 15:10:59'
//     }
//   ],
//   name: 'Burger',
//   nb_persons: 23,
//   product_id: 3,
//   steps: [
//     {
//       created_at: '2020-05-27 15:10:59',
//       description: 'Chut ca cuit',
//       id: 3,
//       name: 'Cuire',
//       number: 1,
//       recipe_id: 2,
//       updated_at: '2020-05-27 15:10:59'
//     }
//   ],
//   time: 30,
//   updated_at: '2020-06-26 10:36:47'
// });

export default function RecipeCard({
  goToRecipe,
  recipe
}: RecipeCardProps): JSX.Element {
  return (
    <TouchableRipple
      style={styles.recipeContainer}
      onPress={() => goToRecipe()}
    >
      <>
        <Text style={styles.recipeTitle}>{I18n.t('product.theRecipe')}</Text>
        <View style={styles.row}>
          <View>
            <Image source={AppImages.images.order} style={styles.img} />
            <Text style={styles.subText}>
              {I18n.t('product.person', { nb: recipe.nb_persons || '-' })}
            </Text>
          </View>
          <View>
            <Image source={AppImages.images.clock} style={styles.img} />
            <Text style={styles.subText}>
              {I18n.t('product.time', {
                min: recipe.time || '-',
                hour: recipe.hour || '-'
              })}
            </Text>
          </View>
        </View>
        <View style={styles.discover}>
          <Text style={[styles.recipeTitle, styles.white]}>
            {I18n.t('product.discover')}
          </Text>
        </View>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  discover: {
    backgroundColor: colors.white10,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    bottom: 0,
    padding: 12,
    position: 'absolute',
    right: 0
  },
  img: {
    height: 16,
    marginBottom: 4,
    marginRight: 20,
    tintColor: colors.white,
    width: 16
  },
  recipeContainer: {
    borderColor: colors.white10,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 20,
    paddingBottom: 50,
    paddingHorizontal: 14,
    paddingVertical: 20
  },
  recipeTitle: {
    color: colors.paleOrange,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18
  },
  row: {
    flexDirection: 'row',
    marginTop: 16
  },
  subText: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginRight: 20
  },
  white: { color: colors.white }
});
