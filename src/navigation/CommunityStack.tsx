import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';

import BlogPage from 'src/pages/CommunityStack/BlogPage';
import ArticlePage from 'src/pages/CommunityStack/ArticlePage';
import RoutesNames from 'src/navigation/RoutesNames';

export type CommunityStackParamList = {
  ArticlePage: { articleUrl: string };
};

const Stack = createStackNavigator<CommunityStackParamList>();

type CommunityStackProps = {};

type Props = CommunityStackProps;

export default function CommunityStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <Stack.Screen name={RoutesNames.BlogPage} component={BlogPage} />
      <Stack.Screen name={RoutesNames.ArticlePage} component={ArticlePage} />
    </Stack.Navigator>
  );
}

export { CommunityStackProps };
