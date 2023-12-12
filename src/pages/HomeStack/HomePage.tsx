import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

import { AuthConsumer } from 'store/AuthContext';
import { UserData } from 'models/user';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import DropDownHeader from 'src/components/Headers/DropDownHeader';
import I18n from 'resources/localization/I18n';
import CardSuggestions from 'src/components/Menu/CardSuggestions';
import CommandConfirmModal from 'src/components/Modal/CommandConfirmModal';
import { HomeStackParamList } from 'src/navigation/HomeStack';
import { RouteProp } from '@react-navigation/native';
import { orderIsLoading } from 'src/navigation/CustomLinking';
import BookingConfirmModal from 'src/components/Modal/BookingConfirmModal';
import TableMenu from 'src/components/BottomTab/TableMenu';
import { BookingConsumer } from 'src/store/BookingContext';
import { PlaceChoice } from 'src/models/restaurants';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';

type HomePageRouteProp = RouteProp<HomeStackParamList, 'HomePage'>;

type HomePageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  user: UserData;
  route: HomePageRouteProp;
  setPlaceChoice: Function;
  placeChoice: PlaceChoice;
  hasBasket: boolean;
};

function HomePage({
  navigation,
  user,
  route,
  setPlaceChoice,
  placeChoice,
  hasBasket
}: HomePageProps) {
  const [orderConfirmModal, setOrderModalConfirm] = useState<boolean>(false);

  const [bookingConfirmModal, setBookingModalConfirm] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (route.params && route.params.showOrderConfirm) {
      if (placeChoice === 'alreadyOnSite') {
        navigation.navigate(RoutesNames.OrderOnSiteSummaryPage, {
          executeOrder: true
        });
      } else {
        setOrderModalConfirm(true);
      }
    } else if (route.params && route.params.showBookingConfirm) {
      setBookingModalConfirm(true);
    }
  }, [route.params]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      !orderConfirmModal &&
        !bookingConfirmModal &&
        !hasBasket &&
        setPlaceChoice();
    });
  }, [navigation]);

  return (
    <>
      <CommandConfirmModal
        visible={orderConfirmModal}
        hideModal={() => setOrderModalConfirm(false)}
      />
      <BookingConfirmModal
        visible={bookingConfirmModal}
        hideModal={() => setBookingModalConfirm(false)}
      />
      <DropDownHeader
        title={I18n.t('home.hello', {
          name: user && user.firstname ? user.firstname : ''
        })}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {orderIsLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <CardSuggestions navigation={navigation} />
            <TableMenu fromHome />
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 200
  }
});

export default (props: JSX.IntrinsicAttributes & HomePageProps) => (
  <AuthConsumer>
    {ctx => (
      <BookingConsumer>
        {bookCtx =>
          ctx &&
          bookCtx && (
            <HomePage
              user={ctx.user}
              setPlaceChoice={bookCtx.setPlaceChoice}
              placeChoice={bookCtx.placeChoice}
              hasBasket={bookCtx.hasBasket}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
