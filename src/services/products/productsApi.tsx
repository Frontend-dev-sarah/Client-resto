/* eslint-disable @typescript-eslint/camelcase */
import Api from 'src/services/api';

const getAllProducts = async (page = 1) => {
  try {
    const res = await Api.get('/products', {
      page: page
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const askProducts = async (products: number[]) => {
  try {
    const res = await Api.post(`/orders/claim`, {
      products: products
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  getAllProducts,
  askProducts
};
