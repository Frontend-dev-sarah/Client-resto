import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal as PaperModal, Portal } from 'react-native-paper';

import colors from 'src/resources/common/colors';
import TouchableIcon from '../Buttons/TouchableIcon';
import AppImages from 'src/resources/common/AppImages';
import Appstyle from 'src/resources/common/Appstyle';

type ModalProps = {
  children: JSX.Element;
  visible: boolean;
  onPress: Function;
  cancelable?: boolean;
  hideModal: () => void;
  noButton?: boolean;
  dismissable?: boolean;
};

export function Modal({
  children,
  visible,
  onPress,
  cancelable,
  hideModal,
  noButton,
  dismissable
}: ModalProps) {
  return (
    <>
      <Portal>
        <PaperModal
          visible={visible}
          contentContainerStyle={[styles.container, styles.shadow]}
          dismissable={dismissable !== undefined ? dismissable : true}
          onDismiss={hideModal}
        >
          <View style={[styles.modal]}>{children}</View>
          {!cancelable && !noButton && (
            <TouchableIcon
              icon={AppImages.images.checkIcon}
              height={20}
              width={20}
              style={styles.button}
              onPress={() => onPress()}
            />
          )}
          {cancelable && !noButton && (
            <View style={styles.row}>
              <TouchableIcon
                icon={AppImages.images.iconEyeOn}
                height={20}
                width={20}
                style={[styles.button, styles.cancel]}
                onPress={() => onPress()}
              />
              <TouchableIcon
                icon={AppImages.images.iconEyeOn}
                height={20}
                width={20}
                style={[styles.button, styles.ok]}
                onPress={() => onPress()}
              />
            </View>
          )}
        </PaperModal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    height: 56,
    marginTop: -28,
    width: 56
  },
  cancel: {
    marginRight: 25
  },
  container: {
    borderRadius: 24,
    marginHorizontal: 50
  },
  modal: {
    backgroundColor: colors.darkGrey,
    borderRadius: 24
  },
  ok: { alignSelf: 'flex-end' },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  shadow: Appstyle.shadowExtraBold()
});
