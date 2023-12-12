import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import I18n from 'i18n-js';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';
import { Restaurant } from 'src/models/restaurants';
import moment from 'moment';
import CustomButton from '../Buttons/CustomButton';
import TouchableIcon from '../Buttons/TouchableIcon';

type ConnectionModalProps = {
  visible: boolean;
  hideModal: () => void;
  onPress: () => void;
};

export default function ConnectionModal({
  visible,
  hideModal,
  onPress
}: ConnectionModalProps) {
  const children = (
    <View style={styles.container}>
      <TouchableIcon
        icon={AppImages.images.closeIcon}
        style={styles.close}
        height={20}
        width={20}
        onPress={hideModal}
      />
      <Text style={styles.title}>{I18n.t('auth.login')}</Text>
      <Text style={styles.subtitle}>{I18n.t('auth.mustConnect')}</Text>
      <CustomButton
        text={I18n.t('basket.connect')}
        onPress={() => {
          hideModal();
          onPress();
        }}
        primary
        outlined
      />
    </View>
  );

  return (
    <Modal
      hideModal={hideModal}
      visible={visible}
      children={children}
      onPress={hideModal}
      cancelable
      noButton
    />
  );
}

const styles = StyleSheet.create({
  close: { position: 'absolute', right: 0, top: 0 },
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 27,
    paddingVertical: 56
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginVertical: 30,

    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    marginHorizontal: 25,
    textAlign: 'center'
  }
});
