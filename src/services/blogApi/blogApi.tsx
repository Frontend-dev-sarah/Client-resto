import axios from 'axios';
import qs from 'qs';

const getArticles = async ({ page = 1 }: { page: number }) => {
  try {
    const api = axios.create({
      timeout: 35 * 1000
    });
    const res = await api.get(
      `https://www.lieuxdevie.restaurant-uni.com/wp-json/wp/v2/pages?menu_order=10&status=publish` +
        `&${qs.stringify({ page })}`
    );
    return res.data;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getArticleImage = async ({ imgId }: { imgId: number }) => {
  try {
    const api = axios.create({
      timeout: 35 * 1000
    });
    const res = await api.get(
      `https://www.lieuxdevie.restaurant-uni.com/wp-json/wp/v2/media/${imgId}`
    );
    return res.data;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  getArticles,
  getArticleImage
};
