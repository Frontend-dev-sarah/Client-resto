/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import PreferenceItem from './PreferenceItem';
import { MealTag, UserData } from 'src/models/user';
import userApi from 'src/services/user/userApi';
import { AuthConsumer } from 'src/store/AuthContext';

type PreferencesListProps = {
  onValueChange: Function;
  allergy?: boolean;
  user?: UserData;
};

function PreferencesList({
  onValueChange,
  allergy,
  user
}: PreferencesListProps) {
  const [mealTags, setMealtTags] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [initialAllergies, setInitialAllergies] = useState<string[]>([]);
  const [initialTags, setInitialTags] = useState<string[]>([]);

  useEffect(() => {
    getMealTags();
    getAllergies();

    user &&
      user.meal_tags &&
      setInitialTags(
        user.meal_tags.reduce((res: string[], item: MealTag) => {
          res.push(item.id.toString());
          return res;
        }, [])
      );

    user &&
      user.meal_allergies &&
      setInitialAllergies(
        user.meal_allergies.reduce((res: string[], item: MealTag) => {
          res.push(item.id.toString());
          return res;
        }, [])
      );
  }, []);

  async function getMealTags() {
    const res = await userApi.getAllMealTags();
    if (!res.error) {
      setMealtTags(res);
    }
  }
  async function getAllergies() {
    const res = await userApi.getAllAllergies();
    if (!res.error) {
      setAllergies(res);
    }
  }

  function renderItem(item: MealTag) {
    return (
      <PreferenceItem
        key={item.id}
        id={item.id.toString()}
        switchItemState={onValueChange}
        name={item.name}
        icon={item.icon}
        allergy={allergy}
        initialSelected={
          !allergy
            ? initialTags.indexOf(item.id.toString()) !== -1
            : initialAllergies.indexOf(item.id.toString()) !== -1
        }
      />
    );
  }
  return (
    <View style={styles.rowItems}>
      {!allergy
        ? mealTags.map((item: MealTag) => renderItem(item))
        : allergies.map((item: MealTag) => renderItem(item))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24
  }
});

export default (props: JSX.IntrinsicAttributes & PreferencesListProps) => (
  <AuthConsumer>
    {ctx => ctx && <PreferencesList user={ctx.user} {...props} />}
  </AuthConsumer>
);
