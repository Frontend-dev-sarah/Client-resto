/* eslint-disable no-useless-escape */
export const verifyPassword = (password: string) => {
  return !(
    password.length < 8 ||
    !/([A-Z]+)/g.test(password) ||
    !password.match(/\d+/g)
  );
};

export const verifyEmail = (email: string) => {
  const reg = /^\w+([\.\+-]?\w+)*@\w+([\..-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email);
};

export const verifyPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length === 0) {
    return true;
  } else {
    return phoneNumber.match('^[0-9]+$');
  }
};

export function verifyDate(date: string) {
  const actualYear = new Date()
    .getFullYear()
    .toString()
    .slice(-2);

  const actualMonth = new Date().getMonth() + 1;

  if (date.slice(-2) > actualYear && date.slice(0, 2) <= '12') {
    return true;
  }
  if (
    date.slice(-2) === actualYear &&
    parseInt(date.slice(0, 2)) >= actualMonth
  ) {
    return true;
  } else return false;
}

export function verifyCreditCardNumber(number: string) {
  const reg = /^[0-9 ]*$/;
  return number.length === 19 && reg.test(number);
}

export function verifyNumberType(number: string) {
  const reg = /^[0-9]*$/;
  return reg.test(number);
}
