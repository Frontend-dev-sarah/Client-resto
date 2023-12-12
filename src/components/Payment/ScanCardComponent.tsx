import React, { Component, useEffect, useState } from 'react';
import { RNCamera } from 'react-native-camera';

import { IconButton } from 'react-native-paper';
import colors from 'src/resources/common/colors';
import I18n from 'resources/localization/I18n';
import { Alert, StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'src/utils/constants';
import {
  verifyCreditCardNumber,
  verifyNumberType
} from 'src/utils/CheckCredentials';

import BarcodeMask from 'react-native-barcode-mask';

type ScanCardComponentProps = {
  setNumber: Function;
  setDate: Function;
  cameraOpened: boolean;
  setCameraOpened: Function;
};

export default function ScanCardComponent({
  setNumber,
  setDate,
  cameraOpened,
  setCameraOpened
}: ScanCardComponentProps) {
  async function detectText(text: any) {
    let number: string;
    let date: string;
    text.textBlocks.map((block: { value: string }) => {
      if (block.value && !number && verifyCreditCardNumber(block.value)) {
        number = block.value;
      } else if (block.value && block.value.includes('/') && !date) {
        const splitIndex = block.value.indexOf('/');
        const month =
          splitIndex != -1 &&
          block.value
            .split('/')[0]
            .replace(' ', '')
            .slice(-2);
        const year =
          splitIndex != -1 &&
          block.value
            .split('/')[1]
            .replace(' ', '')
            .slice(0, 2);
        const value = `${month} / ${year}`;

        if (
          month &&
          verifyNumberType(month) &&
          year &&
          verifyNumberType(year)
        ) {
          date = value;
        }
      }
      if (number && date) {
        setNumber(number);
        setDate(date);
        setCameraOpened(false);
      }
    });
  }

  if (!cameraOpened) {
    return <></>;
  } else {
    return (
      <RNCamera
        captureAudio={false}
        onStatusChange={status => {
          if (status.cameraStatus && status.cameraStatus !== 'READY') {
            setCameraOpened(false);
            Alert.alert(
              I18n.t('app.permission'),
              I18n.t('app.cameraPermission'),
              [
                {
                  text: I18n.t('app.ok'),
                  style: 'cancel'
                }
              ]
            );
          }
        }}
        style={styles.camera}
        onTextRecognized={detectText}
      >
        <BarcodeMask width={screenWidth - 50} />
      </RNCamera>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2
  }
});
