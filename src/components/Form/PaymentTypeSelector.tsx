import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple, RadioButton } from 'react-native-paper';
import I18n from 'resources/localization/I18n';

import colors from 'src/resources/common/colors';
import { screenWidth, PAYMENT_TYPES } from 'src/utils/constants';
import { PaymentType } from 'src/models/payment';

type PaymentTypeSelectorProps = {
  paymentType: string;
  setPaymentType: Function;
};

export default function PaymentTypeSelector({
  paymentType,
  setPaymentType
}: PaymentTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{I18n.t('payment.type')}</Text>

      {PAYMENT_TYPES.map((type: PaymentType) => {
        return (
          <TouchableRipple
            onPress={() => setPaymentType(type)}
            style={styles.choiceContainer}
          >
            <>
              <RadioButton.Android
                value={type.value}
                status={paymentType === type.value ? 'checked' : 'unchecked'}
                onPress={() => setPaymentType(type)}
                color={colors.white}
                uncheckedColor={colors.white80}
              />
              <Text style={styles.text}>{type.value}</Text>
            </>
          </TouchableRipple>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  choiceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: (screenWidth - 100) / 3
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginHorizontal: 25
  },
  text: {
    color: colors.white80,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14
  }
});
