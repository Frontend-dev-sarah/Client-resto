import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';

import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import Appstyle from 'src/resources/common/Appstyle';

type CardPreviewComponentProps = {
  type?: 'visa' | 'masterCard' | 'swile' | string;
  number?: string;
  onPress?: () => void;
  bordered?: boolean;
};

export default function CardPreviewComponent({
  type,
  number = '',
  onPress,
  bordered
}: CardPreviewComponentProps) {
  return (
    <TouchableRipple onPress={onPress}>
      <ImageBackground
        style={styles.background}
        source={
          type === 'visa'
            ? AppImages.images.cardVisaBgBlack
            : type === 'edenred'
            ? AppImages.images.TicketBgWhite
            : AppImages.images.MasterCardBgBlack
        }
        resizeMode="stretch"
      >
        {bordered && <View style={styles.bordered} />}
        <View style={[styles.container, bordered && styles.shadow]}>
          <Image
            source={
              type === 'visa'
                ? AppImages.images.visa
                : type === 'masterCard'
                ? AppImages.images.masterLogo
                : type === 'swile'
                ? AppImages.images.swileLogo
                : type === 'edenred'
                ? AppImages.images.edenredLogo
                : null
            }
            resizeMode="contain"
            style={[
              styles.type,
              type === 'edenred' && styles.edenredlogo,
              type === 'swile' && styles.swilelogo
            ]}
          />

          <Text style={styles.number}>
            {type !== 'edenred' ? `••••  ${number}` : '               '}
          </Text>
        </View>
      </ImageBackground>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 23,
    paddingVertical: 14
  },
  bordered: {
    borderColor: colors.paleOrange,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    bottom: 8,
    left: 7,
    position: 'absolute',
    right: 7,
    top: 8
  },
  container: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center'
  },
  edenredlogo: { height: 48, width: 60 },
  number: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 1
  },
  shadow: Appstyle.shadowExtraBold(colors.paleOrange),
  swilelogo: { height: 48, width: 48 },
  type: {
    minHeight: 48
  }
});
