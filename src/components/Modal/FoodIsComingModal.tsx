import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Overlay } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import waitingTable from 'src/resources/lottie/waitingTable.json';
import colors from 'src/resources/common/colors';
import TouchableIcon from '../Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import { screenWidth } from 'src/utils/constants';
import Appstyle from 'src/resources/common/Appstyle';

type FoodIsComingModalProps = {
  visible: boolean;
  cancelable?: boolean;
  hideModal: () => void;
  title: string;
  subtitle: string;
};

const OverlayMessageScreen = ({
  visible,
  hideModal,
  title,
  subtitle
}: FoodIsComingModalProps) => {
  return (
    <Overlay
      isVisible={visible}
      overlayStyle={[styles.overlay, styles.shadow]}
      windowBackgroundColor={colors.black60}
    >
      <>
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={waitingTable}
              hardwareAccelerationAndroid
              autoPlay
              loop={true}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableIcon
          icon={AppImages.images.checkIcon}
          height={20}
          color={colors.white}
          width={20}
          style={styles.button}
          onPress={hideModal}
        />
      </>
    </Overlay>
  );
};

let singleton: FoodIsComingModal | null = null;

export const openOverlayMessageScreen = (title: string, subtitle: string) => {
  singleton && singleton.open(title, subtitle);
};

export default class FoodIsComingModal extends React.Component {
  public state = {
    visible: false,
    title: '',
    subtitle: ''
  };

  public componentDidMount(): void {
    StatusBar.setHidden(false);
    singleton = this;
  }

  public open = (title: string, subtitle: string): void => {
    this.setState({ visible: true, title: title, subtitle: subtitle });
  };

  public close = () => {
    this.setState({
      visible: false
    });
  };

  public render(): JSX.Element {
    const { visible, title, subtitle } = this.state;
    return (
      <>
        <OverlayMessageScreen
          visible={visible}
          hideModal={this.close}
          title={title}
          subtitle={subtitle}
        />
        {this.props.children}
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: colors.paleOrange,
    borderRadius: 28,
    bottom: 5,
    height: 56,
    position: 'absolute',
    width: 56,
    zIndex: 10000
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: 24,
    paddingBottom: 138,
    paddingHorizontal: 27,
    paddingTop: 56
  },
  lottie: {
    height: 128,
    width: 128
  },
  lottieContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
    marginVertical: 50,
    width: '100%'
  },
  overlay: {
    backgroundColor: colors.transparent,
    height: 'auto',
    padding: 0,
    paddingBottom: 28,
    width: screenWidth - 100
  },
  shadow: Appstyle.shadowExtraBold(),
  subtitle: {
    color: colors.white,
    fontFamily: 'Gotham',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 0.25,
    lineHeight: 18,
    marginHorizontal: 20,
    marginTop: 32,
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
