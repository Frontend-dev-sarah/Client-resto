import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  AsyncStorage
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import Swiper from 'react-native-swiper';

import colors from 'src/resources/common/colors';
import AppImages from 'src/resources/common/AppImages';
import I18n from 'resources/localization/I18n';
import TouchableIcon from 'src/components/Buttons/TouchableIcon';
import TouchableText from 'src/components/Buttons/TouchableText';
import StorageKeys from 'src/utils/StorageKeys';
import { AuthConsumer } from 'src/store/AuthContext';
import { screenHeight } from 'src/utils/constants';
import Appstyle from 'src/resources/common/Appstyle';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';

type OnBoardingData = {
  title: string;
  subtitle: string;
};
type OnboardingPageProps = {
  setShowOnBoarding: Function;
};

function OnboardingPage({ setShowOnBoarding }: OnboardingPageProps) {
  let CarouselRef = useRef();
  const onBoardingData: OnBoardingData[] = [
    {
      title: I18n.t('onBoarding.title'),
      subtitle: I18n.t('onBoarding.sub')
    },
    {
      title: I18n.t('onBoarding.title2'),
      subtitle: I18n.t('onBoarding.sub2')
    },
    {
      title: I18n.t('onBoarding.title3'),
      subtitle: I18n.t('onBoarding.sub3')
    }
  ];

  async function setStorage() {
    await AsyncStorage.setItem(StorageKeys.firstUse, 'false');
  }

  function onPressNext() {
    if (CarouselRef.state.index !== 2) {
      CarouselRef.scrollBy(1);
    } else {
      onPressIgnore();
    }
  }

  function onPressIgnore() {
    setStorage();
    setShowOnBoarding(false);
    navigatorRef.current.navigate(RoutesNames.PaymentModalNavigator, {
      screen: RoutesNames.LoginPage
    });
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={[styles.background]}
        source={AppImages.images.bgOnboarding}
        imageStyle={[styles.background]}
      >
        <Swiper
          ref={ref => {
            CarouselRef = ref;
          }}
          containerStyle={styles.popup}
          showsButtons={false}
          loop={false}
          dotStyle={styles.inactiveDot}
          activeDotStyle={styles.activeDot}
          removeClippedSubviews={false}
        >
          {onBoardingData.map(data => {
            return (
              <>
                {/* eslint-disable-next-line react-native/no-inline-styles */}
                <View style={{ alignItems: 'center' }}>
                  <Image source={AppImages.images.logo} />
                </View>
                <View style={styles.carousel}>
                  <Text style={styles.title}>{data.title}</Text>
                  <Text style={styles.text}>{data.subtitle}</Text>
                </View>
              </>
            );
          })}
        </Swiper>

        <TouchableIcon
          icon={AppImages.images.rightArrowActive}
          height={20}
          width={20}
          style={styles.button}
          onPress={() => onPressNext()}
          color={colors.white}
        />
        <TouchableText
          text={I18n.t('app.ignore')}
          containerStyle={styles.ignoreContainer}
          textStyle={styles.ignore}
          onPress={onPressIgnore}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 4,
    width: 12
  },
  background: { flex: 1, height: '100%', width: '100%' },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: colors.paleOrange,
    borderRadius: 28,
    height: 56,
    marginRight: 90,
    marginTop: -28,
    width: 56
  },
  carousel: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
    paddingHorizontal: 25
  },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  ignore: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    textAlign: 'center'
  },
  ignoreContainer: {
    marginTop: 'auto',
    marginBottom: Appstyle.marginBottomIPhoneX
  },
  inactiveDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 4,
    width: 4
  },
  popup: {
    alignItems: 'center',
    backgroundColor: colors.black60,
    borderRadius: 32,
    flex: 0,
    height: 470,
    justifyContent: 'center',
    marginHorizontal: 50,
    marginTop: 50,
    paddingTop: 30
  },
  text: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 24,
    marginVertical: 16,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes) => (
  <AuthConsumer>
    {ctx =>
      ctx && (
        <OnboardingPage setShowOnBoarding={ctx.setShowOnBoarding} {...props} />
      )
    }
  </AuthConsumer>
);
