import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'i18n-js';
import LottieView from 'lottie-react-native';
import activeSubscription from 'src/resources/lottie/activeSubscription.json';
import colors from 'src/resources/common/colors';
import { Modal } from './Modal';

type SubscriptionConfirModalProps = {
  visible: boolean;
  onPress: Function;
  cancelable?: boolean;
  hideModal: () => void;
};

export function SubscriptionConfirModal({
  visible,
  onPress,
  cancelable,
  hideModal
}: SubscriptionConfirModalProps) {
  const children = (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('subscription.congrats')}</Text>
      <Text style={styles.subtitle}>
        {I18n.t('subscription.waitingRestaurants')}
      </Text>
      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          source={activeSubscription}
          hardwareAccelerationAndroid
          autoPlay
          loop={false}
        />
      </View>
    </View>
  );

  return (
    <Modal
      hideModal={hideModal}
      visible={visible}
      children={children}
      onPress={onPress}
      cancelable={cancelable}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 27,
    paddingTop: 32
  },
  lottie: {
    height: 128,
    width: 128
  },
  lottieContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
    width: '100%'
  },
  subtitle: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 77,
    marginTop: 16,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 26,
    textAlign: 'center'
  }
});
