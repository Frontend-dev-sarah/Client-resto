import React from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { Checkbox, TouchableRipple } from 'react-native-paper';

import colors from 'src/resources/common/colors';

type CheckBoxFieldProps = {
  checked: boolean;
  setChecked: (value: boolean) => void;
  title: string | JSX.Element;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

function CheckBoxField({
  checked,
  setChecked,
  title,
  style,
  disabled
}: CheckBoxFieldProps) {
  function changeCheckedValue() {
    setChecked(!checked);
  }

  return (
    <TouchableRipple
      rippleColor={colors.transparent}
      style={[styles.radioContainer, style]}
      onPress={changeCheckedValue}
    >
      <>
        <Checkbox.Android
          status={checked ? 'checked' : 'unchecked'}
          onPress={changeCheckedValue}
          color={colors.white}
          uncheckedColor={colors.white}
          disabled={disabled}
        />
        <Text style={styles.radioText}>{title}</Text>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  radioText: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    paddingTop: 2
  }
});

export default CheckBoxField;
