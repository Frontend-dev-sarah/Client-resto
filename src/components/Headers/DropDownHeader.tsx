import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Easing,
  ScrollView,
  Animated,
  Platform
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Constants from 'expo-constants';

import colors from 'src/resources/common/colors';
import TouchableIcon from '../Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import { District, LocationType } from 'src/models/restaurants';
import RadioButtonField from '../Form/RadioButtonField';
import I18n from 'resources/localization/I18n';
import { DistrictConsumer } from 'src/store/DistrictContext';

type DropDownHeaderProps = {
  districts?: District[];
  selectedDistrict?: District;
  setSelectedDistrict?: Function;
  title: string;
  onPress?: () => void;
  getLocation: () => void;
  location: LocationType;
};

function DropDownHeader({
  districts,
  selectedDistrict,
  setSelectedDistrict,
  title,
  onPress,
  getLocation,
  location
}: DropDownHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const [anim] = useState(new Animated.Value(130 + Constants.statusBarHeight));
  const [animIcon] = useState(new Animated.Value(0));

  useEffect(() => {
    !location && getLocation();
  }, []);

  function toggleMenu() {
    const minHeight = 130 + Constants.statusBarHeight;
    const maxHeight = 337;

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
  return (
    <>
      <Animated.View
        style={[{ height: anim }, styles.topBar]}
        onPress={toggleMenu}
      >
        <View style={styles.row}>
          {onPress && (
            <TouchableIcon
              icon={AppImages.images.mapIcon}
              height={21}
              width={20}
              style={styles.mapIcon}
              onPress={onPress}
            />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
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
            <View style={styles.separator} />
            <ScrollView style={styles.scrollContainer}>
              {districts &&
                districts.map(
                  (value: District) =>
                    value.data &&
                    selectedDistrict &&
                    setSelectedDistrict && (
                      <RadioButtonField
                        key={value.data.id}
                        checked={
                          selectedDistrict &&
                          selectedDistrict.data &&
                          selectedDistrict.data.name
                        }
                        setChecked={(item: District) => {
                          setSelectedDistrict(item);
                          toggleMenu();
                        }}
                        icon={
                          value.data.name === I18n.t('restaurants.aroundMe')
                            ? AppImages.images.geoloc
                            : AppImages.images.location
                        }
                        district={value}
                      />
                    )
                )}
            </ScrollView>
          </>
        )}
      </Animated.View>
      {expanded && <View onTouchStart={toggleMenu} style={styles.overlay} />}
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginLeft: 12,
    marginTop: Platform.OS === 'android' ? 5 : 0,
    zIndex: 3
  },
  mapIcon: {
    position: 'absolute',
    right: 10,
    top: 50
  },
  overlay: {
    backgroundColor: colors.black60,
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  scrollContainer: {
    marginHorizontal: 35,
    paddingBottom: 24,
    paddingTop: 24
  },
  selectedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 22,
    paddingTop: 12
  },
  selectedValue: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18
  },
  separator: {
    borderColor: colors.white40,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 1,
    marginHorizontal: 35,
    marginTop: 16
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 40,
    marginTop: Constants.statusBarHeight + 22,
    textAlign: 'center'
  },
  topBar: {
    backgroundColor: colors.black,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    display: 'flex',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2
  }
});

export default (props: JSX.IntrinsicAttributes & DropDownHeaderProps) => (
  <DistrictConsumer>
    {districtCtx =>
      districtCtx && (
        <DropDownHeader
          districts={districtCtx.districts}
          selectedDistrict={districtCtx.selectedDistrict}
          setSelectedDistrict={districtCtx.setSelectedDistrict}
          getLocation={districtCtx.getLocation}
          location={districtCtx.location}
          {...props}
        />
      )
    }
  </DistrictConsumer>
);
