import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Easing,
  ScrollView,
  Animated,
  Platform,
  ViewStyle
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Constants from 'expo-constants';

import colors from 'src/resources/common/colors';
import AppImages from 'src/resources/common/AppImages';
import { District } from 'src/models/restaurants';
import { DistrictConsumer } from 'src/store/DistrictContext';

type DropDownPositionProps = {
  selectedDistrict?: District;
  districts?: District[];
  setSelectedDistricts?: Function;
  customStyle?: ViewStyle;
};

function DropDownPosition({
  selectedDistrict,
  setSelectedDistricts,
  districts,
  customStyle
}: DropDownPositionProps) {
  const [expanded, setExpanded] = useState(false);
  const [anim] = useState(new Animated.Value(130 + Constants.statusBarHeight));
  const [animIcon] = useState(new Animated.Value(0));

  function toggleMenu() {
    const minHeight = 30;
    const maxHeight = 200;

    const initialValue = expanded ? maxHeight + minHeight : minHeight;
    const finalValue = expanded ? minHeight : maxHeight + minHeight;

    setExpanded(!expanded);

    anim.setValue(initialValue);
    Animated.timing(anim, {
      toValue: finalValue,
      duration: 300,
      easing: Easing.linear
    }).start();
    Animated.timing(animIcon, {
      toValue: expanded ? 0 : 1,
      duration: 300
    }).start();
  }

  const interpolateRotation = animIcon.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  const animatedStyle = {
    transform: [
      { translateY: expanded && Platform.OS === 'android' ? 4 : 0 },
      { rotateX: interpolateRotation }
    ]
  };

  function onPressValue(item: District) {
    setSelectedDistricts && setSelectedDistricts(item);
    toggleMenu();
  }
  return (
    <>
      <Animated.View
        style={[{ height: anim }, styles.topBar, customStyle]}
        onPress={toggleMenu}
      >
        <TouchableRipple onPress={toggleMenu} style={styles.selectedContainer}>
          <>
            <Text style={styles.selectedValue}>
              {selectedDistrict &&
                selectedDistrict.data &&
                selectedDistrict.data.name}
            </Text>
            <Animated.View style={animatedStyle}>
              <Image
                style={[styles.icon]}
                source={AppImages.images.arrowDown}
              />
            </Animated.View>
          </>
        </TouchableRipple>

        {expanded && (
          <>
            <ScrollView style={styles.scrollContainer}>
              {districts &&
                districts.map(
                  (value: District) =>
                    value.data && (
                      <TouchableRipple
                        style={styles.valueContainer}
                        onPress={() => onPressValue(value)}
                        key={value.data.id}
                      >
                        <Text style={styles.selectedValue}>
                          {value.data.name}
                        </Text>
                      </TouchableRipple>
                    )
                )}
            </ScrollView>
          </>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginLeft: 12,
    marginTop: Platform.OS === 'android' ? 5 : 0,
    zIndex: 3
  },
  scrollContainer: {
    backgroundColor: colors.black60,
    marginTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 25,
    paddingTop: 15
  },
  selectedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  selectedValue: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    textAlign: 'right'
  },
  topBar: {
    backgroundColor: colors.transparent,
    position: 'absolute',
    right: 0,
    top: 0
  },
  valueContainer: {
    height: 20,
    marginVertical: 5
  }
});
export default (props: JSX.IntrinsicAttributes & DropDownPositionProps) => (
  <DistrictConsumer>
    {districtCtx =>
      districtCtx && (
        <DropDownPosition
          districts={districtCtx.districts}
          selectedDistrict={districtCtx.selectedDistrict}
          setSelectedDistricts={districtCtx.setSelectedDistrict}
          {...props}
        />
      )
    }
  </DistrictConsumer>
);
