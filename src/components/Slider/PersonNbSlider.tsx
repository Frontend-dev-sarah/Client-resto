import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';

import colors from 'resources/common/colors';
import { BookingConsumer } from 'src/store/BookingContext';

type PersonNbSliderProps = {
  setPersonNumber?: Function;
  personNumber?: number;
};

function PersonNbSlider({
  setPersonNumber,
  personNumber
}: PersonNbSliderProps) {
  return (
    <Slider
      trackStyle={styles.track}
      containerStyle={styles.slider}
      minimumValue={1}
      maximumValue={20}
      minimumTrackTintColor={colors.paleOrange}
      maximumTrackTintColor={colors.white70}
      thumbTintColor={colors.paleOrange}
      renderThumbComponent={() => (
        <View style={styles.thumb}>
          <Text style={styles.thumbText}>{personNumber}</Text>
        </View>
      )}
      onValueChange={value => {
        setPersonNumber && setPersonNumber(value[0]);
      }}
      step={1}
      value={personNumber}
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 32,
    marginTop: 18
  },
  thumb: {
    alignItems: 'center',
    backgroundColor: colors.paleOrange,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  thumbText: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 20,
    textAlign: 'center'
  },
  track: { borderRadius: 1, height: 2 }
});

export default (props: JSX.IntrinsicAttributes & PersonNbSliderProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <PersonNbSlider
          personNumber={ctx.personNumber}
          setPersonNumber={ctx.setPersonNumber}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
