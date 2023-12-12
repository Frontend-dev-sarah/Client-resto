import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Swiper from 'react-native-swiper';
import Constants from 'expo-constants';
import I18n from 'resources/localization/I18n';
import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { screenHeight, isExpoApp } from 'src/utils/constants';
import PersonNumberSelector from '../Slider/PersonNumberSelector';
import WeekCalendar from '../Calendar/WeekCalendar';
import HourSelector from '../Calendar/HourSelector';
import BorderedRadiusButton from '../Buttons/BorderedRadiusButton';
import { BookingConsumer } from 'src/store/BookingContext';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { Restaurant } from 'src/models/restaurants';
import moment from 'moment';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { TextInput } from 'react-native-paper';
import { navigatorRef } from 'src/navigation/RootNavigator';
import RoutesNames from 'src/navigation/RoutesNames';

type BookingModalProps = {
  open: boolean;
  onClose: Function;
  selectedHour?: string;
  selectedRestaurant?: Restaurant;
  selectedDate?: Date;
  personNumber?: number;
  setPlaceChoice?: Function;
};

export function BookingModal({
  open,
  onClose,
  selectedHour,
  selectedDate,
  selectedRestaurant,
  personNumber,
  setPlaceChoice
}: BookingModalProps) {
  const sheetRef = useRef<any>(null);
  const carouselRef = useRef<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyboardOpened, setKeyboardOpened] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (open) {
      openModal();
    }
  }, [open]);

  async function openModal() {
    setPlaceChoice && setPlaceChoice('bookOnSite');
    (await sheetRef) &&
      sheetRef.current &&
      sheetRef.current.snapTo &&
      sheetRef.current.snapTo(1);
  }

  async function closeModal() {
    setPlaceChoice && setPlaceChoice();
    await onClose();
    carouselRef.current;
    await sheetRef.current.snapTo(0);
  }

  async function book() {
    setIsLoading(true);
    if (selectedRestaurant && selectedDate && selectedHour && personNumber) {
      const hour = selectedHour.split(':')[0];
      const min = selectedHour.split(':')[1];
      const date = selectedDate;
      const dateToSend = moment(
        moment(date)
          .toDate()
          .setHours(parseInt(hour), parseInt(min), 0)
      ).format();

      const res = await bookingApi.book(
        selectedRestaurant.id,
        dateToSend,
        personNumber,
        description && description.length > 0 ? description : undefined
      );
      if (res && !res.error) {
        closeModal();
        goPrev();
        navigatorRef.current.navigate(RoutesNames.HomePage, {
          showBookingConfirm: true,
          showOrderConfirm: false
        });
      } else {
        Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
          { text: I18n.t('app.ok'), style: 'cancel' }
        ]);
      }
    }
    setIsLoading(false);
  }

  function goNext() {
    carouselRef.current.scrollBy(1);
  }
  function goPrev() {
    carouselRef.current.scrollBy(-1);
  }

  function renderFirstPage() {
    return (
      <>
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              {I18n.t('restaurants.personNumber')}
            </Text>
            <PersonNumberSelector />
            <Text style={styles.subtitle}>{I18n.t('booking.date')}</Text>
            <WeekCalendar />
            <Text style={styles.subtitle}>{I18n.t('booking.hour')}</Text>
          </View>
          <HourSelector />
        </ScrollView>
        <BorderedRadiusButton
          primary
          bottom
          text={I18n.t('app.next')}
          borderTopLeft
          inactive={!selectedHour}
          onPress={goNext}
          isLoading={isLoading}
          customStyle={styles.next}
        />
      </>
    );
  }

  function renderSecondPage() {
    return (
      <>
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.subtitle}>{I18n.t('booking.request')}</Text>
            <TextInput
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.input, keyboardOpened && { marginBottom: '50%' }]}
              numberOfLines={10}
              multiline
              onFocus={() => setKeyboardOpened(true)}
              onEndEditing={() => setKeyboardOpened(false)}
              value={description}
              onChangeText={(text: string) => setDescription(text)}
              underlineColor={colors.white}
              placeholderTextColor={colors.white}
              underlineColorAndroid={colors.white}
              theme={{
                colors: {
                  text: colors.white,
                  primary: colors.white
                }
              }}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.back} onPress={goPrev}>
            <Image source={AppImages.images.backIcon} />
          </TouchableOpacity>
          <BorderedRadiusButton
            bottom
            text={I18n.t('restaurants.book')}
            borderTopLeft
            onPress={book}
            isLoading={isLoading}
            customStyle={styles.button}
          />
        </View>
      </>
    );
  }

  function renderContent() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => closeModal()}
        >
          <Image source={AppImages.images.cross} style={styles.close} />
        </TouchableOpacity>
        <Text style={styles.title}>{I18n.t('restaurants.bookeTable')}</Text>
        <Swiper
          loop={false}
          ref={carouselRef}
          scrollEnabled={false}
          paginationStyle={styles.pagination}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          removeClippedSubviews={false}
        >
          {renderFirstPage()}
          {renderSecondPage()}
        </Swiper>
      </View>
    );
  }

  return (
    <BottomSheet
      ref={sheetRef}
      enabledContentTapInteraction={false}
      enabledContentGestureInteraction={false}
      snapPoints={[0, screenHeight - 100]}
      renderContent={renderContent}
    />
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.white70,
    height: 4,
    width: 12
  },
  back: {
    alignItems: 'center',
    flex: 1,
    height: 74,
    justifyContent: 'center',
    ...ifIphoneX(
      {
        paddingBottom: getBottomSpace(),
        height: 74 + getBottomSpace()
      },
      {}
    )
  },
  button: {
    marginLeft: 'auto',
    marginTop: 'auto',
    width: '70%'
  },
  buttonView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
    top:
      Platform.OS === 'android' && !isExpoApp ? -Constants.statusBarHeight : 0
  },
  close: {
    height: 16,
    tintColor: colors.white,
    width: 16
  },
  closeContainer: {
    left: 10,
    padding: 15,
    position: 'absolute',
    top: 10,
    zIndex: 1
  },
  container: {
    backgroundColor: colors.darkGrey,
    borderTopLeftRadius: 32,
    height: '100%',
    paddingTop: 24
  },
  content: {
    paddingHorizontal: 25
  },
  dot: { backgroundColor: colors.white70, height: 4, width: 4 },
  input: {
    backgroundColor: colors.white10,
    marginTop: 15
  },
  next: {
    top:
      Platform.OS === 'android' && !isExpoApp ? -Constants.statusBarHeight : 0
  },
  pagination: {
    bottom: undefined,
    position: 'absolute',
    top: 0
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 32
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    marginBottom: 16,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & BookingModalProps) => (
  <BookingConsumer>
    {bookCtx =>
      bookCtx && (
        <BookingModal
          selectedHour={bookCtx.selectedHour}
          selectedDate={bookCtx.selectedDate}
          selectedRestaurant={bookCtx.selectedRestaurant}
          personNumber={bookCtx.personNumber}
          setPlaceChoice={bookCtx.setPlaceChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
