import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from 'src/resources/common/colors';
import { TouchableRipple } from 'react-native-paper';
import { onPressFilterAnalytics } from 'src/services/analytics/analytics';

type TagsItemProps = {
  onPress: (thematic: string) => void;
  thematic: string;
  active?: boolean;
};

export default function TagsItem({ onPress, thematic, active }: TagsItemProps) {
  // const [active, setActive] = useState(false);

  function onPressThematic(thematic: string): void {
    if (!active) {
      onPressFilterAnalytics(thematic);
    }
    // setActive(!active);
    onPress(thematic);
  }

  return (
    <TouchableRipple
      style={[styles.container, active && styles.activeCard]}
      onPress={() => {
        onPressThematic(thematic);
      }}
    >
      <Text style={[styles.text, active && styles.activeText]}>{thematic}</Text>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  activeCard: {
    backgroundColor: colors.white
  },
  activeText: { color: colors.black },
  container: {
    borderColor: colors.white40,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  text: {
    color: colors.brownishGrey,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0
  }
});
