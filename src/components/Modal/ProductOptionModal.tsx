import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'i18n-js';

import colors from 'src/resources/common/colors';
import { Modal } from './Modal';
import AppImages from 'src/resources/common/AppImages';
import { BookingConsumer } from 'src/store/BookingContext';
import CustomButton from '../Buttons/CustomButton';
import TouchableIcon from '../Buttons/TouchableIcon';
import { Product } from 'src/models/products';
import PickerSelect from '../Form/PickerSelect';

type ProductOptionModalProps = {
  visible: boolean;
  product?: Product;
  hideModal: () => void;
  submit: Function;
};

function ProductOptionModal({
  visible,
  product,
  hideModal,
  submit
}: ProductOptionModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function onSubmit() {
    setSubmitting(true);
    await submit(product, selectedOptionId);
    hideModal();
    setSubmitting(false);
  }

  useEffect(() => {
    if (
      product &&
      product.options &&
      product.options[0] &&
      product.options[0].id
    ) {
      setSelectedOptionId(product.options[0].id); // set default value to first option
    }
  }, [product]);

  const children = (
    <View style={styles.container}>
      <TouchableIcon
        icon={AppImages.images.closeIcon}
        style={styles.close}
        height={20}
        width={20}
        onPress={hideModal}
      />
      <Text style={styles.title}>
        {I18n.t('basket.chooseOption', {
          productName: product ? product.name : ''
        })}
      </Text>
      <PickerSelect
        onChange={setSelectedOptionId}
        items={
          (product &&
            product.options &&
            product.options.reduce((res, option) => {
              res.push({ name: option.name, id: option.id });
              return res;
            }, [])) ||
          []
        }
        value={selectedOptionId}
      />
      <CustomButton
        text={I18n.t('app.ok')}
        onPress={onSubmit}
        primary
        customStyle={styles.btn}
        disabled={!selectedOptionId}
        isLoading={submitting}
      />
    </View>
  );

  return (
    <Modal
      hideModal={hideModal}
      visible={visible}
      children={children}
      onPress={hideModal}
      cancelable
      noButton
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 10
  },
  close: { position: 'absolute', right: 0, top: 0 },
  container: {
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 27,
    paddingVertical: 56
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 18,
    letterSpacing: 0,
    marginHorizontal: 10,
    textAlign: 'center'
  }
});

export default (props: JSX.IntrinsicAttributes & ProductOptionModalProps) => (
  <BookingConsumer>
    {ctx =>
      ctx && (
        <ProductOptionModal
          visible={ctx.productWithOptions !== false}
          product={ctx.productWithOptions}
          hideModal={() => {
            ctx.setProductWithOptions(false);
            ctx.setAddProductHasSucceed(false);
          }}
          submit={ctx.addToBasket}
          {...props}
        />
      )
    }
  </BookingConsumer>
);
