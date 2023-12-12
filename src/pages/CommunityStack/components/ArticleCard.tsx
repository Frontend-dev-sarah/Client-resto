import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import moment from 'moment';

import colors from 'src/resources/common/colors';
import blogApi from 'src/services/blogApi/blogApi';
import { screenWidth } from 'src/utils/constants';
import { Article } from 'src/models/blog';

type ArticleCardProps = {
  article: Article;
  onPressArticle: Function;
};

export default function ArticleCard({
  article,
  onPressArticle
}: ArticleCardProps) {
  const [imgSrc, setImgSrc] = useState<string | null>('');

  useEffect(() => {
    if (article && article.featured_media) {
      getArticleImage();
    }
  }, [article]);

  async function getArticleImage() {
    const img = await blogApi.getArticleImage({
      imgId: article.featured_media
    });
    if (img && !img.error && img.guid && img.guid.rendered) {
      setImgSrc(img.guid.rendered);
    }
  }

  return (
    <TouchableRipple onPress={() => onPressArticle(article)}>
      <ImageBackground
        style={[styles.card]}
        source={{ uri: imgSrc }}
        imageStyle={styles.image}
      >
        {article.title && article.title.rendered ? (
          <Text style={styles.title}>{article.title.rendered}</Text>
        ) : (
          <></>
        )}
        {article.date ? (
          <Text style={styles.date}>
            {moment(article.date).format('DD MMM YYYY')}
          </Text>
        ) : (
          <></>
        )}
      </ImageBackground>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightBlack,
    borderRadius: 10,
    height: 140,
    justifyContent: 'flex-end',
    marginHorizontal: 25,
    marginTop: 24,
    padding: 16,
    width: screenWidth - 50,
    overflow: 'hidden'
  },
  image: {
    opacity: 0.8,
    borderRadius: 10,
    backgroundColor: colors.brownishGrey
  },
  title: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 16,
    lineHeight: 24
  },
  date: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    lineHeight: 14
  }
});
