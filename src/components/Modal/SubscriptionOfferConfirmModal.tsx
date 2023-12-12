import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'i18n-js';
import LottieView from 'lottie-react-native';
import activeSubscription from 'src/resources/lottie/activeSubscription.json';
import colors from 'src/resources/common/colors';
import { Modal } from './Modal';

type SubscriptionOfferConfirmModalProps = {
  visible: boolean;
  onPress: Function;
  hideModal: () => void;
  date: string | boolean;
};

export function SubscriptionOfferConfirmModal({
  visible,
  onPress,
  hideModal,
  date
}: SubscriptionOfferConfirmModalProps) {
  const children = (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('subscription.congratsPromo')}</Text>
      <Text style={styles.subtitle}>
        {I18n.t('subscription.promoValidated')}
      </Text>
      <Text style={styles.subtitle2}>
        {I18n.t('subscription.promoDate', { date: date })}
      </Text>
    </View>
  );

  return (
    <Modal
      hideModal={hideModal}
      visible={visible}
      children={children}
      onPress={onPress}
      cancelable={false}
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
  subtitle: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 16,
    textAlign: 'center'
  },
  subtitle2: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 77,
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
