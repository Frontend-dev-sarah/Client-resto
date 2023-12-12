import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import { screenWidth } from 'src/utils/constants';
import { navigatorRef } from 'src/navigation/RootNavigator';
import { BookingConsumer } from 'src/store/BookingContext';
import TableMenu from './TableMenu';

type ModalOrderHeaderProps = {
  setPlaceChoice?: Function;
  setModalHeight?: Function;
  setRestauAlreadySet?: Function;
};

function ModalOrderHeader({
  setPlaceChoice,
  setModalHeight,
  setRestauAlreadySet
}: ModalOrderHeaderProps) {
  return (
    <View
      onLayout={event => {
        setModalHeight && setModalHeight(event.nativeEvent.layout.height);
      }}
      // style={{ backgroundColor: colors.deepRose, marginTop: -29 }}
    >
      <TouchableRipple
        style={styles.closeContainer}
        onPress={() => {
          setPlaceChoice && setPlaceChoice();
          setRestauAlreadySet && setRestauAlreadySet(false);
          navigatorRef.current.navigate('BottomTab');
        }}
      >
        <Image source={AppImages.images.cross} style={styles.crossIcon} />
      </TouchableRipple>
      <View style={styles.separator} />
      <TableMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  closeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.black,
    borderColor: colors.white40,
    borderRadius: 29,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    marginBottom: -29,
    width: 58,
    zIndex: 2
  },
  crossIcon: {
    height: 20,
    width: 20
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: colors.white40,
    height: 1,
    width: screenWidth - 50,
    zIndex: 1
  }
});

export default (props: JSX.IntrinsicAttributes & ModalOrderHeaderProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <ModalOrderHeader
          setPlaceChoice={ctx.setPlaceChoice}
          setModalHeight={ctx.setModalHeight}
          setRestauAlreadySet={ctx.setRestauAlreadySet}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
