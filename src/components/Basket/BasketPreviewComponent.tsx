import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

import { screenHeight } from 'src/utils/constants';
import { Product, Basket } from 'src/models/products';
import { BookingConsumer } from 'src/store/BookingContext';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import RoutesNames from 'src/navigation/RoutesNames';
import BasketPreviewHeader from './BasketPreviewHeader';
import BasketContent from './BasketContent';
import { Overlay } from 'react-native-elements';
import colors from 'src/resources/common/colors';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import { AuthConsumer } from 'src/store/AuthContext';
import { PlaceChoice } from 'src/models/restaurants';

type BasketPreviewComponentProps = {
  basket?: Basket;
  getTotalPrice?: Function;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  contentIsLoading?: boolean;
  placeChoice?: PlaceChoice;
};

function BasketPreviewComponent({
  basket,
  navigation,
  contentIsLoading,
  placeChoice
}: BasketPreviewComponentProps) {
  const [isSheetOpened, setSheetOpened] = useState<boolean>(false);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (!basket || (basket && basket.length === 0)) {
      setSheetOpened(false);
    }
  }, [basket]);

  function onPressHeader() {
    if (!isSheetOpened) {
      sheetRef.current.snapTo(1);
    } else {
      sheetRef.current.snapTo(0);
    }
  }

  function onPressProduct(product: Product) {
    navigation.navigate(RoutesNames.ProductDetailsPage, {
      product: product
    });
  }

  if (
    !basket ||
    (basket && basket.length === 0) ||
    !placeChoice ||
    placeChoice.length === 0
  ) {
    return <></>;
  } else {
    return (
      <>
        {isSheetOpened && <View style={styles.overlay} />}
        <View pointerEvents="box-none" style={styles.drawerMainContainer}>
          <BottomSheet
            enabledGestureInteraction={!contentIsLoading}
            ref={sheetRef}
            // enabledHeaderGestureInteraction={false} => to scroll horiazontally inside header
            enabledContentTapInteraction={false}
            enabledContentGestureInteraction={false}
            snapPoints={[isIphoneX ? 88 + getBottomSpace() : 88, screenHeight]}
            onOpenStart={() => setSheetOpened(true)}
            onCloseEnd={() => setSheetOpened(false)}
            renderHeader={() => (
              <BasketPreviewHeader
                onPressProduct={onPressProduct}
                opened={isSheetOpened}
                onPress={onPressHeader}
              />
            )}
            renderContent={() => (
              <BasketContent onPressProduct={onPressProduct} />
            )}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  drawerMainContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 11
  },
  overlay: {
    backgroundColor: colors.black60,
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 10
  }
});

export default (
  props: JSX.IntrinsicAttributes & BasketPreviewComponentProps
) => (
  <AuthConsumer>
    {authCtx => (
      <BookingConsumer>
        {ctx =>
          ctx &&
          authCtx && (
            <BasketPreviewComponent
              basket={ctx.basket}
              getTotalPrice={ctx.getTotalPrice}
              contentIsLoading={authCtx.contentIsLoading}
              placeChoice={ctx.placeChoice}
              {...props}
            />
          )
        }
      </BookingConsumer>
    )}
  </AuthConsumer>
);
