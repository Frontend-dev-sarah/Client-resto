import I18n from 'i18n-js';
import { Restaurant } from 'src/models/restaurants';
import moment from 'moment';

export function formatOpeningTime(currentDay: number, item: Restaurant) {
  if (currentDay || currentDay === 0) {
    switch (currentDay) {
      case 1:
        if (item.opening_hours_monday) {
          return item.opening_hours_monday.opening_hours[1]
            ? item.opening_hours_monday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_monday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_monday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_monday.opening_hours[1][1]
            : item.opening_hours_monday.opening_hours[0]
            ? item.opening_hours_monday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_monday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 2:
        if (item.opening_hours_tuesday) {
          return item.opening_hours_tuesday.opening_hours[1]
            ? item.opening_hours_tuesday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_tuesday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_tuesday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_tuesday.opening_hours[1][1]
            : item.opening_hours_tuesday.opening_hours[0]
            ? item.opening_hours_tuesday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_tuesday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 3:
        if (item.opening_hours_wednesday) {
          return item.opening_hours_wednesday.opening_hours[1]
            ? item.opening_hours_wednesday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_wednesday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_wednesday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_wednesday.opening_hours[1][1]
            : item.opening_hours_wednesday.opening_hours[0]
            ? item.opening_hours_wednesday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_wednesday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 4:
        if (item.opening_hours_thursday) {
          return item.opening_hours_thursday.opening_hours[1]
            ? item.opening_hours_thursday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_thursday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_thursday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_thursday.opening_hours[1][1]
            : item.opening_hours_thursday.opening_hours[0]
            ? item.opening_hours_thursday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_thursday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 5:
        if (item.opening_hours_friday) {
          return item.opening_hours_friday.opening_hours[1]
            ? item.opening_hours_friday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_friday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_friday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_friday.opening_hours[1][1]
            : item.opening_hours_friday.opening_hours[0]
            ? item.opening_hours_friday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_friday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 6:
        if (item.opening_hours_saturday) {
          return item.opening_hours_saturday.opening_hours[1]
            ? item.opening_hours_saturday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_saturday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_saturday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_saturday.opening_hours[1][1]
            : item.opening_hours_saturday.opening_hours[0]
            ? item.opening_hours_saturday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_saturday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 7:
        if (item.opening_hours_sunday) {
          return item.opening_hours_sunday.opening_hours[1]
            ? item.opening_hours_sunday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_sunday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_sunday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_sunday.opening_hours[1][1]
            : item.opening_hours_sunday.opening_hours[0]
            ? item.opening_hours_sunday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_sunday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      case 0:
        if (item.opening_hours_sunday) {
          return item.opening_hours_sunday.opening_hours[1]
            ? item.opening_hours_sunday.opening_hours[0][0] +
                ' - ' +
                item.opening_hours_sunday.opening_hours[0][1] +
                '  ' +
                item.opening_hours_sunday.opening_hours[1][0] +
                ' - ' +
                item.opening_hours_sunday.opening_hours[1][1]
            : item.opening_hours_sunday.opening_hours[0]
            ? item.opening_hours_sunday.opening_hours[0][0] +
              ' - ' +
              item.opening_hours_sunday.opening_hours[0][1]
            : I18n.t('restaurants.closed');
        }
      default:
        return I18n.t('restaurants.closed');
    }
  }
}

function getHoursBetween(
  initialHours: string[],
  rows: { start: string; end: string }[]
) {
  let res: string[] = [];

  rows.map(row => {
    const startIndex = initialHours.findIndex(
      hour =>
        parseInt(hour.split(':')[0]) >= parseInt(row.start.split(':')[0]) &&
        parseInt(hour.split(':')[1]) >= parseInt(row.start.split(':')[1])
    );
    const EndIndex = [...initialHours]
      .reverse()
      .findIndex(
        hour =>
          parseInt(hour.split(':')[0]) <= parseInt(row.end.split(':')[0]) &&
          parseInt(hour.split(':')[1]) <= parseInt(row.end.split(':')[1])
      );

    res = [
      ...initialHours.slice(startIndex, initialHours.length - EndIndex - 1),
      ...res
    ];
  });
  if (res.length === 0) {
    return initialHours;
  } else return res;
}

export function getOpeningRow(
  currentDay: number,
  initialHours: string[],
  item: Restaurant
) {
  switch (currentDay) {
    case 1:
      if (
        item.opening_hours_monday &&
        item.opening_hours_monday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_monday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 2:
      if (
        item.opening_hours_tuesday &&
        item.opening_hours_tuesday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_tuesday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 3:
      if (
        item.opening_hours_wednesday &&
        item.opening_hours_wednesday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_wednesday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 4:
      if (
        item.opening_hours_thursday &&
        item.opening_hours_thursday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_thursday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 5:
      if (
        item.opening_hours_friday &&
        item.opening_hours_friday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_friday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 6:
      if (
        item.opening_hours_saturday &&
        item.opening_hours_saturday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_saturday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }
    case 0:
      if (
        item.opening_hours_sunday &&
        item.opening_hours_sunday.opening_hours.length > 0
      ) {
        const rows = item.opening_hours_sunday.opening_hours.reduce(
          (res: { start: string; end: string }[], hour) => {
            res.push({ start: hour[0], end: hour[1] });
            return res;
          },
          []
        );
        return getHoursBetween(initialHours, rows);
      } else {
        return [];
      }

    default:
      return [];
  }
}

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export function dateIsPassed(month: number, year: number) {
  const actual = new Date();
  const actualMonth = actual.getMonth() + 1;
  const actualYear =
    year > 99 ? actual.getFullYear() : actual.getFullYear() % 100;

  return (actualMonth > month && actualYear === year) || actualYear > year;
}

export function isRestaurantOpened({
  restaurant
}: {
  restaurant?: Restaurant;
}) {
  if (restaurant) {
    const actualDate = new Date();
    const openingHours = formatOpeningTime(actualDate.getDay(), restaurant);
    // when restaurant has a break during the day
    if (openingHours && openingHours.includes('  ')) {
      const slots = openingHours.split('  ');
      let isOk = false; // we map the slots and if we find an "OK slot", we set isOk at true
      slots.map(slot => {
        const startString = slot.split('-')[0];
        const endString = slot.split('-')[1];
        const startHours = parseInt(startString.split(':')[0]);
        const startMins = parseInt(startString.split(':')[1]);
        const endHours = parseInt(endString.split(':')[0]);
        const endMins = parseInt(endString.split(':')[1]);
        let start = new Date().setHours(startHours);
        start = new Date(start).setMinutes(startMins);
        let end;
        // if the end date is tomorrow
        if (
          endHours < startHours ||
          (endHours === startHours && endMins <= startMins)
        ) {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          end = new Date(date).setHours(23);
          end = new Date(end).setMinutes(59);
        } else {
          end = new Date().setHours(endHours);
          end = new Date(end).setMinutes(endMins);
        }
        if (
          moment(new Date(start)).isBefore(actualDate) &&
          moment(new Date(end)).isAfter(actualDate)
        ) {
          isOk = true;
        }
      });
      return isOk;
    } else if (openingHours) {
      const startString = openingHours.split('-')[0];
      const endString = openingHours.split('-')[1];
      const startHours = parseInt(startString.split(':')[0]);
      const startMins = parseInt(startString.split(':')[1]);
      const endHours = parseInt(endString.split(':')[0]);
      const endMins = parseInt(endString.split(':')[1]);
      let start = new Date().setHours(startHours);
      start = new Date(start).setMinutes(startMins);
      let end;
      // if the end date is tomorrow
      if (
        endHours < startHours ||
        (endHours === startHours && endMins <= startMins)
      ) {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        end = new Date(date).setHours(23);
        end = new Date(end).setMinutes(59);
      } else {
        end = new Date().setHours(endHours);
        end = new Date(end).setMinutes(endMins);
      }
      if (
        moment(new Date(start)).isBefore(actualDate) &&
        moment(new Date(end)).isAfter(actualDate)
      ) {
        return true;
      }
    }
    return false;
  } else {
    // if no restaurant return true
    return true;
  }
}
