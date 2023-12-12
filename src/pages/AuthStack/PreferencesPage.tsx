/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

import { UserData, MealTag } from 'models/user';
import I18n from 'resources/localization/I18n';
import colors from 'src/resources/common/colors';
import Header from 'src/components/Headers/Header';
import PreferencesList from 'src/components/Preferences/PreferencesList';
import userApi from 'src/services/user/userApi';
import BottomFab from 'src/components/Fabs/BottomFab';
import { SubscriptionConfirModal } from 'src/components/Modal/SubscriptionConfirModal';
import { RouteProp, StackActions } from '@react-navigation/native';
import { AccountStackParamList } from 'src/navigation/AccountStack';
import { AuthConsumer } from 'src/store/AuthContext';
import { DistrictConsumer } from 'src/store/DistrictContext';

type PreferencesPageRouteProp = RouteProp<
  AccountStackParamList,
  'PreferencesPage'
>;

type PreferencesPageProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  user: UserData;
  route: PreferencesPageRouteProp;
  storeUser: Function;
  getRestaurants: Function;
};

function PreferencesPage({
  navigation,
  route,
  user,
  storeUser,
  getRestaurants
}: PreferencesPageProps) {
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(
    route.params && route.params.showSubscriptionConfirm
      ? route.params.showSubscriptionConfirm
      : false
  );

  useEffect(() => {
    user &&
      user.meal_tags &&
      setSelectedPrefs(
        user.meal_tags.reduce((res: string[], item: MealTag) => {
          res.push(item.id.toString());
          return res;
        }, [])
      );
    user &&
      user.meal_allergies &&
      setSelectedAllergies(
        user.meal_allergies.reduce((res: string[], item: MealTag) => {
          res.push(item.id.toString());
          return res;
        }, [])
      );
  }, []);

  async function submit() {
    setLoading(true);
    const dataToSend = {
      meal_tags: selectedPrefs,
      meal_allergies: selectedAllergies
    };
    const res = await userApi.updateUserInfos(dataToSend);

    if (!res.error) {
      const infos = await userApi.getUserInfos();
      if (!infos.error) {
        storeUser(infos);
      }
      getRestaurants();
      const popAction = StackActions.pop(2);
      navigation.dispatch(popAction);
    } else {
      Alert.alert(I18n.t('error.error'), I18n.t('app.tryLater'), [
        { text: I18n.t('app.ok'), style: 'cancel' }
      ]);
    }
    setLoading(false);
  }

  async function updateList(id: number, allergy: boolean) {
    if (!allergy) {
      const tmp = selectedPrefs;
      const index = await selectedPrefs.indexOf(id.toString());

      if (index !== -1) {
        await tmp.splice(index, 1);
        await setSelectedPrefs(tmp);
      } else {
        await tmp.push(id.toString());
        await setSelectedPrefs(tmp);
      }
    } else {
      const tmp = selectedAllergies;
      const index = await selectedAllergies.indexOf(id.toString());

      if (index !== -1) {
        await tmp.splice(index, 1);
        await setSelectedAllergies(tmp);
      } else {
        await tmp.push(id.toString());
        await setSelectedAllergies(tmp);
      }
    }
  }

  return (
    <View style={styles.container}>
      <SubscriptionConfirModal
        visible={modalVisible}
        onPress={() => setModalVisible(false)}
        hideModal={() => setModalVisible(false)}
      />
      <Header backIcon={!route.params} navigation={navigation} />
      <BottomFab active onPress={submit} isLoading={loading} grey checkIcon />
      <ScrollView style={styles.paddingView}>
        <Text style={styles.title}>{I18n.t('preferences.preferences')}</Text>
        <Text style={styles.subtitle}>
          {I18n.t('preferences.preferencesSub')}
        </Text>
        <PreferencesList onValueChange={updateList} />
        <Text style={styles.title}>{I18n.t('preferences.allergy')}</Text>
        <Text style={styles.subtitle}>{I18n.t('preferences.allergySub')}</Text>
        <PreferencesList onValueChange={updateList} allergy />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1
  },
  paddingView: {
    marginBottom: 45,
    paddingHorizontal: 25
  },
  subtitle: {
    color: colors.textGrey,
    fontFamily: 'Gotham',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 18,
    marginBottom: 32,
    paddingRight: 10
  },
  title: {
    color: colors.white,
    fontFamily: 'MPLUSRoundedBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    marginBottom: 16,
    marginTop: 10
  }
});

export default (props: JSX.IntrinsicAttributes & PreferencesPageProps) => (
  <AuthConsumer>
    {ctx => (
      <DistrictConsumer>
        {districtCtx =>
          ctx &&
          districtCtx && (
            <PreferencesPage
              user={ctx.user}
              storeUser={ctx.storeUser}
              getRestaurants={districtCtx.getRestaurants}
              {...props}
            />
          )
        }
      </DistrictConsumer>
    )}
  </AuthConsumer>
);
