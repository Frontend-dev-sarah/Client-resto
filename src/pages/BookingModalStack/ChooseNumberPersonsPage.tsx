/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import RoutesNames from 'src/navigation/RoutesNames';
import {
  NavigationScreenProp,
  NavigationParams,
  NavigationState
} from 'react-navigation';
import BorderedRadiusButton from 'src/components/Buttons/BorderedRadiusButton';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { BookingConsumer } from 'src/store/BookingContext';
import AppImages from 'src/resources/common/AppImages';
import Appstyle from 'src/resources/common/Appstyle';
import PersonNbSlider from 'src/components/Slider/PersonNbSlider';

type ChooseNumberPersonsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  restauAlreadySet: boolean;
};

function ChooseNumberPersonsPage({
  navigation,
  restauAlreadySet
}: ChooseNumberPersonsPageProps) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('booking.personNumber')}</Text>
        <PersonNbSlider />
        {/* <Text style={styles.title}>{I18n.t('booking.ambiance')}</Text>
        <AmbianceSelector /> */}
      </View>
      <View style={[styles.bottomView]}>
        <BorderedRadiusButton
          onPress={() => {
            navigation.goBack();
          }}
          borderTopRight
          customStyle={[styles.backButton, styles.shadow]}
          icon={AppImages.images.backIcon}
          bottom
        />
        <BorderedRadiusButton
          primary
          onPress={async () => {
            if (restauAlreadySet) {
              await navigation.navigate(RoutesNames.RestaurantsStack);
              navigation.navigate(RoutesNames.RestaurantsStack, {
                screen: RoutesNames.CardPage,
                params: { simpleCard: false }
              });
            } else {
              navigation.navigate(RoutesNames.ChooseRestaurantPage);
            }
          }}
          text={I18n.t('app.next')}
          borderTopLeft
          customStyle={[styles.bottomButton, styles.shadow]}
          bottom
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    width: '30%',
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 74 + getBottomSpace() },
      {}
    ),
    flex: 0.5
  },

  bottomButton: {
    alignSelf: 'flex-end',
    flex: 1,
    width: '75%',
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 74 + getBottomSpace() },
      {}
    )
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 'auto'
  },
  container: {
    height: '100%',
    paddingHorizontal: 25,
    paddingTop: 32
  },
  shadow: Appstyle.shadowExtraBold(),
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  }
});

export default (
  props: JSX.IntrinsicAttributes & ChooseNumberPersonsPageProps
) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <ChooseNumberPersonsPage
          restauAlreadySet={ctx.restauAlreadySet}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
