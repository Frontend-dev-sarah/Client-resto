import React from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';

import colors from 'resources/common/colors';
import { AllergieType } from 'models/products';
import AppImages from 'src/resources/common/AppImages';
import { TagsType } from 'models/products';

type ProductTagProps = {
  tags?: TagsType[];
  allergies?: AllergieType[];
};

export default function ProductTag({
  tags,
  allergies
}: ProductTagProps): JSX.Element {
  function renderImage(tag) {
    return (
      <Image
        resizeMode="contain"
        style={styles.icon}
        source={{ uri: tag.icon }}
      />
    );
  }
  return (
    <View style={styles.tags}>
      {tags &&
        tags.map(tag => (
          <View key={tag.id} style={[styles.item, styles.tag]}>
            <Text style={styles.text}>{tag.name}</Text>
            {renderImage(tag, 'tag')}
          </View>
        ))}
      {allergies &&
        allergies.map(allergie => (
          <View key={allergie.id} style={[styles.item, styles.allergie]}>
            <Text style={styles.text}>{allergie.name}</Text>
            {renderImage(allergie, 'allergie')}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  allergie: {
    backgroundColor: colors.paleOrange
  },
  icon: { height: 16, tintColor: colors.white, width: 16 },
  item: {
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    marginRight: 12,
    paddingBottom: 4,
    paddingHorizontal: 8,
    paddingTop: 6
  },
  tag: {
    backgroundColor: colors.greenishGrey60
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    maxWidth: '100%'
  },
  text: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 12,
    lineHeight: 14,
    marginRight: 4,
    paddingTop: 1
  }
});
