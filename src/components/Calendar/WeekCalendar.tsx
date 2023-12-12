import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import 'moment/locale/fr';
import { endOfWeek, startOfWeek } from 'date-fns';

import AppImages from 'resources/common/AppImages';
import colors from 'resources/common/colors';
import { BookingConsumer } from 'src/store/BookingContext';

type WeekCalendarProps = {
  setSelectedDate?: Function;
};

function WeekCalendar({ setSelectedDate }: WeekCalendarProps) {
  return (
    <CalendarStrip
      minDate={new Date()}
      maxDate={endOfWeek(new Date(), { weekStartsOn: 1 })}
      datesBlacklist={[
        {
          start: startOfWeek(new Date()),
          end: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
        }
      ]}
      disabledDateNumberStyle={styles.disabledNumber}
      daySelectionAnimation={{
        type: 'background',
        duration: 200,
        borderWidth: 1,
        highlightColor: colors.white
      }}
      style={styles.container}
      calendarHeaderStyle={styles.header}
      dateNumberStyle={styles.number}
      dateNameStyle={{ color: colors.white80 }}
      highlightDateNumberStyle={[styles.number, styles.activeNumber]}
      highlightDateNameStyle={{ color: colors.paleOrange }}
      locale={{ name: 'fr', config: 'fr' }}
      markedDates={[
        {
          date: new Date(),
          dots: [
            {
              key: 1,
              color: colors.paleOrange50
            }
          ]
        }
      ]}
      // leftSelector={
      //   <View style={styles.arrowView}>
      //     <Image source={AppImages.images.arrowLeft} style={styles.arrow} />
      //   </View>
      // }
      // rightSelector={
      //   <View style={styles.arrowView}>
      //     <Image source={AppImages.images.arrowRight} style={styles.arrow} />
      //   </View>
      // }
      onDateSelected={date => setSelectedDate && setSelectedDate(date)}
    />
  );
}

const styles = StyleSheet.create({
  activeNumber: { color: colors.paleOrange },
  // arrow: {
  //   height: 16,
  //   marginBottom: 75,
  //   tintColor: colors.lightGrey,
  //   width: 16
  // },
  // arrowView: {
  //   padding: 10
  // },
  container: {
    height: 90,
    marginBottom: 32,
    marginTop: 12
  },
  disabledNumber: {
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  },
  header: { color: colors.white, marginBottom: 15 },
  number: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & WeekCalendarProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && <WeekCalendar setSelectedDate={ctx.setSelectedDate} {...props} />
    }
  </BookingConsumer>
);
