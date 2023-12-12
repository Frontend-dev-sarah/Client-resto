import React from 'react';
import { StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import { getBottomSpace, ifIphoneX } from 'react-native-iphone-x-helper';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'resources/common/AppImages';
import colors from 'resources/common/colors';
import I18n from 'resources/localization/I18n';

type BottomFabProps = {
  active: boolean;
  onPress: () => void;
  isLoading?: boolean;
  cancel?: boolean;
  grey?: boolean;
  checkIcon?: boolean;
};

export default function BottomFab({
  onPress,
  active,
  isLoading,
  cancel,
  grey,
  checkIcon
}: BottomFabProps) {
  return (
    <>
      <Image style={styles.bottom} source={AppImages.images.ovalOrange} />
      {cancel && (
        <Text
          style={[styles.ignore, styles.bottomMarginText]}
          onPress={onPress}
        >
          {I18n.t('app.ignore')}
        </Text>
      )}
      <TouchableRipple
        onPress={
          active && !isLoading
            ? onPress
            : () => {
                return;
              }
        }
        style={[
          styles.fab,
          styles.bottomMargin,
          active ? styles.active : grey ? styles.inactiveGrey : styles.inactive
        ]}
        rippleColor={active ? colors.black : colors.transparent}
      >
        <>
          {!isLoading && (
            <Image
              source={
                active && !checkIcon
                  ? AppImages.images.rightArrowActive
                  : active
                  ? AppImages.images.checkIcon
                  : AppImages.images.rightArrow
              }
              style={active && styles.activeIcon}
            />
          )}
          {isLoading && <ActivityIndicator />}
        </>
      </TouchableRipple>
    </>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.white
  },
  activeIcon: { tintColor: colors.paleOrange },
  bottom: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1
  },
  bottomMargin: { ...ifIphoneX({ bottom: getBottomSpace() }, {}) },
  bottomMarginText: { ...ifIphoneX({ bottom: getBottomSpace() + 20 }, {}) },
  fab: {
    alignItems: 'center',
    borderRadius: 56 / 2,
    bottom: 16,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 25,
    width: 56,
    zIndex: 1
  },
  ignore: {
    bottom: 35,
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    position: 'absolute',
    right: 93,
    width: 56,
    zIndex: 1
  },
  inactive: {
    backgroundColor: colors.black
  },
  inactiveGrey: { backgroundColor: colors.darkGrey }
});
