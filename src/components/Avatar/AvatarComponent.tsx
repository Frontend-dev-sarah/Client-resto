import { Avatar } from 'react-native-paper';
import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

import colors from 'src/resources/common/colors';
import { AuthConsumer } from 'src/store/AuthContext';
import { UserData } from 'src/models/user';

type AvatarComponentProps = {
  user?: UserData;
  customStyle?: ViewStyle;
  textStyle?: TextStyle;
  size?: number;
  firstName?: string;
  name?: string;
  avatar?: string;
};

function AvatarComponent({
  user,
  customStyle,
  textStyle,
  size,
  firstName,
  name,
  avatar
}: AvatarComponentProps) {
  const Firstname =
    (firstName && firstName.charAt(0)) ||
    (user && user.firstname && user.firstname.length > 0
      ? user.firstname.charAt(0)
      : '');
  const Name =
    (name && name.charAt(0)) ||
    (user && user.lastname && user.lastname.length > 0
      ? user.lastname.charAt(0)
      : '');
  const label = Firstname + Name;
  if (user && !user.avatar) {
    return (
      <Avatar.Text
        label={label}
        style={[styles.container, customStyle]}
        labelStyle={[styles.text, textStyle]}
        size={size || undefined}
      />
    );
  } else if ((user && user.avatar) || avatar) {
    return (
      <Avatar.Image
        style={[styles.image, customStyle]}
        size={size || 100}
        source={{ uri: avatar ? avatar : user && user.avatar && user.avatar }}
      />
    );
  } else return <></>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGrey,
    borderRadius: 12,
    height: 104,
    width: 75
  },
  text: {
    color: colors.black60,
    fontFamily: 'GothamBold',
    fontSize: 25,
    letterSpacing: 0
  },
  image: { backgroundColor: colors.transparent }
});

export default (props: JSX.IntrinsicAttributes & AvatarComponentProps) => (
  <AuthConsumer>
    {authCtx => authCtx && <AvatarComponent user={authCtx.user} {...props} />}
  </AuthConsumer>
);
