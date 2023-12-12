import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  ImageProps,
  Image
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import colors from 'resources/common/colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

const buttonHeight = 74;

type BorderedRadiusButtonProps = {
  primary?: boolean; // primary is orange and other is dark
  text?: string;
  customStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  isLoading?: boolean;
  borderTopLeft?: boolean;
  borderTopRight?: boolean;
  borderBottomLeft?: boolean;
  borderBottomRight?: boolean;
  icon?: Readonly<ImageProps>;
  inactive?: boolean;
  bottom?: boolean;
};

export default function BorderedRadiusButton({
  primary,
  text,
  customStyle,
  onPress,
  isLoading,
  borderTopLeft,
  borderTopRight,
  borderBottomLeft,
  borderBottomRight,
  icon,
  inactive,
  bottom
}: BorderedRadiusButtonProps) {
  const textStyle =
    !primary && !inactive
      ? styles.textOrange
      : !inactive
      ? styles.textWhite
      : styles.textGrey;
  const buttonStyle = primary && !inactive ? styles.primary : styles.secondary;
  const borderStyle = borderTopLeft
    ? styles.borderTopLeft
    : borderBottomLeft
    ? styles.borderBottomLeft
    : borderBottomRight
    ? styles.borderBottomRight
    : borderTopRight && styles.borderTopRight;

  return (
    <TouchableRipple
      disabled={inactive || isLoading}
      style={[
        styles.button,
        buttonStyle,
        borderStyle,
        customStyle,
        bottom && styles.bottom
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.row}>
          {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
          {icon && (
            <Image
              source={icon}
              style={[styles.icon, inactive && styles.inactiveIcon]}
            />
          )}
        </View>
      )}
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  borderBottomLeft: {
    borderBottomLeftRadius: 32
  },
  borderBottomRight: {
    borderBottomRightRadius: 32
  },
  borderTopLeft: {
    borderTopLeftRadius: 32
  },
  borderTopRight: {
    borderTopRightRadius: 32
  },
  bottom: {
    ...ifIphoneX(
      {
        paddingBottom: getBottomSpace(),
        height: buttonHeight + getBottomSpace()
      },
      {}
    )
  },
  button: {
    alignItems: 'center',
    height: buttonHeight,
    justifyContent: 'center'
  },
  icon: {
    marginLeft: 10,
    width: 12
  },
  inactiveIcon: {
    tintColor: colors.brownishGrey
  },
  primary: {
    backgroundColor: colors.paleOrange
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  secondary: {
    backgroundColor: colors.lightBlack
  },
  text: {
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    textAlign: 'center'
  },
  textGrey: {
    color: colors.brownishGrey
  },
  textOrange: {
    color: colors.paleOrange
  },
  textWhite: { color: colors.white }
});
