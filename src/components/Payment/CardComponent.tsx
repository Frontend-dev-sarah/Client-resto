import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ViewStyle
} from 'react-native';

import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { TouchableRipple } from 'react-native-paper';
import { dateIsPassed } from 'src/utils/TimeHelper';

type CardComponentProps = {
  type?: 'visa' | 'masterCard' | 'edenred' | string;
  number?: string;
  name?: string;
  date?: string;
  noType?: boolean;
  customStyle?: ViewStyle;
  onPress?: () => void;
  bordered?: boolean;
};

export default function CardComponent({
  type,
  number = '',
  name = '',
  date = '',
  noType,
  customStyle,
  onPress,
  bordered
}: CardComponentProps) {
  return (
    <TouchableRipple onPress={onPress}>
      <ImageBackground
        style={[customStyle]}
        source={
          type === 'visa' || noType
            ? AppImages.images.cardVisaBgBlack
            : type === 'edenred'
            ? AppImages.images.TicketBgWhite
            : AppImages.images.MasterCardBgBlack
        }
        resizeMode="stretch"
      >
        <View style={[styles.container, bordered && styles.bordered]}>
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
            style={[
              styles.type,
              noType && styles.noType,
              type === 'edenred' && styles.edenredlogo,
              type === 'swile' && styles.swilelogo
            ]}
          />

          <Text style={styles.number}>
            {(type !== 'edenred' || noType) && number}
          </Text>
          <View style={styles.row}>
            <Text style={styles.name}>
              {(type !== 'edenred' || noType) && name}
            </Text>
            <Text
              style={[
                styles.name,
                styles.marginLeft,
                dateIsPassed(
                  parseInt(date.split('/')[0]),
                  parseInt(date.split('/')[1])
                ) && styles.expired
              ]}
            >
              {(type !== 'edenred' || noType) && date}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  bordered: { borderColor: colors.paleOrange, borderWidth: 2 },
  container: {
    borderRadius: 10,
    marginHorizontal: 17,
    marginVertical: 21,
    paddingHorizontal: 20
  },
  edenredlogo: { height: 40, width: 60 },
  expired: {
    color: colors.red
  },
  marginLeft: {
    marginLeft: 'auto'
  },
  name: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0.25,
    marginTop: 16
  },
  noType: {
    tintColor: colors.transparent
  },
  number: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 32
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 20
  },
  swilelogo: { height: 40, width: 40 },
  type: {
    marginTop: 30,
    minHeight: 40
  }
});
