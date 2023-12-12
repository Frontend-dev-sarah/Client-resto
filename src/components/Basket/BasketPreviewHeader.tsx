import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  View,
  Animated
} from 'react-native';
import Constants from 'expo-constants';
import { TouchableRipple } from 'react-native-paper';

import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import { Basket, BasketItem } from 'src/models/products';
import { BookingConsumer } from 'src/store/BookingContext';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { PlaceChoice } from 'src/models/restaurants';

type BasketPreviewHeaderProps = {
  basket?: Basket;
  getTotalPrice?: Function;
  onPress: Function;
  opened: boolean;
  onPressProduct: Function;
  placeChoice?: PlaceChoice;
};

function BasketPreviewHeader({
  basket,
  getTotalPrice,
  onPress,
  opened,
  onPressProduct,
  placeChoice
}: BasketPreviewHeaderProps) {
  if (opened) {
    return (
      <View style={styles.bg}>
        <View style={styles.headerOpened}>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>
            {placeChoice === 'takeAway'
              ? I18n.t('basket.takeAway')
              : I18n.t('basket.onSite')}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <TouchableRipple style={styles.header} onPress={() => onPress()}>
        <>
          <FlatList
            horizontal
            data={basket}
            renderItem={({ item }) => (
              <ProductPreviewItem item={item} onPressProduct={onPressProduct} />
            )}
            contentContainerStyle={styles.flatlist}
            keyExtractor={item => item.product.id.toString()}
          />
          <TouchableRipple style={styles.headerRightButton}>
            <>
              <Text style={styles.textHeader}> {I18n.t('basket.basket')} </Text>
              <Text style={styles.priceHeader}>
                {`${getTotalPrice && getTotalPrice()}€`}
              </Text>
            </>
          </TouchableRipple>
        </>
      </TouchableRipple>
    );
  }
}
type ProductPreviewItemProps = {
  item: BasketItem;
  onPressProduct: Function;
};
function ProductPreviewItem({ item, onPressProduct }: ProductPreviewItemProps) {
  const [fontSizeValue] = useState(new Animated.Value(12));
  const [bgColor] = useState(new Animated.Value(0));

  const interpolateBG = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.black30, colors.greenyBlue]
  });

  const [anim] = useState(
    Animated.parallel([
      Animated.timing(fontSizeValue, {
        toValue: 16,
        duration: 500
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 500
      })
    ])
  );
  const [anim2] = useState(
    Animated.parallel([
      Animated.timing(fontSizeValue, {
        toValue: 12,
        duration: 500
      }),
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 500
      })
    ])
  );

  useEffect(() => {
    anim.start(() => anim2.start());
  }, [item.quantity]);

  return (
    <TouchableRipple onPress={() => onPressProduct(item.product)}>
      <>
        <Image
          source={{
            uri:
              item.product.images &&
              item.product.images[0] &&
              item.product.images[0].image
          }}
          style={styles.productPreview}
        />
        {item.quantity > 1 && (
          <Animated.View
            style={[
              styles.qtyContainer,
              {
                backgroundColor: interpolateBG
              }
            ]}
          >
            <Animated.Text
              style={[styles.qtyText, { fontSize: fontSizeValue }]}
              // eslint-disable-next-line react-native/no-raw-text
            >{`x${item.quantity}`}</Animated.Text>
          </Animated.View>
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  bg: {
    marginBottom: -1
  },
  flatlist: { paddingLeft: 32, paddingVertical: 16 },
  header: {
    backgroundColor: colors.black,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flexDirection: 'row',
    height: 88,
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 88 + getBottomSpace() },
      {}
    )
  },
  headerButton: {
    alignSelf: 'center',
    backgroundColor: colors.veryLightGrey,
    borderRadius: 2,
    height: 4,
    marginBottom: 4,
    marginTop: 'auto',
    width: 21
  },
  headerOpened: {
    height: Constants.statusBarHeight + 20
  },
  headerRightButton: {
    alignItems: 'center',
    backgroundColor: colors.paleOrange,
    borderTopRightRadius: 36,
    height: 88,
    ...ifIphoneX({ height: 88 + getBottomSpace() }, {}),
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 12
  },
  headerTitle: {
    backgroundColor: colors.darkGrey,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    zIndex: 5
  },
  priceHeader: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24
  },
  productPreview: {
    backgroundColor: colors.veryLightGrey,
    borderRadius: 8,
    height: 56,
    marginRight: 16,
    width: 56
  },
  qtyContainer: {
    alignItems: 'center',
    backgroundColor: colors.black30,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 6,
    position: 'absolute'
  },
  qtyText: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  },
  textHeader: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    marginBottom: 33,
    marginTop: 12,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & BasketPreviewHeaderProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <BasketPreviewHeader
          basket={ctx.basket}
          getTotalPrice={ctx.getTotalPrice}
          placeChoice={ctx.placeChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
