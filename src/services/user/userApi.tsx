/* eslint-disable @typescript-eslint/camelcase */
import Api from 'src/services/api';
import { UserData, Preferences } from 'src/models/user';
import DeviceInfo from 'react-native-device-info';

const loginUser = async (email: string, password: string) => {
  try {
    Api.setUserCredentials(email, password);
    const res = await Api.post('/auth/login', {
      email: email,
      password: password,
      app_version: DeviceInfo.getVersion()
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const registerUser = async (
  name: string,
  firstname: string,
  email: string,
  phone: string,
  password: string,
  password_confirmation: string,
  newsletter: boolean
  // sex?: string,
  // birthdate?: string
) => {
  try {
    Api.setUserCredentials(email, password);
    const res = await Api.post('/auth/signup', {
      lastname: name,
      firstname: firstname,
      email: email,
      phone: phone,
      password: password,
      password_confirmation: password_confirmation,
      newsletter: newsletter
      // sex: sex,
      // birthdate: birthdate
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const askResetPassword = async (email: string) => {
  try {
    const res = await Api.post('/password/create', {
      email: email
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const sendFirebaseToken = async (token: string) => {
  try {
    const res = await Api.post('/token', {
      token: token
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const saveNewPassword = async (
  password: string,
  password2: string,
  token: string
) => {
  try {
    const res = await Api.post('/password/reset', {
      password: password,
      password_confirmation: password2,
      token: token
    });
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getAllMealTags = async () => {
  try {
    const res = await Api.get('/meal-tags', {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getAllAllergies = async () => {
  try {
    const res = await Api.get('/meal-allergies', {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const updateUserInfos = async (data: UserData | Preferences) => {
  try {
    const res = await Api.put(`/customers/current`, data);
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const getUserInfos = async () => {
  try {
    const res = await Api.get(`/customers/current`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

const deleteAccount = async () => {
  try {
    const res = await Api.delete(`/customers/current`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};
const getAvatars = async () => {
  try {
    const res = await Api.get(`/customers/avatars`, {});
    return res;
  } catch (e) {
    return { error: { message: e.message } };
  }
};

export default {
  loginUser,
  askResetPassword,
  saveNewPassword,
  registerUser,
  getAllMealTags,
  updateUserInfos,
  getAllAllergies,
  getUserInfos,
  sendFirebaseToken,
  deleteAccount,
  getAvatars
};
