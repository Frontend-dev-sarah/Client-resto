import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Product } from 'src/models/products';
import { ImageType } from 'src/models/images';
import colors from 'src/resources/common/colors';
import { screenWidth, screenHeight } from 'src/utils/constants';
import AppImages from 'src/resources/common/AppImages';
import I18n from 'resources/localization/I18n';
import {
  Modal as PaperModal,
  Portal,
  TouchableRipple
} from 'react-native-paper';
import TouchableIcon from '../Buttons/TouchableIcon';

type ProductInfosItemProps = {
  product: Product;
  successFull?: boolean;
};

export default function ProductInfosItem({
  product,
  successFull
}: ProductInfosItemProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function renderPagination() {
    if (product && product.images && product.images.length > 1) {
      return (
        <Pagination
          dotsLength={product.images.length}
          activeDotIndex={currentIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={1}
        />
      );
    } else {
      return <View style={styles.paginationContainer} />;
    }
  }

  function renderCarousel() {
    return (
      <>
        <Carousel
          data={product.images}
          renderItem={(item: { item: ImageType }) => (
            <TouchableRipple onPress={() => setModalVisible(true)}>
              <ImageBackground
                style={modalVisible ? styles.bigCarousel : styles.carousel}
                source={{
                  uri: item.item.image
                }}
                resizeMode={modalVisible ? 'cover' : undefined}
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

  return (
    <View style={styles.carouselContainer}>
      <Portal>
        <PaperModal
          visible={modalVisible}
          contentContainerStyle={{
            backgroundColor: colors.black60
          }}
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
        {(product.is_sucessful || successFull) && (
          <View style={styles.succesfulItemInformations}>
            <Image source={AppImages.images.utensils} />
            <Text style={styles.noData}>{I18n.t('menu.successful')}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 4,
    padding: 0,
    width: 12
  },
  bigCarousel: {
    height: screenHeight - 150
  },
  carousel: {
    height: screenHeight * 0.5
  },
  carouselContainer: {
    height: screenHeight * 0.5,
    position: 'absolute'
  },
  close: { alignSelf: 'flex-start' },
  inactiveDot: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  noData: {
    color: colors.white,
    fontFamily: 'GothamMedium',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  },
  pagination: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    padding: 0,
    position: 'relative',
    top: screenHeight * 0.5 - 58
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
  shadowView: {
    height: screenHeight * 0.25,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  succesfulItemInformations: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  }
});
