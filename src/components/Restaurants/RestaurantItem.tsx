import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ImageBackground, View } from 'react-native';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import { screenWidth } from 'src/utils/constants';
import { Restaurant } from 'models/restaurants';
import { TouchableRipple } from 'react-native-paper';
import { formatOpeningTime } from 'src/utils/TimeHelper';
import Notation from '../Products/Notation';

type RestaurantItemProps = {
  item: Restaurant;
  last?: boolean;
  map?: boolean;
  onPress: () => void;
  selected?: boolean;
};

export default function RestaurantItem({
  item,
  last,
  map,
  onPress,
  selected
}: RestaurantItemProps) {
  const [currentDay, setCurrentDay] = useState<number>();

  useEffect(() => {
    getCurrentDay();
  }, []);

  async function getCurrentDay() {
    setCurrentDay(await new Date().getDay());
  }

  return (
    <TouchableRipple
      style={[!map && styles.shadow, last && styles.last]}
      onPress={onPress}
    >
      <ImageBackground
        style={[
          styles.container,
          !map && styles.shadow,
          map && styles.map,
          selected && styles.selected
        ]}
        source={item.images && item.images[0] && { uri: item.images[0].image }}
        imageStyle={[styles.image, map && styles.mapImage]}
      >
        <View>
          <Text style={[styles.text, styles.name]}>{item.name}</Text>
          <Text style={[styles.text, styles.address]}>{item.readable}</Text>
          <Text style={[styles.text, styles.schedule]}>
            {currentDay && formatOpeningTime(currentDay, item)}
          </Text>
          <View style={styles.row}>
            {item.distance && parseInt(item.distance) <= 5000 && (
              <View style={styles.distContainer}>
                <Text style={styles.distText}>
                  {parseInt(item.distance) >= 1000
                    ? `${parseInt(item.distance) / 1000}km`
                    : `${item.distance}m`}
                </Text>
              </View>
            )}
            {item.average && <Notation notation={item.average} />}
          </View>
        </View>
        {!map && (
          <View>
            <Text style={styles.text}>{item.address_raw.readable}</Text>
          </View>
        )}
      </ImageBackground>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 6, alignItems: 'center' },
  address: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.lightBlack,
    borderRadius: 6,
    height: 184,
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginTop: 24,
    padding: 20,
    width: screenWidth - 50
  },
  distContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginRight: 15,
    opacity: 0.9,
    padding: 6
  },
  distText: {
    color: colors.paleOrange,
    fontFamily: 'GothamBold',
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 14
  },
  image: {
    borderRadius: 6,
    opacity: 0.4
  },
  last: {
    marginBottom: 194
  },
  map: {
    height: 148,
    marginLeft: 0,
    marginRight: 12,
    marginTop: 0,
    width: '100%'
  },
  mapImage: {
    opacity: 0.2
  },
  name: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 6
  },
  schedule: {
    color: colors.white,
    fontFamily: 'Gotham',
    lineHeight: 16
  },
  selected: { borderColor: colors.paleOrange, borderWidth: 2 },
  shadow: Appstyle.shadowExtraBold(colors.black),
  text: {
    color: colors.white80,
    fontFamily: 'GothamBold',
    fontSize: 12,
    letterSpacing: 0.25,
    lineHeight: 14
  }
});
