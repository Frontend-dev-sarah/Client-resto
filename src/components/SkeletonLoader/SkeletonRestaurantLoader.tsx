import React from 'react';
import { FlatList } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';

import colors from 'resources/common/colors';
import { screenWidth } from 'src/utils/constants';

type SkeletonRestaurantLoaderProps = {};
let key = 1;

export default function SkeletonRestaurantLoader({}: SkeletonRestaurantLoaderProps) {
  function renderSkeletonloader() {
    return (
      <SkeletonContent
        isLoading={true}
        layout={[
          {
            borderRadius: 6,
            height: 184,
            marginHorizontal: 25,
            marginTop: 24,
            width: screenWidth - 50
          }
        ]}
        boneColor={colors.brownishGrey}
        highlightColor={colors.black30}
        duration={800}
      />
    );
  }

  return (
    <FlatList
      data={['', '', '']}
      renderItem={renderSkeletonloader}
      keyExtractor={() => {
        key++;
        return key.toString();
      }}
    />
  );
}
