import React from 'react';
import { StyleSheet, Text, ImageProps, View, Image } from 'react-native';
import { RadioButton, TouchableRipple } from 'react-native-paper';

import colors from 'src/resources/common/colors';
import { District } from 'src/models/restaurants';

type RadioButtonFieldProps = {
  checked: string;
  setChecked: Function;
  icon: Readonly<ImageProps>;
  district: District;
};

function RadioButtonField({
  checked,
  setChecked,
  icon,
  district
}: RadioButtonFieldProps) {
  function onChange() {
    if (district) {
      setChecked(district);
    }
  }
  return (
    <TouchableRipple
      rippleColor={colors.transparent}
      style={styles.radioContainer}
      onPress={onChange}
    >
      <>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
        <Text style={styles.radioText}>{district.data.name}</Text>
        <View style={styles.radio}>
          <RadioButton.Android
            value={district.data.name}
            status={checked === district.data.name ? 'checked' : 'unchecked'}
            onPress={onChange}
            color={colors.white}
            uncheckedColor={colors.white80}
          />
        </View>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  icon: { height: 16, width: 16 },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightBlack,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    marginRight: 16,
    width: 36
  },
  radio: {
    marginLeft: 'auto'
  },
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
    width: '100%'
  },
  radioText: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16
  }
});

export default RadioButtonField;
