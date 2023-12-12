import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  Platform,
  InputAccessoryView,
  Button
} from 'react-native';
import { TextInput, TouchableRipple } from 'react-native-paper';
import colors from 'src/resources/common/colors';
import AppImages from 'src/resources/common/AppImages';
import { verifyEmail, verifyPassword } from 'src/utils/CheckCredentials';
import TouchableIcon from 'components/Buttons/TouchableIcon';
import { isExpoApp, screenWidth } from 'src/utils/constants';
import Constants from 'expo-constants';

type CustomInputTextProps = {
  value: string;
  onChangeValue: Dispatch<SetStateAction<string>>;
  label: string;
  placeholder: string;
  type?: 'email-address' | 'password' | 'default' | 'numeric';
  disabled?: boolean;
  hideError?: boolean;
  autoFocus?: boolean;
  subText?: string;
  inputError?: boolean;
  customStyle?: StyleProp<ViewStyle>;
  maxLength?: number;
  onPress?: Function;
  blockPassword?: boolean;
  onValidate?: Function;
  uppercase?: boolean;
};

function InputText({
  value,
  onChangeValue,
  label,
  placeholder,
  type,
  disabled,
  hideError = false,
  autoFocus = false,
  subText,
  inputError,
  customStyle,
  maxLength,
  onPress,
  onValidate,
  blockPassword,
  uppercase
}: CustomInputTextProps) {
  const [passwordHidden, setPasswordHidden] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const theme = {
    colors: {
      text: colors.white,
      primary: colors.white,
      accent: colors.textGrey,
      placeholder: colors.textGrey,
      error: colors.deepRose
    }
  };
  const inputRef = useRef(null);
  const inputAccessoryViewID = label;

  useEffect(() => {
    if (type === 'password') {
      setPasswordHidden(true);
    }
  }, []);

  useEffect(() => {
    if (!inputError) {
      setError(false);
    }
  }, [inputError]);

  function onSubmit() {
    if (!hideError) {
      if (inputError) {
        setError(true);
      }
      if (type === 'email-address') {
        if (!verifyEmail(value)) {
          setError(true);
        } else if (error) {
          setError(false);
        }
      }
      if (type === 'password') {
        if (!verifyPassword(value)) {
          setError(true);
        } else if (error) {
          setError(false);
        }
      }
    }
    setFocused(false);
  }

  return (
    <View style={styles.container}>
      {subText && <Text style={styles.subText}>{subText}</Text>}

      <TextInput
        textContentType={
          blockPassword ? 'none' : type === 'password' ? 'password' : undefined
        }
        autoCorrect={false}
        inputAccessoryViewID={inputAccessoryViewID}
        maxLength={maxLength}
        ref={inputRef}
        theme={theme}
        keyboardType={type !== 'password' ? type : 'default'}
        autoCapitalize={
          uppercase ? 'characters' : type === 'email-address' ? 'none' : 'words'
        }
        returnKeyLabel={'OK'}
        secureTextEntry={passwordHidden}
        label={value.length !== 0 || focused ? label : undefined}
        value={value}
        onChangeText={onChangeValue}
        error={error}
        placeholder={focused ? undefined : placeholder}
        style={[
          styles.input,
          type === 'password' && styles.paddingRight,
          customStyle
        ]}
        disabled={disabled}
        underlineColor={
          focused || value.length === 0 ? colors.textGrey : colors.transparent
        }
        onEndEditing={onSubmit}
        onSubmitEditing={onValidate}
        onFocus={() => {
          onPress && onPress();
          setFocused(true);
        }}
        autoFocus={autoFocus}
      />
      {type === 'password' && (
        <TouchableIcon
          icon={
            passwordHidden
              ? AppImages.images.iconEyeOff
              : AppImages.images.iconEyeOn
          }
          onPress={() => setPasswordHidden(!passwordHidden)}
          width={20}
          height={20}
          style={styles.eye}
          color={colors.white}
        />
      )}
      {type === 'numeric' && !isExpoApp && Platform.OS === 'ios' && (
        <InputAccessoryView
          nativeID={inputAccessoryViewID}
          backgroundColor={colors.black}
          style={{
            width: screenWidth
          }}
          children={
            <TouchableRipple style={styles.ok}>
              <Button
                onPress={() => {
                  return;
                }}
                title="OK"
              />
            </TouchableRipple>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  eye: {
    bottom: 0,
    position: 'absolute',
    right: 0
  },
  input: {
    backgroundColor: colors.transparent,
    borderRadius: 6,
    fontFamily: 'Gotham',
    fontSize: 16,
    height: 56,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 0,
    width: '100%'
  },
  ok: {
    marginLeft: 'auto',
    paddingHorizontal: 10
  },
  paddingRight: {
    paddingRight: 50
  },
  subText: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16
  }
});

export default InputText;
