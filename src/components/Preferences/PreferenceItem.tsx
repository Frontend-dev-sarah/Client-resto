import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import colors from 'resources/common/colors';
import Appstyle from 'resources/common/Appstyle';
import TouchableIcon from '../Buttons/TouchableIcon';
import { screenWidth } from 'src/utils/constants';
import { TouchableHighlight } from 'react-native-gesture-handler';

type PreferenceItemProps = {
  switchItemState: Function;
  id: string;
  name: string;
  icon: string;
  allergy?: boolean;
  initialSelected: boolean;
};

export default function PreferenceItem({
  switchItemState,
  id,
  name,
  icon,
  allergy,
  initialSelected
}: PreferenceItemProps) {
  const [selected, setSelected] = useState(initialSelected);

  function toggleItemState() {
    setSelected(prevState => {
      switchItemState(id, allergy);
      return !prevState;
    });
  }

  return (
    <TouchableHighlight style={styles.container} onPress={toggleItemState}>
      <>
        <TouchableIcon
          color={colors.white}
          icon={{
            uri: icon
          }}
          width={32}
          height={32}
          style={[
            styles.icon,
            selected && styles.selected,
            selected && styles.shadow
          ]}
        />
        <Text style={[styles.text, selected && styles.textSelected]}>
          {name}
        </Text>
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    marginBottom: 24,
    width: screenWidth / 3 - 20
  },
  icon: {
    backgroundColor: colors.white10,
    borderRadius: 24,
    height: 48,
    marginBottom: 8,
    width: 48
  },
  selected: {
    borderColor: colors.paleOrange,
    borderStyle: 'solid',
    borderWidth: 1
  },
  shadow: Appstyle.shadow(colors.paleOrange),
  text: {
    color: colors.white40,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    textAlign: 'center'
  },
  textSelected: { color: colors.white }
});
