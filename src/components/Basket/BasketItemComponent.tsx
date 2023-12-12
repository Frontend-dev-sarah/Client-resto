import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';

import colors from 'src/resources/common/colors';
import { BasketItem } from 'src/models/products';
import I18n from 'resources/localization/I18n';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';
import { AuthConsumer } from 'src/store/AuthContext';
import { BookingConsumer } from 'src/store/BookingContext';
import CheckBoxField from '../Form/CheckBoxField';

type BasketItemComponentProps = {
  item: BasketItem;
  onPressProduct: Function;
  removeFromBasket?: Function;
  alreadySubscribed?: boolean;
  disableDelete?: boolean;
  addToBasket?: Function;
  selectProduct?: Function;
  isSelected?: boolean;
  selectable?: boolean;
  paid?: boolean;
  noStyle?: boolean;
};

function BasketItemComponent({
  item,
  onPressProduct,
  removeFromBasket,
  alreadySubscribed,
  disableDelete,
  addToBasket,
  selectProduct,
  isSelected,
  selectable,
  paid,
  noStyle
}: BasketItemComponentProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [changingQuantity, setChangingQuantity] = useState<boolean>(false);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  useEffect(() => {
    if (isSelected && isSelected !== isChecked) {
      setIsChecked(isSelected);
    }
  }, [isSelected]);

  useEffect(() => {
    if (
      disableDelete &&
      item.product &&
      item.product.status !== (null || undefined) &&
      item.product.status !== 'ordered'
    ) {
      setIsOrdered(true);
    } else if (disableDelete && isOrdered) {
      setIsOrdered(false);
    }
  }, [item]);

  return (
    <TouchableRipple
      style={[
        styles.itemContainer,
        (isOrdered || paid) && !noStyle && styles.servedTheme
      ]}
      onPress={() => !isOrdered && selectProduct && selectProduct(item.product)}
    >
      <>
        {selectProduct && selectable && (
          <CheckBoxField
            setChecked={() =>
              !isOrdered && selectProduct && selectProduct(item.product)
            }
            checked={isSelected}
            disabled={isOrdered}
            style={styles.checkbox}
          />
        )}
        <TouchableRipple
          onPress={() =>
            selectProduct && !isOrdered
              ? selectProduct(item.product)
              : !selectProduct && onPressProduct(item.product)
          }
        >
          <>
            <Image
              style={styles.img}
              source={{
                uri:
                  item.product.images &&
                  item.product.images[0] &&
                  item.product.images[0].image
              }}
            />
            {item.quantity > 1 && (
              <View style={styles.qtyContainer}>
                <Text style={styles.qtyText}>{`x${item.quantity}`}</Text>
              </View>
            )}
          </>
        </TouchableRipple>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {`${item.product.name}${
              item.option ? ` - ${item.option.name}` : ''
            }`}
          </Text>
          {!disableDelete && !paid && (
            <View style={styles.deleteContainer}>
              <TouchableRipple
                onPress={async () => {
                  setIsDeleting(true);
                  removeFromBasket &&
                    (await removeFromBasket(item.product, true));
                  setIsDeleting(false);
                }}
                style={styles.row}
              >
                <>
                  <Text style={styles.deleteText}>{I18n.t('app.delete')}</Text>
                  {isDeleting ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Image
                      style={styles.trash}
                      source={AppImages.images.trash}
                    />
                  )}
                </>
              </TouchableRipple>
              <View style={styles.quantityChoiceWrapper}>
                <TouchableRipple
                  onPress={async () => {
                    setChangingQuantity(true);
                    removeFromBasket && (await removeFromBasket(item.product));
                    setChangingQuantity(false);
                  }}
                >
                  <Text style={styles.plusLess}>{'-'}</Text>
                </TouchableRipple>

                {changingQuantity ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.quantity}>{item.quantity}</Text>
                )}
                <TouchableRipple
                  onPress={async () => {
                    setChangingQuantity(true);
                    addToBasket && (await addToBasket(item.product));
                    setChangingQuantity(false);
                  }}
                >
                  <Text style={styles.plusLess}>{'+'}</Text>
                </TouchableRipple>
              </View>
            </View>
          )}
        </View>
        {!paid ? (
          <TouchableRipple
            style={styles.priceLittleContainer}
            // onPress={() => onPressProduct(item.product)}
          >
            <Text style={styles.priceLittle}>
              {`${(
                parseFloat(
                  alreadySubscribed && item.product.reduced_price
                    ? item.product.reduced_price
                    : item.product.price
                ) * item.quantity
              ).toFixed(2)} €`}
            </Text>
          </TouchableRipple>
        ) : (
          <TouchableRipple
            style={styles.priceLittleContainer}
            onPress={() => onPressProduct(item.product)}
          >
            <Text style={styles.priceLittle}>{I18n.t('basket.paid')}</Text>
          </TouchableRipple>
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  checkbox: { marginBottom: 0 },
  plusLess: {
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: colors.white
  },
  quantity: {
    color: colors.white,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row'
  },
  quantityChoiceWrapper: {
    alignItems: 'center',
    backgroundColor: colors.brownishGrey,
    borderRadius: 4,
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    marginRight: 8
  },
  deleteContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteText: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 14,
    opacity: 0.8
  },
  img: {
    backgroundColor: colors.veryLightGrey,
    borderRadius: 8,
    height: 56,
    marginRight: 12,
    width: 56
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    marginBottom: 24,
    width: '100%'
  },
  servedTheme: {
    backgroundColor: colors.white10,
    borderRadius: 15,
    paddingVertical: 5
  },
  name: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: 4,
    marginRight: 16
  },
  nameContainer: { height: '100%', flex: 0.8 },
  priceLittle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0.25,
    textAlign: 'center'
  },
  priceLittleContainer: {
    marginLeft: 'auto',
    flex: 0.2,
    height: '100%',
    justifyContent: 'center'
  },
  qtyContainer: {
    alignItems: 'center',
    backgroundColor: colors.black30,
    borderTopRightRadius: 8,
    bottom: 0,
    height: 24,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: 27
  },
  qtyText: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  },
  trash: {
    height: 16,
    marginLeft: 12,
    width: 16
  }
});

export default (props: JSX.IntrinsicAttributes & BasketItemComponentProps) => (
  <AuthConsumer>
    {authCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <BasketItemComponent
              alreadySubscribed={authCtx.alreadySubscribed}
              removeFromBasket={ctx.removeFromBasket}
              addToBasket={ctx.addToBasket}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
