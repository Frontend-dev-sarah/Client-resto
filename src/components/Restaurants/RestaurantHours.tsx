import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { Restaurant } from 'src/models/restaurants';
import colors from 'src/resources/common/colors';
import { formatOpeningTime } from 'src/utils/TimeHelper';
import { IconButton } from 'react-native-paper';
import moment from 'moment';

type RestaurantHoursProps = {
  restaurant: Restaurant;
};

export default function RestaurantHours({ restaurant }: RestaurantHoursProps) {
  const [currentDay, setCurrentDay] = useState<number>();
  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    getCurrentDay();
  }, []);

  async function getCurrentDay() {
    setCurrentDay(await new Date().getDay());
  }

  function renderDayRow(day: string) {
    return (
      <View style={[styles.dayRow]}>
        <Text style={styles.time}>{`${day} : `}</Text>
        <Text style={styles.time}>
          {formatOpeningTime(
            (moment.localeData('fr').weekdays() &&
              moment
                .localeData('fr')
                .weekdays()
                .indexOf(day)) ||
              0,
            restaurant
          )}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.time} onPress={() => setOpened(!opened)}>
          {formatOpeningTime(currentDay || 0, restaurant)}
        </Text>
        <IconButton
          icon={!opened ? 'chevron-down' : 'chevron-up'}
          color={colors.white}
          size={25}
          onPress={() => setOpened(!opened)}
        />
      </View>
      {opened && (
        <FlatList
          data={moment.localeData('fr').weekdays()}
          renderItem={({ item }) => renderDayRow(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dayRow: {
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  container: {
    marginBottom: 20
  }
});
