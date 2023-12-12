import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Platform,
  Linking
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Overlay } from 'react-native-elements';
import I18n from 'i18n-js';
import NetInfo from '@react-native-community/netinfo';
import * as IntentLauncher from 'expo-intent-launcher';
import LottieView from 'lottie-react-native';

import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import CustomButton from 'components/Buttons/CustomButton';
import connection from 'src/resources/lottie/connection.json';
import geoloc from 'src/resources/lottie/geoloc.json';

type OverlayData = {
  error: string;
  subtitle: string;
  visible: boolean;
  close: (type: string | null) => void;
  loadingButton: boolean;
  type: 'internet' | 'location' | null;
};

const OverlayMessageScreen = ({
  error,
  subtitle,
  visible,
  close,
  loadingButton,
  type
}: OverlayData) => {
  function renderLottie() {
    switch (type) {
      case 'internet':
        return (
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={connection}
              hardwareAccelerationAndroid
              autoPlay
              loop={false}
            />
          </View>
        );
      case 'location':
        return (
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={geoloc}
              hardwareAccelerationAndroid
              autoPlay
              loop={false}
            />
          </View>
        );
      default:
        return <></>;
    }
  }

  return (
    <Overlay isVisible={visible} fullScreen overlayStyle={styles.overlay}>
      <>
        <View style={styles.container}>
          {renderLottie()}
          <Text style={styles.title}>{error}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <CustomButton
            text={
              type === 'internet'
                ? I18n.t('app.refresh')
                : I18n.t('app.openParameters')
            }
            onPress={() => close(type)}
            primary
            isLoading={loadingButton}
            border
          />
        </View>
        <Image
          style={styles.bottom}
          source={AppImages.images.bottomIllustration}
          resizeMode="stretch"
        />
      </>
    </Overlay>
  );
};

let singleton: Error | null = null;

export const openOverlayMessageScreen = (
  error: string,
  subtitle: string,
  type: 'internet' | 'location' | null
) => {
  singleton && singleton.open(error, subtitle, type);
};

export function checkConnection() {
  NetInfo.fetch().then(state => {
    !state.isConnected &&
      openOverlayMessageScreen(
        I18n.t('error.noInternet'),
        I18n.t('error.noInternetSubtitle'),
        'internet'
      );
  });
}

export async function checkGeoLoc() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    finalStatus = status;
  }

  // if (finalStatus !== 'granted') {
  //   openOverlayMessageScreen(
  //     I18n.t('error.noGeoLoc'),
  //     I18n.t('error.noGeoLocSubtitle'),
  //     'location'
  //   );
  // }
}

export default class Error extends React.Component {
  public state = {
    visible: false,
    error: '',
    subtitle: '',
    loadingButton: false,
    type: null
  };

  public componentDidMount() {
    StatusBar.setHidden(false);
    singleton = this;
  }

  public open = (
    error: string,
    subtitle: string,
    type: 'internet' | 'location' | null
  ) => {
    this.setState({
      visible: true,
      error: error,
      subtitle: subtitle,
      type: type
    });
  };

  private close(type: 'internet' | 'location' | null) {
    this.setState({ loadingButton: true });
    if (type === 'internet') {
      NetInfo.fetch().then(state => {
        // close the message screen only if connection is ok
        if (state.isConnected) {
          this.setState({ visible: false });
        }
      });
      setTimeout(() => {
        this.setState({ loadingButton: false });
      }, 1000);
    } else if (type === 'location') {
      if (Platform.OS === 'ios') {
        // Linking.openURL('app-settings://location/expo');
        Linking.openSettings();
      } else {
        IntentLauncher.startActivityAsync(
          IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
        );
      }
      this.setState({ loadingButton: false, visible: false });
    }
  }

  public render() {
    const { visible, error, subtitle, type } = this.state;
    return (
      <>
        <OverlayMessageScreen
          loadingButton={this.state.loadingButton}
          error={error}
          subtitle={subtitle}
          visible={visible}
          close={() => this.close(type)}
          type={type}
        />
        {!visible && <>{this.props.children}</>}
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottom: { bottom: 0, marginTop: 'auto', width: screenWidth },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    zIndex: 1
  },
  lottie: {
    height: 128,
    width: 128
  },
  lottieContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginVertical: 24,
    width: '100%'
  },
  overlay: { padding: 0 },
  subtitle: {
    color: colors.brownishGrey,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 67,
    marginTop: 16,
    textAlign: 'center'
  },
  title: {
    color: colors.black,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 35,
    textAlign: 'center'
  }
});
