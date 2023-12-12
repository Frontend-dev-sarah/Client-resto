import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from 'resources/common/colors';

type NotationProps = {
  notation: number;
  containerStyle?: object;
  size?: number;
  onChange?: Function;
};

export default function Notation({
  notation,
  containerStyle,
  size,
  onChange
}: NotationProps): JSX.Element {
  const [roundNote, setRoundNote] = useState(Math.round(notation * 2) * 0.5);

  useEffect(() => {
    setRoundNote(Math.round(notation * 2) * 0.5);
  }, [notation]);

  const images: JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    Math.floor(roundNote) > i
      ? images.push(
          <MaterialCommunityIcons
            name="heart"
            color={'white'}
            size={size || 14}
            style={styles.image}
            onPress={() => onChange && onChange(i + 1)}
          />
        )
      : roundNote >= i + 0.5
      ? images.push(
          <MaterialCommunityIcons
            name="heart-half-full"
            color={'white'}
            size={size || 14}
            style={styles.image}
          />
        )
      : images.push(
          <MaterialCommunityIcons
            name="heart-outline"
            color={colors.white60}
            size={size || 14}
            style={styles.image}
            onPress={() => onChange && onChange(i + 1)}
          />
        );
  }
  return <View style={[styles.notation, containerStyle]}>{images}</View>;
}

const styles = StyleSheet.create({
  image: {
    marginRight: 2
  },
  notation: {
    flexDirection: 'row'
  }
});
