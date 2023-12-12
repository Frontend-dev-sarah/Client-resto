import React from 'react';
import {
  Text,
  ImageProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Image,
  ImageStyle,
  TextStyle
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import colors from 'resources/common/colors';

type TouchableTextProps = {
  text: string;
  icon?: Readonly<ImageProps>;
  onPress?: () => void;
  iconSize?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  iconRight?: boolean;
};

export default function TouchableText({
  text,
  icon,
  onPress,
  iconSize = 32,
  textStyle,
  containerStyle,
  iconStyle,
  iconRight
}: TouchableTextProps) {
  return (
    <TouchableRipple
      onPress={onPress}
      style={[styles.touchableText, containerStyle]}
    >
      <>
        {icon && !iconRight && (
          <Image
            source={icon}
            style={[
              { height: iconSize, width: iconSize },
              styles.icon,
              iconStyle
            ]}
          />
        )}

        <Text style={[styles.text, textStyle]}>{text}</Text>
        {icon && iconRight && (
          <Image
            source={icon}
            style={[
              { height: iconSize, width: iconSize },
              styles.iconRight,
              iconStyle
            ]}
          />
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 8
  },
  iconRight: {
    marginLeft: 12
  },
  text: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  },
  touchableText: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  }
});
