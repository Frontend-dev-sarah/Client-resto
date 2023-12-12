import React from 'react';
import {
  StyleSheet,
  Image,
  ImageProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';

type TouchableIconProps = {
  icon: Readonly<ImageProps> | { uri: string };
  onPress?: () => void;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  padding?: number;
};

export default function TouchableIcon({
  icon,
  onPress,
  width = 32,
  height = 32,
  style,
  color,
  padding = 18
}: TouchableIconProps) {
  return (
    <TouchableRipple
      onPress={onPress}
      style={[styles.touchableIcon, style, { padding: padding }]}
    >
      <Image
        resizeMode="contain"
        style={{ tintColor: color, height: height, width: width }}
        source={icon}
      />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  touchableIcon: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
