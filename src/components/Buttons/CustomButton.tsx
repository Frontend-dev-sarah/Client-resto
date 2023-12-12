/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  Platform,
  Keyboard
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

const buttonHeight = 42;
const bigButtonHeight = 52;

type CustomButtonProps = {
  primary?: boolean; // primary is orange and other is pink
  border?: boolean;
  outlined?: boolean;
  text: string;
  customStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  inactive?: boolean;
  isLoading?: boolean;
  bottom?: boolean;
  badge?: boolean;
  disabled?: boolean;
};

type CustomTextProps = {
  style: object;
  text: string;
  border?: boolean;
};

function CustomButton({
  primary,
  border,
  outlined,
  text,
  customStyle,
  onPress,
  inactive,
  isLoading,
  bottom,
  badge,
  disabled
}: CustomButtonProps) {
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', () => setKeyboardOpen(true));
      Keyboard.removeListener('keyboardDidHide', () => setKeyboardOpen(false));
    };
  }, []);

  const textStyle = primary && outlined ? styles.textOrange : styles.textWhite;
  const buttonStyle = disabled
    ? styles.disabled
    : primary && outlined
    ? styles.primaryOutlined
    : primary
    ? styles.primary
    : outlined
    ? styles.secondaryOutlined
    : bottom && !inactive
    ? [
        styles.bottom,
        ,
        !keyboardOpen && {
          ...ifIphoneX(
            {
              paddingBottom: getBottomSpace(),
              height: 64 + getBottomSpace()
            },
            {}
          )
        },
        styles.secondary
      ]
    : bottom
    ? [
        styles.bottom,
        !keyboardOpen && {
          ...ifIphoneX(
            {
              paddingBottom: getBottomSpace(),
              height: 64 + getBottomSpace()
            },
            {}
          )
        }
      ]
    : styles.secondary;

  const shadowStyle = primary ? styles.shadowPrimary : styles.shadowSecondary;

  return (
    <View
      style={[
        Platform.OS === 'ios' && shadowStyle,
        styles.buttonContainer,
        customStyle,
        border && styles.borderStyle
      ]}
    >
      {badge && <View style={styles.badge} />}
      <TouchableRipple
        style={[
          styles.button,
          buttonStyle,
          !bottom && styles.radius,
          Platform.OS === 'android' && !outlined && shadowStyle,
          border && { height: bigButtonHeight }
        ]}
        disabled={inactive || isLoading || disabled}
        onPress={onPress}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <CustomText style={textStyle} text={text} border={border} />
        )}
      </TouchableRipple>
    </View>
  );
}

const CustomText = ({ text, style, border }: CustomTextProps) => (
  <Text style={[style, border ? styles.textBig : styles.textSmall]}>
    {text}
  </Text>
);

const styles = StyleSheet.create({
  borderStyle: {
    borderColor: colors.paleOrange,
    borderRadius: 7,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 6
  },
  bottom: {
    backgroundColor: colors.black,
    height: 64
  },
  button: {
    alignItems: 'center',
    height: buttonHeight,
    justifyContent: 'center'
  },
  buttonContainer: { width: '100%' },
  primary: {
    backgroundColor: colors.paleOrange
  },
  primaryOutlined: {
    backgroundColor: colors.transparent,
    borderColor: colors.paleOrange,
    borderStyle: 'solid',
    borderWidth: 1
  },
  radius: { borderRadius: 6 },
  secondary: {
    backgroundColor: colors.deepRose
  },
  secondaryOutlined: {
    backgroundColor: colors.transparent,
    borderColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1
  },
  shadowPrimary: Appstyle.shadow(colors.paleOrange),
  shadowSecondary: Appstyle.shadow(colors.deepRose),
  textBig: {
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0.8,
    paddingTop: Platform.OS === 'ios' ? 5 : 0 // have to add this because of Gotham font
  },
  textOrange: {
    color: colors.paleOrange
  },
  textSmall: {
    fontFamily: 'Gotham',
    fontSize: 14,
    fontStyle: 'normal',
    letterSpacing: 0.75,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center' // have to add this because of Gotham font
  },
  textWhite: { color: colors.white },
  badge: {
    backgroundColor: colors.green,
    borderRadius: 15,
    height: 15,
    position: 'absolute',
    right: -5,
    top: -5,
    width: 15,
    zIndex: 1
  },
  disabled: { backgroundColor: colors.brownishGrey }
});
export default CustomButton;
