import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from 'src/resources/common/colors';
import { TouchableRipple } from 'react-native-paper';
import { ambiancesList } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';

type AmbianceSelectorProps = {
  ambiance?: string;
  setAmbiance?: Function;
};

function AmbianceSelector({ ambiance, setAmbiance }: AmbianceSelectorProps) {
  function renderItem(item: string) {
    return (
      <TouchableRipple
        style={[styles.card, ambiance === item && styles.selected]}
        onPress={() => setAmbiance && setAmbiance(item)}
      >
        <Text style={[styles.text, ambiance === item && styles.selectedText]}>
          {item}
        </Text>
      </TouchableRipple>
    );
  }

  return (
    <View style={styles.rowItems}>
      {ambiancesList.map(val => renderItem(val))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.white40,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginBottom: 12,
    marginRight: 16,
    paddingHorizontal: 12
  },

  rowItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginTop: 23
  },
  selected: {
    backgroundColor: colors.white
  },
  selectedText: { color: colors.paleOrange },
  text: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.8,
    lineHeight: 20
  }
});

export default (props: JSX.IntrinsicAttributes & AmbianceSelectorProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <AmbianceSelector
          ambiance={ctx.ambiance}
          setAmbiance={ctx.setAmbiance}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
