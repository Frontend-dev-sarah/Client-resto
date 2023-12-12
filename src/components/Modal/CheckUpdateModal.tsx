import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Linking
} from 'react-native';
import { Overlay } from 'react-native-elements';
import I18n from 'i18n-js';
import VersionCheck from 'react-native-version-check';

import colors from 'resources/common/colors';
import AppImages from 'resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import CustomButton from 'components/Buttons/CustomButton';

type OverlayData = {
  visible: boolean;
  goToUpdate: () => void;
  storeUrl: string;
};

const OverlayMessageScreen = ({ visible, goToUpdate }: OverlayData) => {
  return (
    <Overlay isVisible={visible} fullScreen overlayStyle={styles.overlay}>
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t('app.updateAvailable')}</Text>
          <Text style={styles.subtitle}>{I18n.t('app.doUpdate')}</Text>
          <CustomButton
            text={I18n.t('app.updateApp')}
            onPress={goToUpdate}
            primary
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

export const openOverlayMessageScreen = (storeUrl: string) => {
  singleton && singleton.open(storeUrl);
};

export async function checkUpdateAvailable() {
  const updateIsNeeded = await VersionCheck.needUpdate();
  if (updateIsNeeded && updateIsNeeded.isNeeded && updateIsNeeded.storeUrl) {
    openOverlayMessageScreen(updateIsNeeded.storeUrl);
  }
}

export default class Error extends React.Component {
  public state = {
    visible: false,
    storeUrl: ''
  };

  public componentDidMount() {
    StatusBar.setHidden(false);
    singleton = this;
  }
  public open = (storeUrl: string) => {
    this.setState({
      visible: true,
      storeUrl: storeUrl
    });
  };

  public goToUpdate(storeUrl: string) {
    Linking.openURL(storeUrl);
  }

  public render() {
    const { visible, storeUrl } = this.state;
    return (
      <>
        <OverlayMessageScreen
          visible={visible}
          goToUpdate={() => this.goToUpdate(storeUrl)}
          storeUrl={storeUrl}
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
  overlay: { padding: 0, backgroundColor: colors.darkGreyLight },
  subtitle: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 67,
    marginTop: 16,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 35,
    textAlign: 'center'
  }
});
