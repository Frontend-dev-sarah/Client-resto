/* eslint-disable @typescript-eslint/camelcase */
import I18n from 'resources/localization/I18n';
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  RefreshControl
} from 'react-native';

import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationActions
} from 'react-navigation';
import { RouteProp } from '@react-navigation/native';
import { RestaurantsStackParamList } from 'src/navigation/RestaurantsStack';

import AppImages from 'src/resources/common/AppImages';
import Swiper from 'react-native-swiper';
import BottomFab from 'src/components/Fabs/BottomFab';
import { TextInput } from 'react-native-paper';
import Notation from 'src/components/Products/Notation';
import { screenHeight } from 'src/utils/constants';
import ProductCardNotation from 'src/components/Products/ProductCardNotation';
import { Product, ProductNotation } from 'src/models/products';
import bookingApi from 'src/services/bookingApi/bookingApi';
import { Restaurant } from 'src/models/restaurants';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';

type NotationPageRouteProp = RouteProp<
  RestaurantsStackParamList,
  'NotationPage'
>;

type NotationPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NotationPageRouteProp;
};

export default function NotationPage({ navigation, route }: NotationPageProps) {
  const { orderId, orderType } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [comment, setComment] = useState<string>('');
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [evaluationId, setEvalutationId] = useState<number>();
  const [moodNotation, setMoodNotation] = useState<number>(5);
  const [waiterNotation, setWaiterNotation] = useState<number>(5);
  const [productNotations, setProductNotations] = useState<ProductNotation[]>(
    []
  );
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const carouselRef = useRef<any>();

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    initNotationsArray();
  }, [products]);

  async function getDatas() {
    const datas = orderId && (await bookingApi.getOrderDetail(orderId));
    if (datas && !datas.error) {
      datas.products && setProducts(datas.products);
      datas.orderable &&
        datas.orderable.restaurant &&
        setRestaurant(datas.orderable.restaurant);
    } else if (datas.error) {
      console.log('==GET DATAS FOR NOTATION ERROR==>', datas.error);
    }
    setIsLoading(false);
  }

  async function submitRestaurantNotation() {
    setSubmitLoading(true);
    const restoScore =
      restaurant &&
      (await bookingApi.sendRestaurantNotation({
        restaurantId: restaurant.id,
        restaurantNote: moodNotation,
        waiterNote: waiterNotation,
        comment: comment.length > 0 ? comment : undefined,
        isTakeAway: false
      }));
    if (restoScore && !restoScore.error) {
      setComment('');
      restoScore.id && setEvalutationId(restoScore.id);
      goNext();
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setSubmitLoading(false);
  }

  async function submitWaiterNotation() {
    setSubmitLoading(true);
    if (orderType === 'takeAway') {
      const waiterScore =
        restaurant &&
        (await bookingApi.sendRestaurantNotation({
          isTakeAway: true,
          restaurantId: restaurant.id,
          waiterNote: waiterNotation,
          comment: comment.length > 0 ? comment : undefined
        }));
      if (waiterScore && !waiterScore.error) {
        setComment('');
        waiterScore.id && setEvalutationId(waiterScore.id);
        goNext();
      } else {
        Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
          { text: I18n.t('app.ok'), style: 'cancel' }
        ]);
      }
    } else {
      goNext();
    }
    setSubmitLoading(false);
  }

  async function submitProductsNotation() {
    setSubmitLoading(true);
    const productsScore =
      evaluationId &&
      (await bookingApi.sendProductsNotation({
        productsNote: productNotations,
        evaluationId: evaluationId,
        comment: comment.length > 0 ? comment : undefined
      }));
    if (productsScore && !productsScore.error) {
      goBack();
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setSubmitLoading(false);
  }

  function initNotationsArray() {
    const tmpArray: ProductNotation[] = [];
    if (products) {
      products.map((product): number =>
        tmpArray.push({ id: product.id, score: 5 })
      );
      setProductNotations(tmpArray);
    }
  }

  function goNext() {
    carouselRef.current.scrollBy(1);
  }

  function changeProductNotation(note: number, productId: number) {
    const tmpArray = [...productNotations];
    const index = tmpArray.findIndex(item => item.id === productId);
    if (index !== -1) {
      tmpArray[index].score = note;
      setProductNotations(tmpArray);
    }
  }

  function renderCommentInput() {
    return (
      <TextInput
        style={[styles.input]}
        numberOfLines={15}
        multiline
        value={comment}
        onChangeText={(text: string) => setComment(text)}
        placeholderTextColor={colors.white}
        theme={{
          colors: {
            text: colors.white,
            primary: colors.white,
            accent: colors.white,
            placeholder: colors.white
          }
        }}
        label={I18n.t('restaurants.comment')}
      />
    );
  }

  function renderMoodPage() {
    return (
      <>
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              colors={[colors.paleOrange]}
              tintColor={colors.paleOrange}
              enabled={false}
            />
          }
        >
          {restaurant && restaurant.images && restaurant.images[0] && (
            <Image
              style={styles.img}
              source={{ uri: restaurant.images[0].image }}
              resizeMode="contain"
            />
          )}
          <Text style={[styles.title, styles.big]}>
            {I18n.t('restaurants.mood')}
          </Text>
          <Text style={[styles.title]}>{restaurant && restaurant.name}</Text>
          <Notation
            size={40}
            notation={moodNotation}
            onChange={setMoodNotation}
          />
          {renderCommentInput()}
        </ScrollView>
        <BottomFab
          active
          onPress={submitRestaurantNotation}
          isLoading={submitLoading}
        />
      </>
    );
  }

  function renderWaiterNotationPage() {
    return (
      <>
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              colors={[colors.paleOrange]}
              tintColor={colors.paleOrange}
              enabled={false}
            />
          }
        >
          {restaurant && restaurant.images && restaurant.images[0] && (
            <Image
              style={styles.img}
              source={{ uri: restaurant.images[0].image }}
              resizeMode="contain"
            />
          )}
          <Text style={[styles.title, styles.big]}>
            {I18n.t('restaurants.waiterNotation')}
          </Text>
          <Text style={[styles.title]}>{restaurant && restaurant.name}</Text>
          <Notation
            size={40}
            notation={waiterNotation}
            onChange={setWaiterNotation}
          />
          {renderCommentInput()}
        </ScrollView>
        <BottomFab
          active
          onPress={submitWaiterNotation}
          isLoading={submitLoading}
        />
      </>
    );
  }

  function renderDishPage() {
    return (
      <>
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              colors={[colors.paleOrange]}
              tintColor={colors.paleOrange}
              enabled={false}
            />
          }
        >
          <Text style={[styles.title, styles.big]}>
            {I18n.t('restaurants.dishesOrdered')}
          </Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductCardNotation
                item={item}
                notation={
                  productNotations &&
                  productNotations.find(pn => pn.id === item.id) &&
                  productNotations.find(pn => pn.id === item.id).score
                }
                onChange={(note: number) =>
                  changeProductNotation(note, item.id)
                }
              />
            )}
          />
          {renderCommentInput()}
        </ScrollView>
        <BottomFab
          active
          onPress={submitProductsNotation}
          isLoading={submitLoading}
        />
      </>
    );
  }

  function goBack() {
    navigatorRef.current.navigate(RoutesNames.RestaurantsStack, {
      screen: RoutesNames.RestaurantsPage
    });
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.closeContainer} onPress={goBack}>
          <Image source={AppImages.images.cross} style={styles.close} />
        </TouchableOpacity>
        <Text style={styles.title}>{I18n.t('restaurants.yourOpinion')}</Text>
        <Swiper
          loop={false}
          ref={carouselRef}
          scrollEnabled={false}
          removeClippedSubviews={false}
          showsPagination={false}
        >
          {renderWaiterNotationPage()}
          {orderType !== 'takeAway' && renderMoodPage()}
          {renderDishPage()}
        </Swiper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { alignItems: 'center', flex: 1 },
  container: {
    backgroundColor: colors.darkGrey,
    height: '100%',
    paddingTop: 24
  },
  closeContainer: {
    left: 10,
    padding: 15,
    position: 'absolute',
    top: 10,
    zIndex: 1
  },
  close: {
    height: 16,
    tintColor: colors.white,
    width: 16
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  big: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    marginVertical: 30
  },
  input: {
    backgroundColor: colors.black,
    marginTop: 25,
    width: '100%',
    height: screenHeight * 0.2
  },
  img: { height: '15%', width: '80%' }
});
