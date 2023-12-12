import React from 'react';
import { StyleSheet, Text, View, TextStyle, StyleProp } from 'react-native';
import Constants from 'expo-constants';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'resources/common/colors';
import TouchableIcon from 'components/Buttons/TouchableIcon';
import AppImages from 'resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';

type HeaderProps = {
  backIcon?: boolean;
  closeIcon?: boolean;
  title?: string;
  subtitle?: string;
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
  modal: boolean;
  showSeparator?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  black?: boolean;
  onGoBack?: Function;
  isLoading?: boolean;
};

function Header({
  backIcon,
  closeIcon,
  title,
  subtitle,
  navigation,
  modal,
  showSeparator,
  titleStyle,
  black,
  onGoBack,
  isLoading
}: HeaderProps & NavigationInjectedProps) {
  function goBack() {
    if (!isLoading) {
      if (onGoBack) {
        onGoBack();
      } else {
        navigation.goBack();
      }
    }
  }

  return (
    <>
      <View
        style={[
          styles.topBar,
          modal && styles.modal,
          modal && !backIcon && !closeIcon && styles.littlePadding,
          black && styles.black
        ]}
      >
        {backIcon && (
          <TouchableIcon
            icon={AppImages.images.backIcon}
            onPress={goBack}
            height={16}
            width={12}
            style={styles.backIcon}
          />
        )}
        {closeIcon && (
          <TouchableIcon
            icon={AppImages.images.closeIcon}
            onPress={goBack}
            width={20}
            height={20}
            style={styles.backIcon}
          />
        )}
        {!backIcon && !closeIcon && (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={[styles.backIcon, { height: 56 }]} />
        )}
        <View style={styles.titleContainer}>
          {title && (
            <Text style={[styles.title, titleStyle && titleStyle]}>
              {title}
            </Text>
          )}
          {subtitle && <Text style={[styles.subtitle]}>{subtitle}</Text>}
        </View>
        {showSeparator && <View style={styles.separator} />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    marginRight: 'auto'
  },
  black: {
    backgroundColor: colors.black
  },
  littlePadding: {
    paddingTop: 12
  },
  modal: {
    backgroundColor: colors.darkGrey,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  separator: {
    borderColor: colors.white40,
    borderStyle: 'solid',
    borderWidth: 1,
    bottom: 0,
    height: 1,
    left: 25,
    position: 'absolute',
    width: screenWidth - 50
  },
  subtitle: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    flex: 1,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 16,
    marginBottom: 6,
    textAlign: 'center'
  },
  titleContainer: {
    flex: 1,
    position: 'absolute',
    width: screenWidth - 150
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: Constants.statusBarHeight,
    width: '100%'
  }
});

export default withNavigation(Header);
