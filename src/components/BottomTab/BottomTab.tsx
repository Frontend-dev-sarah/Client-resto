import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import I18n from 'resources/localization/I18n';
import TouchableIcon from 'components/Buttons/TouchableIcon';
import colors from 'src/resources/common/colors';
import AppImages from 'resources/common/AppImages';
import Appstyle from 'resources/common/Appstyle';
import AccountStack from 'src/navigation/AccountStack';
import RestaurantsStack from 'src/navigation/RestaurantsStack';
import CommunityStack from 'src/navigation/CommunityStack';
import HomeStack from 'src/navigation/HomeStack';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';
import { TouchableRipple } from 'react-native-paper';
import { BookingConsumer } from 'src/store/BookingContext';
import { PaymentConsumer } from 'src/store/PaymentContext';
import ReturnToExistingBasketModal from '../Modal/ReturnToExistingBasketModal';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import { PlaceChoice } from 'src/models/restaurants';
import ProductOptionModal from '../Modal/ProductOptionModal';

const Tab = createBottomTabNavigator();

type RootNavigatorProps = {
  userIsEating?: boolean;
  hasBasket?: boolean;
  returnToBasketVisible?: boolean;
  setReturnToBasketVisible?: Function;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  setPlaceChoice?: Function;
  basketPlaceChoice?: PlaceChoice;
};

type Props = RootNavigatorProps;

