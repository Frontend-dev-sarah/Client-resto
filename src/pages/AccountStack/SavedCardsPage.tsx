import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import colors from 'resources/common/colors';
import Header from 'src/components/Headers/Header';
import I18n from 'resources/localization/I18n';
import CardsList from 'src/components/Payment/CardsList';
import { TouchableRipple } from 'react-native-paper';
import RoutesNames from 'src/navigation/RoutesNames';

type SavedCardsPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default function SavedCardsPage({ navigation }: SavedCardsPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  async function onPressAddCard() {
    navigation.navigate(RoutesNames.PaymentModalNavigator, {
      screen: RoutesNames.AddPaymentMethodPage,
      params: { addingCard: true, fromBasket: false }
    });
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      setReload(true);
    });
  }, [navigation]);

  return (
    <>
      <Header backIcon navigation={navigation} isLoading={isLoading} />
      <View style={styles.paddingView}>
        <Text style={styles.title}>{I18n.t('savedCards.savedCards')}</Text>
      </View>
      <CardsList
        blockBack={setIsLoading}
        reload={reload}
        setReload={setReload}
      />
      <TouchableRipple style={styles.bottom} onPress={onPressAddCard}>
        <Text style={styles.bottomText}>{I18n.t('savedCards.addPayment')}</Text>
      </TouchableRipple>
    </>
  );
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: colors.black,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 'auto'
  },
  bottomText: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    paddingVertical: 36,
    textAlign: 'center'
  },
  paddingView: { paddingHorizontal: 25, paddingTop: 16 },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40
  }
});
