import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import 'moment/locale/fr';
import { TouchableRipple } from 'react-native-paper';

import colors from 'resources/common/colors';
import { BookingConsumer } from 'src/store/BookingContext';
import { hours, takeAwayHours } from 'src/utils/constants';
import I18n from 'resources/localization/I18n';
import restaurantApi from 'src/services/restaurant/restaurantApi';
import { Restaurant, PlaceChoice, Slot } from 'src/models/restaurants';
import moment from 'moment';
import { datesAreOnSameDay, getOpeningRow } from 'src/utils/TimeHelper';

type HourSelectorProps = {
  setSelectedHour?: Function;
  selectedHour?: string;
  selectedDate?: Date;
  restauAlreadySet?: boolean;
  selectedRestaurant?: Restaurant;
  personNumber?: number;
  placeChoice?: PlaceChoice;
};

function HourSelector({
  setSelectedHour,
  selectedHour,
  selectedDate,
  restauAlreadySet,
  selectedRestaurant,
  personNumber,
  placeChoice
}: HourSelectorProps) {
  const [todayHours, setTodayHours] = useState<string[]>();
  const [availableHours, setAvailableHours] = useState<string[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [takeAwayClosedSlots, setTakeAwayClosedSlots] = useState<Slot[]>([]);

  const displayHours =
    placeChoice && placeChoice === 'takeAway' ? hours : hours;

  useEffect(() => {
    getTodayHours();
    restauAlreadySet && getAvailability();
    setSelectedHour && setSelectedHour();
  }, []);

  useEffect(() => {
    if (restauAlreadySet && placeChoice) {
      getAvailability();
      setSelectedHour && setSelectedHour();
      restauAlreadySet && selectedRestaurant && getTakeAwayClosedSlots();
    }
    if (placeChoice) {
      getTodayHours();
    }
  }, [selectedDate, personNumber, placeChoice]);

  async function getAvailability() {
    setIsLoading(true);
    if (selectedRestaurant && personNumber && placeChoice === 'bookOnSite') {
      const res = await restaurantApi.getRestaurantAvailability(
        selectedRestaurant.id,
        moment(selectedDate).format('DD-MM-YYYY'),
        personNumber
      );
      if (res && !res.error) {
        const rows = await res.reduce(
          (res: string[], hour: { slot: string; availability: boolean }) => {
            if (hour.availability) {
              res.push(hour.slot);
            }
            return res;
          },
          []
        );
        setAvailableHours(rows);
      }
    } else if (placeChoice === 'takeAway') {
      const row =
        selectedRestaurant &&
        selectedDate &&
        getOpeningRow(
          new Date(selectedDate).getDay(),
          displayHours,
          selectedRestaurant
        );
      row && setAvailableHours(row);
    }
    setIsLoading(false);
  }

  function getTodayHours() {
    let index = -1;
    const initialHours = [...displayHours];
    const actual = new Date();
    const h = actual.getHours();
    const min = actual.getMinutes();
    for (let i = 0; i < displayHours.length; i++) {
      if (
        index === -1 &&
        (parseInt(initialHours[i].split(':')[0]) > h ||
          (parseInt(initialHours[i].split(':')[0]) === h &&
            parseInt(initialHours[i].split(':')[1]) >= min))
      ) {
        index = i;
      }
    }
    index !== -1 &&
      setTodayHours(initialHours.slice(index, displayHours.length));
  }
  async function getTakeAwayClosedSlots() {
    const res =
      selectedRestaurant &&
      (await restaurantApi.getTakeAwayClosedSlots(selectedRestaurant.id));
    if (res && !res.error) {
      setTakeAwayClosedSlots(res);
    }
  }

  function renderItem(hour: string) {
    const disable =
      (restauAlreadySet &&
        availableHours &&
        availableHours.indexOf(hour) === -1) ||
      isLoading ||
      (restauAlreadySet &&
        placeChoice === 'takeAway' &&
        takeAwayClosedSlots.findIndex(
          slot =>
            new Date(slot.schedule_start).getHours() ===
              parseInt(hour.split(':')[0]) &&
            new Date(slot.schedule_start).getMinutes() ===
              parseInt(hour.split(':')[1])
        ) !== -1);

    return (
      <TouchableRipple
        style={[
          styles.item,
          selectedHour === hour && styles.activeBg,
          disable && styles.notAvailable
        ]}
        onPress={() => {
          setSelectedHour && !disable && setSelectedHour(hour);
        }}
      >
        <Text
          style={[
            styles.text,
            selectedHour === hour && styles.activeText,
            disable && styles.notAvailableText
          ]}
        >
          {hour}
        </Text>
      </TouchableRipple>
    );
  }

  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={
          selectedDate && datesAreOnSameDay(new Date(selectedDate), new Date())
            ? todayHours
            : displayHours
        }
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={styles.flatlist}
        keyExtractor={item => item}
        ListEmptyComponent={
          <Text style={styles.noHours}>{I18n.t('booking.noHours')}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activeBg: {
    backgroundColor: colors.white
  },
  activeText: {
    color: colors.paleOrange
  },
  flatlist: {
    marginBottom: 12,
    marginTop: 12,
    paddingLeft: 12
  },
  item: {
    alignItems: 'center',
    borderColor: colors.white40,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    paddingHorizontal: 10
  },
  noHours: {
    color: colors.white60,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  },
  notAvailable: {
    backgroundColor: colors.lightBlack,
    borderColor: colors.black60
  },
  notAvailableText: {
    color: colors.white40
  },
  text: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & HourSelectorProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <HourSelector
          setSelectedHour={ctx.setSelectedHour}
          selectedHour={ctx.selectedHour}
          selectedDate={ctx.selectedDate}
          restauAlreadySet={ctx.restauAlreadySet}
          personNumber={ctx.personNumber}
          selectedRestaurant={ctx.selectedRestaurant}
          placeChoice={ctx.placeChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