function BottomTab({
  userIsEating,
  hasBasket,
  returnToBasketVisible,
  setReturnToBasketVisible,
  navigation,
  setPlaceChoice,
  basketPlaceChoice
}: Props) {
  const { hasExpiredCard } = useContext(PaymentConsumer);
  function getTabBarVisible(route: any) {
    if (
      ((route && route.state && route.state.index > 0) ||
        (route &&
          route.state &&
          (route.state.routes[0].name === RoutesNames.OnboardingPage ||
            route.state.routes[0].name === RoutesNames.CardPage ||
            route.state.routes[0].name === RoutesNames.ResetPasswordPage))) &&
      route.state.routes[route.state.index].name !==
        RoutesNames.OrderOnSiteSummaryPage
    ) {
      return false;
    } else if (
      route &&
      route.state &&
      (route.state.index === 0 ||
        route.state.routes[route.state.index].name ===
          RoutesNames.OrderOnSiteSummaryPage)
    ) {
      return true;
    }
  }

  return (
    <>
      <ReturnToExistingBasketModal
        visible={returnToBasketVisible}
        hideModal={() =>
          setReturnToBasketVisible && setReturnToBasketVisible(false)
        }
        onPress={async () => {
          setPlaceChoice && setPlaceChoice(basketPlaceChoice);
          await navigation.navigate(RoutesNames.RestaurantsStack);
          navigation.navigate(RoutesNames.RestaurantsStack, {
            screen: RoutesNames.CardPage,
            params: { simpleCard: false }
          });
        }}
      />
      <ProductOptionModal />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: colors.paleOrange,
          inactiveTintColor: colors.white60,
          style: [styles.tabBar, styles.noShadow]
        }}
      >
        <Tab.Screen
          name={RoutesNames.HomeStack}
          component={HomeStack}
          options={({ route }) => ({
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={[
                  styles.labelStyle,
                  focused &&
                    (route && route.state
                      ? route.state.routes[route.state.index].name !==
                        RoutesNames.OrderOnSiteSummaryPage
                      : true) &&
                    styles.labelStyleFocused
                ]}
              >
                {I18n.t('pages.home')}
              </Text>
            ),
            tabBarIcon: ({ color }: { color: string }) => (
              <TouchableIcon
                icon={AppImages.images.homeAlt}
                color={
                  (route && route.state
                  ? route.state.routes[route.state.index].name !==
                    RoutesNames.OrderOnSiteSummaryPage
                  : true)
                    ? color
                    : colors.white60
                }
                width={16}
                height={16}
                padding={0}
                style={styles.tabBarIcon}
              />
            ),
            tabBarVisible: getTabBarVisible(route)
          })}
        />
        <Tab.Screen
          name={RoutesNames.RestaurantsStack}
          component={RestaurantsStack}
          options={({ route }) => ({
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={[styles.labelStyle, focused && styles.labelStyleFocused]}
              >
                {I18n.t('pages.restaurants')}
              </Text>
            ),
            tabBarIcon: ({ color }: { color: string }) => (
              <TouchableIcon
                icon={AppImages.images.shop}
                color={color}
                width={16}
                height={16}
                padding={0}
                style={styles.tabBarIcon}
              />
            ),
            tabBarVisible: getTabBarVisible(route),
            unmountOnBlur: true
          })}
        />
        <Tab.Screen
          name="A Table"
          component={RestaurantsStack}
          options={({ route }) => ({
            tabBarLabel: () => <></>,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TouchableRipple
                style={[styles.communityTab, styles.shadow]}
                onPress={() => {
                  if (hasBasket) {
                    setReturnToBasketVisible && setReturnToBasketVisible(true);
                  } else if (!userIsEating) {
                    navigatorRef.current.navigate(
                      RoutesNames.ModalOrderNavigator
                    );
                  } else {
                    navigatorRef.current.navigate(RoutesNames.HomeStack, {
                      screen: RoutesNames.HomePage
                    });
                    navigatorRef.current.navigate(RoutesNames.HomeStack, {
                      screen: RoutesNames.OrderOnSiteSummaryPage
                    });
                  }
                }}
              >
                <>
                  {hasBasket && <View style={styles.basketBadge} />}
                  <TouchableIcon
                    icon={AppImages.images.restaurant}
                    color={colors.white}
                    style={styles.communityTabIcon}
                    width={16}
                    height={16}
                    padding={0}
                  />
                  <Text
                    style={[
                      styles.labelStyle,
                      styles.communityText,
                      focused && styles.communityTextFocused
                    ]}
                  >
                    {I18n.t('pages.dinnertime')}
                  </Text>
                </>
              </TouchableRipple>
            ),
            tabBarVisible: getTabBarVisible(route)
          })}
        />
        <Tab.Screen
          name={RoutesNames.CommunityStack}
          component={CommunityStack}
          options={({ route }) => ({
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={[styles.labelStyle, focused && styles.labelStyleFocused]}
              >
                {I18n.t('pages.blog')}
              </Text>
            ),
            tabBarIcon: ({ color }: { color: string }) => (
              <TouchableIcon
                icon={AppImages.images.communaute}
                color={color}
                width={16}
                height={16}
                padding={0}
                style={styles.tabBarIcon}
              />
            ),
            tabBarVisible: getTabBarVisible(route)
          })}
        />
        <Tab.Screen
          name={RoutesNames.AccountStack}
          component={AccountStack}
          options={({ route }) => ({
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={[styles.labelStyle, focused && styles.labelStyleFocused]}
              >
                {I18n.t('pages.profil')}
              </Text>
            ),
            tabBarIcon: ({ color }: { color: string }) => (
              <View>
                {hasExpiredCard && <View style={styles.badge} />}
                <TouchableIcon
                  icon={AppImages.images.profil}
                  color={color}
                  width={16}
                  height={16}
                  padding={0}
                  style={styles.tabBarIcon}
                />
              </View>
            ),
            tabBarVisible: getTabBarVisible(route)
          })}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  basketBadge: {
    backgroundColor: colors.green,
    borderRadius: 15,
    height: 15,
    position: 'absolute',
    right: 2,
    top: 2,
    width: 15,
    zIndex: 1
  },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 5,
    height: 8,
    position: 'absolute',
    right: -5,
    top: 2,
    width: 8,
    zIndex: 1
  },
  communityTab: {
    backgroundColor: colors.paleOrange,
    borderRadius: 32,
    height: 64,
    marginBottom: 76,
    marginTop: 32,
    paddingTop: 16,
    width: 64
  },
  communityTabIcon: {
    height: 16,
    width: 64
  },
  communityText: {
    color: colors.white60,
    marginTop: 3,
    textAlign: 'center',
    width: 64
  },
  communityTextFocused: {
    color: colors.white80
  },
  labelStyle: {
    color: colors.white60,
    fontSize: 10,
    paddingBottom: 3
  },
  labelStyleFocused: {
    color: colors.paleOrange
  },
  noShadow: Appstyle.noShadow(),
  shadow: Appstyle.shadowExtraBold(),
  tabBar: {
    borderStyle: 'solid',
    borderTopColor: colors.white40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    bottom: 0,
    height: 54,
    marginBottom: Appstyle.marginBottomIPhoneX - 5,
    paddingBottom: 7
  },
  tabBarIcon: {
    paddingTop: 6
  }
});

export default (props: JSX.IntrinsicAttributes & RootNavigatorProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <BottomTab
          userIsEating={ctx.userIsEating}
          hasBasket={ctx.hasBasket}
          returnToBasketVisible={ctx.returnToBasketVisible}
          setReturnToBasketVisible={ctx.setReturnToBasketVisible}
          setPlaceChoice={ctx.setPlaceChoice}
          basketPlaceChoice={ctx.basketPlaceChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
