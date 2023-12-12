import React from 'react';
import { Text, StyleSheet, ImageBackground } from 'react-native';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { screenWidth } from 'src/utils/constants';
import { Product } from 'models/products';
import { TouchableRipple } from 'react-native-paper';
import Notation from './Notation';

type ProductCardPreviewProps = {
  item: Product;
  notation?: number;
  onChange?: Function;
};

export default function ProductCardNotation({
  item,
  notation,
  onChange
}: ProductCardPreviewProps) {
  return (
    <TouchableRipple style={styles.shadow}>
      <>
        <ImageBackground
          style={[styles.container, styles.shadow]}
          source={
            item.images && item.images[0] && { uri: item.images[0].image }
          }
          imageStyle={styles.image}
        >
          <Text style={[styles.text, styles.name]}>{item.name}</Text>
          <Notation
            size={30}
            notation={notation || 5}
            containerStyle={styles.notationStyle}
            onChange={onChange}
          />
        </ImageBackground>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  shadow: Appstyle.shadowExtraBold(colors.black),
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.lightBlack,
    borderRadius: 6,
    flex: 1,
    height: 112,
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginTop: 24,
    paddingTop: 16,
    width: screenWidth - 50
  },
  image: {
    borderRadius: 6,
    opacity: 0.8
  },
  text: {
    color: colors.white80,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0.25,
    lineHeight: 14
  },
  name: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 6,
    paddingHorizontal: 16
  },
  notationStyle: {
    padding: 16
  }
});
