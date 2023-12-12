import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Text,
  ImageBackground
} from 'react-native';
import I18n from 'i18n-js';
import Swiper from 'react-native-swiper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  Modal as PaperModal,
  Portal,
  TouchableRipple
} from 'react-native-paper';
import colors from 'src/resources/common/colors';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import { RouteProp } from '@react-navigation/native';
import { RestaurantsStackParamList } from 'src/navigation/RestaurantsStack';
import Header from 'src/components/Headers/Header';
import AppImages from 'src/resources/common/AppImages';
import { screenHeight, screenWidth } from 'src/utils/constants';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { Recipe, RecipeStep } from 'src/models/products';
import TouchableIcon from 'src/components/Buttons/TouchableIcon';
import { LinearGradient } from 'expo-linear-gradient';

type RecipePageRouteProp = RouteProp<RestaurantsStackParamList, 'RecipePage'>;

type RecipePageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: RecipePageRouteProp;
};

export default function RecipePage({ navigation, route }: RecipePageProps) {
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [anim] = useState(new Animated.Value(0));
  const carouselRef = useRef<any>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (route.params && route.params.recipe) {
      setRecipe(route.params.recipe);
    }
  }, []);

  function animateHeader() {
    return anim.interpolate({
      inputRange: [0, screenHeight / 4],
      outputRange: [screenHeight / 4, 100],
      extrapolate: 'clamp'
    });
  }
  const onScroll = Animated.event([
    {
      nativeEvent: { contentOffset: { y: anim } }
    }
  ]);

  function renderPage(step: RecipeStep) {
    return (
      <ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        style={styles.paddingView}
      >
        <View style={styles.row}>
          <Text style={styles.number}>{step.number}</Text>
          <Text style={styles.step}>{step.name}</Text>
        </View>
        <Text style={styles.text}>{step.description}</Text>
      </ScrollView>
    );
  }

  function renderCarousel() {
    if (!recipe.images || recipe.images.length === 0) {
      return (
        <Image source={AppImages.images.bgOnboarding} style={styles.mainImg} />
      );
    }
    return (
      <>
        <Carousel
          data={recipe.images}
          renderItem={(item: { item: ImageType }) => (
            <TouchableRipple onPress={() => setModalVisible(true)}>
              <ImageBackground
                style={modalVisible ? styles.bigCarousel : styles.mainImg}
                source={{
                  uri: item.item.image
                }}
                resizeMode={'cover'}
              />
            </TouchableRipple>
          )}
          firstItem={currentIndex}
          useScrollView={false}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          onSnapToItem={(index: number) => setCurrentIndex(index)}
        />
      </>
    );
  }

  function renderPagination() {
    if (recipe && recipe.images && recipe.images.length > 1) {
      return (
        <Pagination
          dotsLength={recipe.images.length}
          activeDotIndex={currentIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.activeDotPagination}
          inactiveDotStyle={styles.inactiveDotPagination}
          inactiveDotOpacity={1}
        />
      );
    } else {
      return <View style={styles.paginationContainer} />;
    }
  }

  if (!recipe) {
    return <></>;
  } else {
    return (
      <>
        <View style={styles.header}>
          <Header backIcon navigation={navigation} />
        </View>
        <Portal>
          <PaperModal
            visible={modalVisible}
            contentContainerStyle={{ backgroundColor: colors.black60 }}
            dismissable
            onDismiss={() => setModalVisible(false)}
          >
            <TouchableIcon
              icon={AppImages.images.closeIcon}
              height={20}
              width={20}
              style={styles.close}
              onPress={() => setModalVisible(false)}
            />
            {renderCarousel()}
            <View style={styles.paginationModal}>{renderPagination()}</View>
          </PaperModal>
        </Portal>
        {renderCarousel()}
        <LinearGradient
          pointerEvents="none"
          colors={[colors.black, colors.transparent]}
          style={styles.shadowView}
        >
          <View style={styles.pagination}>{renderPagination()}</View>
        </LinearGradient>

        <Animated.View
          style={[styles.contentContainer, { top: animateHeader() }]}
        >
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.subtitle}>{recipe.description}</Text>
          <Swiper
            showsButtons={true}
            loop={false}
            ref={carouselRef}
            paginationStyle={styles.paginationSwipper}
            dotStyle={styles.dot}
            activeDot={
              <View style={styles.activeDot}>
                <View style={styles.activeDotInside} />
              </View>
            }
            buttonWrapperStyle={styles.buttonWrapper}
            prevButton={
              <Image source={AppImages.images.prev} style={styles.btn} />
            }
            nextButton={
              <Image source={AppImages.images.next} style={styles.btn} />
            }
          >
            {[{}, ...recipe.steps].map((step, index) =>
              index === 0 ? (
                <ScrollView
                  scrollEventThrottle={5}
                  onScroll={onScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.paddingView}
                >
                  <View style={styles.row}>
                    <Text style={styles.step}>
                      {I18n.t('product.ingredients')}
                    </Text>
                  </View>
                  {recipe.ingredients.map(item => (
                    <Text style={styles.ingredient}>
                      {`• ${item.name} ${item.quantity ? '-' : ''} ${
                        item.quantity && item.quantity !== null
                          ? item.quantity
                          : ''
                      } ${
                        item.unity &&
                        item.unity !== 'unit' &&
                        item.unity !== null &&
                        item.unity
                          ? item.unity
                          : ''
                      }`}
                    </Text>
                  ))}
                </ScrollView>
              ) : (
                renderPage(step)
              )
            )}
          </Swiper>
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  activeDot: {
    alignItems: 'center',
    borderColor: colors.white70,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    padding: 3,
    width: 16,
    ...ifIphoneX({ marginBottom: getBottomSpace() }, {})
  },
  activeDotInside: {
    backgroundColor: colors.paleOrange,
    borderRadius: 8,
    height: 6,
    width: 6
  },
  activeDotPagination: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 4,
    padding: 0,
    width: 12
  },
  bigCarousel: {
    height: screenHeight - 150
  },
  btn: { tintColor: colors.white, width: 20 },
  buttonWrapper: {
    backgroundColor: colors.black,
    bottom: 0,
    height: 64,
    left: 'auto',
    marginTop: 28,
    position: 'absolute',
    right: 0,
    top: 'auto',
    ...ifIphoneX(
      { height: 64 + getBottomSpace(), paddingBottom: getBottomSpace() },
      {}
    )
  },
  close: { alignSelf: 'flex-start' },
  contentContainer: {
    backgroundColor: colors.darkGrey,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    bottom: 0,
    paddingTop: 32,
    position: 'absolute',
    width: '100%',
    zIndex: 1
  },
  dot: {
    borderColor: colors.white40,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 6,
    width: 6,
    ...ifIphoneX({ marginBottom: getBottomSpace() }, {})
  },
  header: { position: 'absolute', top: 0, zIndex: 1 },
  inactiveDotPagination: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  ingredient: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginTop: 20
  },
  mainImg: { height: screenHeight / 4 + 35, width: '100%' },
  number: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 48,
    letterSpacing: 0,
    marginRight: 12,
    textAlign: 'center'
  },
  paddingView: {
    marginBottom: 64,
    paddingBottom: 120,
    paddingHorizontal: 25
  },
  pagination: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    padding: 0,
    position: 'relative',
    top: screenHeight / 4 - 30
  },
  paginationContainer: {
    height: 20,
    paddingVertical: 0,
    width: 90
  },
  paginationModal: {
    alignItems: 'center',
    marginTop: 20
  },
  paginationSwipper: { zIndex: 1 },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 80,
    marginTop: 15
  },
  shadowView: {
    height: screenHeight * 0.25,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  step: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 18,
    letterSpacing: 0,
    paddingBottom: 12
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    marginHorizontal: 25,
    marginTop: 4
  },
  text: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 20,
    marginTop: 30
  },
  title: {
    color: colors.paleOrange,
    fontFamily: 'GothamBold',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginHorizontal: 25
  }
});

// export default (props: JSX.IntrinsicAttributes & RecipePageProps) => (
//   <AuthConsumer>
//     {ctx => (
//       <BookingConsumer>
//         {bookCtx => bookCtx && ctx && <RecipePage {...props} />}
//       </BookingConsumer>
//     )}
//   </AuthConsumer>
// );
