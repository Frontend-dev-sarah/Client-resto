import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import Constants from 'expo-constants';

import I18n from 'resources/localization/I18n';
import colors from 'src/resources/common/colors';
import blogApi from 'src/services/blogApi/blogApi';
import { Article } from 'src/models/blog';
import ArticleCard from 'src/pages/CommunityStack/components/ArticleCard';
import RoutesNames from 'src/navigation/RoutesNames';
import { AuthConsumer } from 'src/store/AuthContext';
import CustomButton from 'src/components/Buttons/CustomButton';

type BlogPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  alreadySubscribed?: boolean;
};
function BlogPage({ navigation, alreadySubscribed }: BlogPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

  useEffect(() => {
    getArticles(true);
  }, []);

  async function getArticles(refresh: boolean) {
    if ((!noMoreData || refresh) && !loading) {
      refresh ? setLoading(true) : setLoadingMore(true);
      const res = await blogApi.getArticles({ page: refresh ? 1 : page + 1 });
      setPage(value => (refresh ? 1 : value + 1));
      if (res && !res.error) {
        if (!res.length) {
          setNoMoreData(true);
        } else if (noMoreData) {
          setNoMoreData(false);
        }
        setArticles(refresh ? res : [...articles].concat(res));
      } else {
        setNoMoreData(true);
      }
      refresh ? setLoading(false) : setLoadingMore(false);
    }
  }

  function onPressArticle(article: Article) {
    if (article.link) {
      navigation.navigate(RoutesNames.ArticlePage, {
        articleUrl: article.link
      });
    }
  }

  if (!alreadySubscribed) {
    return (
      <View style={styles.flex}>
        <View style={styles.overlay} />
        <View style={styles.header}>
          <Text style={[styles.title]}>{I18n.t('blog.title')}</Text>
        </View>
        <Text style={[styles.text]}>{I18n.t('blog.emptyState')}</Text>
        <View style={styles.flex}>
          <View style={styles.subscribeCtnr}>
            <Text style={styles.sub}>{I18n.t('blog.subscribedContent')}</Text>
            <CustomButton
              text={I18n.t('blog.subscribe')}
              onPress={async () => {
                await navigation.navigate(RoutesNames.AccountStack);
                navigation.navigate(RoutesNames.AccountStack, {
                  screen: RoutesNames.SubscriptionDescriptionPage,
                  params: {
                    showHeader: true,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    previous_screen: "Popup d'incitation à l'abonnement"
                  }
                });
              }}
              primary
              outlined
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => (
        <ArticleCard article={item} onPressArticle={onPressArticle} />
      )}
      keyExtractor={item => {
        item.id.toString();
      }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => getArticles(true)}
        />
      }
      onEndReachedThreshold={0}
      onEndReached={() => getArticles(false)}
      ListFooterComponent={() =>
        loadingMore ? (
          <ActivityIndicator color={colors.white} style={styles.footer} />
        ) : (
          <></>
        )
      }
      ListEmptyComponent={() =>
        !loading ? (
          <Text style={[styles.text]}>{I18n.t('blog.emptyState')}</Text>
        ) : null
      }
      ListHeaderComponent={() => (
        <>
          <View style={styles.header}>
            <Text style={[styles.title]}>{I18n.t('blog.title')}</Text>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.white} style={styles.footer} />
          ) : null}
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
    paddingHorizontal: 60,
    paddingTop: Constants.statusBarHeight + 61,
    zIndex: -1
  },
  container: {
    paddingBottom: 40
  },
  text: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 40,
    textAlign: 'center'
  },
  footer: {
    marginVertical: 20
  },
  subscribeCtnr: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 50,
    backgroundColor: colors.black,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  flex: { flex: 1, justifyContent: 'center' },
  sub: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 40,
    marginHorizontal: 25,
    textAlign: 'center',
    marginBottom: 20
  },
  overlay: {
    backgroundColor: colors.white10,
    flex: 1,
    zIndex: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default (props: JSX.IntrinsicAttributes & BlogPageProps) => (
  <AuthConsumer>
    {authCtx =>
      authCtx && (
        <BlogPage alreadySubscribed={authCtx.alreadySubscribed} {...props} />
      )
    }
  </AuthConsumer>
);
