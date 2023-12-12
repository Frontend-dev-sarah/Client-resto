import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import { WebView } from 'react-native-webview';

import { CommunityStackParamList } from 'src/navigation/CommunityStack';
import Header from 'src/components/Headers/Header';

type ArticlePageRouteProp = RouteProp<CommunityStackParamList, 'ArticlePage'>;
type ArticlePageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: ArticlePageRouteProp;
};
export default function ArticlePage({ route, navigation }: ArticlePageProps) {
  const [articleUrl, setArticleUrl] = useState<string>(
    route && route.params && route.params.articleUrl
  );

  useEffect(() => {
    if (
      route.params &&
      route.params.articleUrl &&
      route.params.articleUrl !== articleUrl
    ) {
      setArticleUrl(route.params.articleUrl);
    }
  }, [route.params]);

  return (
    <>
      <Header navigation={navigation} backIcon isLoading={false} black />
      <WebView
        source={{
          uri: articleUrl
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 40
  }
});
