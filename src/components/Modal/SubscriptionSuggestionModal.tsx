import React from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import I18n from 'i18n-js';
import { Overlay } from 'react-native-elements';

import colors from 'src/resources/common/colors';
import CustomButton from '../Buttons/CustomButton';
import TouchableIcon from '../Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth, screenHeight } from 'src/utils/constants';
import Appstyle from 'src/resources/common/Appstyle';
import RoutesNames from 'src/navigation/RoutesNames';
import { navigatorRef } from 'src/navigation/RootNavigator';

type SubscriptionSuggestionModalProps = {
  visible: boolean;
  onPress: Function;
  cancelable?: boolean;
  hideModal: () => void;
};

const OverlayMessageScreen = ({
  visible,
  onPress,
  hideModal
}: SubscriptionSuggestionModalProps) => {
  return (
    <Overlay
      isVisible={visible}
      overlayStyle={[styles.overlay, styles.shadow]}
      windowBackgroundColor={colors.black60}
    >
      <>
        <TouchableIcon
          icon={AppImages.images.closeIcon}
          height={20}
          width={20}
          style={styles.close}
          onPress={hideModal}
        />
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{I18n.t('subscription.try')}</Text>
          <Text style={styles.subtitle}>{I18n.t('subscription.subDesc1')}</Text>
          <Text style={styles.text}>{I18n.t('subscription.subDesc2')}</Text>
          {/* <Text style={styles.subtitle}>
            {I18n.t('subscription.discountDishes')}
          </Text>
          <Text style={styles.text}>
            {I18n.t('subscription.discountDishesSub')}
          </Text>
          <Text style={styles.subtitle}>
            {I18n.t('subscription.joinCommunity')}
          </Text>
          <Text style={styles.text}>
            {I18n.t('subscription.joinCommunitySub')}
          </Text> */}
          <CustomButton
            onPress={() => onPress()}
            customStyle={styles.button}
            primary
            outlined
            text={I18n.t('subscription.subscribe')}
          />
        </ScrollView>
      </>
    </Overlay>
  );
};

let singleton: SubscriptionSuggestionModal | null = null;

export const openOverlayMessageScreen = () => {
  singleton && singleton.open();
};

export default class SubscriptionSuggestionModal extends React.Component {
  public state = {
    visible: false
  };

  public componentDidMount(): void {
    StatusBar.setHidden(false);
    singleton = this;
  }

  public open = (): void => {
    this.setState({ visible: true });
  };

  public onPressSubscribe = async () => {
    this.setState({
      visible: false
    });
    await navigatorRef.current.navigate(RoutesNames.AccountStack);
    navigatorRef.current.navigate(RoutesNames.AccountStack, {
      screen: RoutesNames.SubscriptionDescriptionPage,
      params: {
        showHeader: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        previous_screen: "Popup d'incitation à l'abonnement"
      }
    });
  };

  public close = () => {
    this.setState({
      visible: false
    });
  };

  public render(): JSX.Element {
    const { visible } = this.state;
    return (
      <>
        <OverlayMessageScreen
          visible={visible}
          onPress={this.onPressSubscribe}
          hideModal={this.close}
        />
        {this.props.children}
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 66,
    marginTop: 40
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 6,
    zIndex: 1
  },
  container: {
    borderRadius: 24,
    maxHeight: screenHeight - 100,
    paddingHorizontal: 15,
    paddingTop: 56
  },
  overlay: {
    backgroundColor: colors.darkGrey,
    borderRadius: 24,
    height: 'auto',
    maxHeight: screenHeight - 100,
    padding: 0,
    width: screenWidth - 100
  },
  shadow: Appstyle.shadowExtraBold(),
  subtitle: {
    color: colors.white,
    fontFamily: 'GothamBold',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: 16,
    marginTop: 32,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  text: {
    color: colors.white80,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 8,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 40,
    paddingHorizontal: 20,
    textAlign: 'center'
  }
});
