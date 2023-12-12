import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageProps,
  StyleProp,
  ViewStyle,
  ImageStyle
} from 'react-native';

import colors from 'src/resources/common/colors';
import { TouchableRipple } from 'react-native-paper';

type AccountItemProps = {
  backgroundColor: string;
  image: Readonly<ImageProps>;
  text: string;
  onPress: () => void;
  customStyle?: StyleProp<ViewStyle>;
  imgStyle?: StyleProp<ImageStyle>;
  badge?: boolean;
  badgeColor?: string;
};

export default function AccountItem({
  backgroundColor,
  image,
  text,
  onPress,
  customStyle,
  imgStyle,
  badge,
  badgeColor
}: AccountItemProps) {
  return (
    <TouchableRipple style={[styles.row, customStyle]} onPress={onPress}>
      <>
        <View
          style={[styles.iconContainer, { backgroundColor: backgroundColor }]}
        >
          <Image source={image} style={[styles.icon, imgStyle]} />
        </View>
        <Text style={styles.text}>{text}</Text>
        {badge && (
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColor || colors.red }
            ]}
          />
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 5,
    height: 8,
    left: 5,
    top: -5,
    width: 8,
    zIndex: 1
  },
  icon: {
    height: 16,
    width: 16
  },
  iconContainer: {
    borderRadius: 8,
    marginRight: 16,
    padding: 10
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40
  },
  text: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16
  }
});
