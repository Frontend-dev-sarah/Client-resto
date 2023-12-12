import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'src/resources/common/colors';

import splashgif from 'src/resources/lottie/splashgif.gif';
import RoutesNames from 'src/navigation/RoutesNames';

type SplashScreenProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(RoutesNames.BottomTab);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image resizeMode="contain" style={styles.img} source={splashgif} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.black,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  img: {
    width: '100%'
  }
});
