import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Overlay } from 'react-native-elements';
import colors from 'src/resources/common/colors';
import { screenWidth } from 'src/utils/constants';
import Appstyle from 'src/resources/common/Appstyle';
import CustomButton from '../Buttons/CustomButton';
import I18n from 'resources/localization/I18n';
import bookingApi from 'src/services/bookingApi/bookingApi';

// This modal is displayed when we receive a push notification that informs app
// that another client want to join our table in restaurant

type JoiningClientModalProps = {
  visible: boolean;
  cancelable?: boolean;
  hideModal: () => void;
  title: string;
  subtitle: string;
  askingId: string;
  isLoading: boolean;
  setLoading: Function;
};

const OverlayMessageScreen = ({
  visible,
  hideModal,
  title,
  subtitle,
  askingId,
  isLoading,
  setLoading
}: JoiningClientModalProps) => {
  async function submitResponse(accept: boolean) {
    __DEV__ && hideModal();
    setLoading(true);
    const resp = await bookingApi.responseAskJoin(askingId, accept);
    console.log('==RESPONSE JOIN TABLE==>', resp);
    if (resp && !resp.error) {
      hideModal();
    } else {
      console.log('==RESPONSE JOIN TABLE FAILED==>', resp);
    }
    setLoading(false);
  }

  return (
    <Overlay
      isVisible={visible}
      overlayStyle={[styles.overlay, styles.shadow]}
      windowBackgroundColor={colors.black60}
    >
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <CustomButton
            customStyle={styles.btn}
            text={I18n.t('app.accept')}
            onPress={() => {
              submitResponse(true);
            }}
            inactive={isLoading}
            isLoading={isLoading}
          />
          <CustomButton
            customStyle={styles.btn}
            outlined
            text={I18n.t('app.deny')}
            onPress={() => {
              submitResponse(false);
            }}
            inactive={isLoading}
            isLoading={isLoading}
          />
        </View>
      </>
    </Overlay>
  );
};

let singleton: JoiningClientModal | null = null;

export const openOverlayMessageScreen = (
  title: string,
  subtitle: string,
  askingId: string
) => {
  singleton && singleton.open(title, subtitle, askingId);
};

export default class JoiningClientModal extends React.Component {
  public state = {
    visible: false,
    title: '',
    subtitle: '',
    askingId: '',
    isLoading: false
  };

  public componentDidMount(): void {
    StatusBar.setHidden(false);
    singleton = this;
  }

  public open = (title: string, subtitle: string, askingId: string): void => {
    this.setState({
      visible: true,
      title: title,
      subtitle: subtitle,
      askingId: askingId
    });
  };

  public close = () => {
    this.setState({
      visible: false
    });
  };

  public render(): JSX.Element {
    const { visible, title, subtitle, askingId, isLoading } = this.state;

    return (
      <>
        <OverlayMessageScreen
          visible={visible}
          hideModal={this.close}
          title={title}
          subtitle={subtitle}
          askingId={askingId}
          isLoading={isLoading}
          setLoading={(loading: boolean) => {
            return this.setState({ isLoading: loading });
          }}
        />
        {this.props.children}
      </>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 10
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: 24,
    paddingBottom: 56,
    paddingHorizontal: 27,
    paddingTop: 56
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
    marginVertical: 32,
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
