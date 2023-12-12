/* eslint-disable react-native/no-unused-styles */
import React, { useState } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';
import { TabView, TabBar, Route } from 'react-native-tab-view';

import I18n from 'resources/localization/I18n';
import colors from 'src/resources/common/colors';
import { FOOD_CATEGORIES, screenWidth } from 'src/utils/constants';
import { BookingConsumer } from 'src/store/BookingContext';
import { Restaurant, PlaceChoice } from 'src/models/restaurants';

type MenuHeaderProps = {
  anim: Animated.Animated;
  starter: JSX.Element;
  mainCourses: JSX.Element;
  desserts: JSX.Element;
  drinks: JSX.Element;
  selectedRestaurant?: Restaurant;
  placeChoice?: PlaceChoice;
};

type routeType = { key: string; title: string };

export const routes = [
  { key: 'starter', title: FOOD_CATEGORIES[0] },
  { key: 'main_course', title: FOOD_CATEGORIES[1] },
  { key: 'dessert', title: FOOD_CATEGORIES[2] },
  { key: 'drinks', title: FOOD_CATEGORIES[3] }
];

function MenuHeader({
  anim,
  starter,
  mainCourses,
  desserts,
  drinks,
  placeChoice,
  selectedRestaurant
}: MenuHeaderProps) {
  const [tabIndex, setTabIndex] = useState(0);

  function renderScene({ route }: { route: Route }) {
    switch (route.key) {
      case 'starter':
        return starter;
      case 'main_course':
        return mainCourses;
      case 'dessert':
        return desserts;
      case 'drinks':
        return drinks;
    }
  }

  function renderLabel({ route }: { route: routeType }) {
    return (
      <Text
        style={[
          styles.category,
          tabIndex === routes.indexOf(route) && styles.active
        ]}
      >
        {route.title}
      </Text>
    );
  }

  const CustomTabBar = (props: any) => (
    <TabBar
      {...props}
      renderLabel={renderLabel}
      labelStyle
      indicatorStyle={styles.activeIndicator}
      style={styles.row}
    />
  );

  return (
    <>
      {/* keep it for later to put menu inside this animated view */}
      {/* <Animated.View style={[styles.container, { height: anim }]}>
        <Animated.Text style={[styles.title, { height: anim }]}>
          {placeChoice === 'alreadyOnSite'
            ? I18n.t('booking.scanOrder')
            : placeChoice === 'bookOnSite'
            ? I18n.t('booking.bookOnSite')
            : I18n.t('booking.takeAway')}
          <Text style={styles.subtitle}>
            {selectedRestaurant && `\n${selectedRestaurant.name}`}
          </Text>
        </Animated.Text>
      </Animated.View> */}
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={CustomTabBar}
        onIndexChange={index => setTabIndex(index)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  active: {
    color: colors.paleOrange
  },
  activeIndicator: {
    backgroundColor: colors.paleOrange,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    height: 4,
    marginHorizontal: screenWidth / 4 / 2 - 8,
    width: 16
  },
  category: {
    color: colors.lightGrey,
    fontFamily: 'GothamMedium',
    fontSize: screenWidth <= 320 ? 12 : 14,
    letterSpacing: 0.75,
    lineHeight: 16,
    marginBottom: 10
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.black
  },
  row: {
    backgroundColor: colors.black,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32
  },
  subtitle: {
    color: colors.brownishGrey,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 18,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & MenuHeaderProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <MenuHeader
          selectedRestaurant={ctx.selectedRestaurant}
          placeChoice={ctx.placeChoice}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
