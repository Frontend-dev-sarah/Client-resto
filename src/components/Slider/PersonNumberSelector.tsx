import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import colors from 'resources/common/colors';
import { BookingConsumer } from 'src/store/BookingContext';
import { TouchableRipple } from 'react-native-paper';
import AppImages from 'src/resources/common/AppImages';

type PersonNumberSelectorProps = {
  setPersonNumber?: Function;
  personNumber?: number;
};

function PersonNumberSelector({
  setPersonNumber,
  personNumber
}: PersonNumberSelectorProps) {
  async function add() {
    setPersonNumber &&
      personNumber &&
      (await setPersonNumber(personNumber + 1));
  }

  async function del() {
    setPersonNumber &&
      personNumber &&
      personNumber > 1 &&
      (await setPersonNumber(personNumber - 1));
  }

  return (
    <View style={styles.row}>
      <View style={styles.whiteContainer}>
        <Text style={styles.number}>{personNumber}</Text>
        <TouchableRipple style={styles.more} onPress={add}>
          <Image source={AppImages.images.plusIcon} style={styles.img} />
        </TouchableRipple>
      </View>
      <TouchableRipple
        onPress={del}
        style={[
          styles.less,
          personNumber ? personNumber <= 1 && styles.inactive : {}
        ]}
      >
        <Image
          source={AppImages.images.lessIcon}
          style={[
            styles.img,
            personNumber ? personNumber <= 1 && styles.inactiveIcon : {}
          ]}
        />
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 16,
    width: 16
  },
  inactive: { borderColor: colors.black60 },
  inactiveIcon: { tintColor: colors.black60 },
  less: {
    borderColor: colors.white40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 10,
    padding: 12
  },
  more: {
    borderRadius: 20,
    padding: 12
  },
  number: {
    color: colors.paleOrange,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 20,
    marginRight: 25
  },
  row: { flexDirection: 'row', marginBottom: 32, marginTop: 12 },
  whiteContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    paddingLeft: 16
  }
});

export default (props: JSX.IntrinsicAttributes & PersonNumberSelectorProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <PersonNumberSelector
          personNumber={ctx.personNumber}
          setPersonNumber={ctx.setPersonNumber}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
