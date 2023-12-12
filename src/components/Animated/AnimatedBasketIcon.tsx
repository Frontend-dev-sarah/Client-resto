import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  View,
  Text
} from 'react-native';
import colors from 'src/resources/common/colors';

import AppImages from 'src/resources/common/AppImages';
import { BookingConsumer } from 'src/store/BookingContext';
import I18n from 'resources/localization/I18n';

type AnimatedBasketIconProps = {
  isLoading: boolean;
  setAddProductHasSucceed?: Function;
  addProductHasSucceed?: boolean;
  onAnimEnd: Function;
  big?: boolean;
  inactive?: boolean;
};

function AnimatedBasketIcon({
  isLoading,
  setAddProductHasSucceed,
  addProductHasSucceed,
  onAnimEnd,
  big,
  inactive
}: AnimatedBasketIconProps) {
  const [animationValue] = useState(new Animated.Value(0));
  const [opacityValue] = useState(new Animated.Value(0));
  const [positionValue] = useState(new Animated.Value(0));
  const [fontSizeValue] = useState(new Animated.Value(0));

  const [anim] = useState(
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 500
      }),
      Animated.timing(fontSizeValue, {
        toValue: 20,
        duration: 500,
        easing: Easing.linear
      }),
      Animated.timing(animationValue, {
        toValue: 200,
        duration: 500
      }),
      Animated.timing(positionValue, {
        toValue: 50,
        duration: 1000,
        easing: Easing.linear
      })
    ])
  );

  const [anim2] = useState(
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 500
      }),
      Animated.timing(fontSizeValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear
      })
    ])
  );
  const [anim3] = useState(
    Animated.timing(positionValue, {
      toValue: 0,
      duration: 0
    })
  );

  function startAnim() {
    anim.start();
    setTimeout(() => {
      anim2.start();
    }, 500);
    setTimeout(() => {
      anim3.start();
    }, 1000);
  }

  function showAnim() {
    onAnimEnd();
    startAnim();
    setAddProductHasSucceed && setAddProductHasSucceed();
  }

  useEffect(() => {
    if (addProductHasSucceed && isLoading) {
      showAnim();
    }
    if (addProductHasSucceed === false && isLoading) {
      onAnimEnd();
    }
  }, [addProductHasSucceed, isLoading]);

  const [animatedStyle] = useState({
    width: 40,
    opacity: opacityValue,
    height: animationValue,
    top: positionValue,
    fontSize: fontSizeValue,
    color: colors.white,
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'GothamBold'
  });

  if (isLoading)
    return <ActivityIndicator color={big ? colors.paleOrange : colors.white} />;
  else {
    return (
      <>
        {big ? (
          <View style={styles.row}>
            <Text style={[styles.text, inactive && styles.inactiveText]}>
              {I18n.t('product.order')}
            </Text>
            <Image
              source={AppImages.images.basketIcon}
              style={[styles.icon, inactive && styles.inactiveIcon]}
            />
          </View>
        ) : (
            <Image source={AppImages.images.basketIcon} style={styles.basket} />
          )}
        <Animated.Text
          style={animatedStyle}
          source={AppImages.images.basketIcon}
          numberOfLines={1}
        >
          {/* eslint-disable-next-line react-native/no-raw-text */}
          {'+1'}
        </Animated.Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  basket: {
    height: 20,
    width: 20
  },
  icon: {
    marginLeft: 10,
    tintColor: colors.paleOrange
  },
  inactiveIcon: {
    tintColor: colors.brownishGrey
  },
  inactiveText: {
    color: colors.brownishGrey
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: colors.paleOrange,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & AnimatedBasketIconProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <AnimatedBasketIcon
          addProductHasSucceed={ctx.addProductHasSucceed}
          setAddProductHasSucceed={ctx.setAddProductHasSucceed}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
