import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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

import WeekCalendar from 'src/components/Calendar/WeekCalendar';
import HourSelector from 'src/components/Calendar/HourSelector';
import { BookingConsumer } from 'src/store/BookingContext';
import { PlaceChoice } from 'src/models/restaurants';
import PersonNumberSelector from 'src/components/Slider/PersonNumberSelector';
import { DistrictConsumer } from 'src/store/DistrictContext';

type ChooseDatePageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  selectedDate: Date;
  setSelectedHour: Function;
  selectedHour: string;
  placeChoice: PlaceChoice;
  restauAlreadySet: boolean;
  setFiltered: Function;
  getRestaurants: Function;
};

function ChooseDatePage({
  navigation,
  selectedDate,
  selectedHour,
  setSelectedHour,
  placeChoice,
  setFiltered,
  restauAlreadySet,
  getRestaurants
}: ChooseDatePageProps) {
  useEffect(() => {
    setSelectedHour();
    setFiltered(true);
  }, []);

  return (
    <>
      <ScrollView>
        <View style={styles.paddingView}>
          {restauAlreadySet && placeChoice === 'bookOnSite' && (
            <>
              <Text style={styles.title}>{I18n.t('booking.personNumber')}</Text>
              <PersonNumberSelector />
            </>
          )}
          <Text style={styles.title}>{I18n.t('booking.date')}</Text>
          <WeekCalendar />
          <Text style={styles.title}>{I18n.t('booking.hour')}</Text>
        </View>
        <HourSelector />
      </ScrollView>
      <BorderedRadiusButton
        primary
        inactive={!(selectedDate && selectedHour)}
        onPress={async () => {
          getRestaurants && getRestaurants(); // get again restaurants before display other page to be sure we cannot select unavailable one
          if (placeChoice === 'takeAway' && !restauAlreadySet) {
            navigation.navigate(RoutesNames.ChooseRestaurantPage);
          } else if (!restauAlreadySet) {
            navigation.navigate(RoutesNames.ChooseNumberPersonsPage);
          } else {
            await navigation.navigate(RoutesNames.RestaurantsStack);
            navigation.navigate(RoutesNames.RestaurantsStack, {
              screen: RoutesNames.CardPage,
              params: { simpleCard: false }
            });
          }
        }}
        text={I18n.t('app.next')}
        borderTopLeft
        customStyle={styles.bottomButton}
        bottom
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomButton: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
    width: '75%',
    ...ifIphoneX(
      { paddingBottom: getBottomSpace(), height: 74 + getBottomSpace() },
      {}
    )
  },
  paddingView: {
    paddingHorizontal: 25,
    paddingTop: 32
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  }
});

export default (props: JSX.IntrinsicAttributes & ChooseDatePageProps) => (
  <BookingConsumer>
    {ctx => (
      <DistrictConsumer>
        {districtCtx =>
          ctx &&
          districtCtx && (
            <ChooseDatePage
              selectedDate={ctx.selectedDate}
              selectedHour={ctx.selectedHour}
              setSelectedHour={ctx.setSelectedHour}
              placeChoice={ctx.placeChoice}
              restauAlreadySet={ctx.restauAlreadySet}
              setFiltered={districtCtx.setFiltered}
              getRestaurants={districtCtx.getRestaurants}
              {...props}
            />
          )
        }
      </DistrictConsumer>
    )}
  </BookingConsumer>
);
