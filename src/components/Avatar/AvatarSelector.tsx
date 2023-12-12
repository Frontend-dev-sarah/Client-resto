import { TouchableRipple } from 'react-native-paper';
import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import I18n from 'resources/localization/I18n';

import colors from 'src/resources/common/colors';
import { Avatar } from 'src/models/user';
import { FlatList } from 'react-native-gesture-handler';

type AvatarSelectorProps = {
  avatarsList: Avatar[];
  onSelect: Function;
  selectedAvatar?: Avatar;
};

export default function AvatarSelector({
  avatarsList,
  onSelect,
  selectedAvatar
}: AvatarSelectorProps) {
  function renderItem(avatar: Avatar) {
    const isSelected = selectedAvatar && selectedAvatar.url === avatar.url;
    return (
      <TouchableRipple
        onPress={() =>
          onSelect(isSelected ? { url: '', name: undefined } : avatar)
        }
      >
        <Image
          source={{ uri: avatar.url }}
          style={[styles.img, isSelected && styles.selected]}
        />
      </TouchableRipple>
    );
  }

  return (
    <>
      <Text style={styles.title}>{I18n.t('account.avatar')}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={avatarsList}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={styles.flatlist}
        keyExtractor={(item, index) => item.name || index.toString() + index}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<></>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: colors.transparent
  },
  flatlist: { paddingHorizontal: 25 },
  separator: { width: 12 },
  selected: {
    borderWidth: 3,
    borderColor: colors.paleOrange
  },
  title: {
    color: colors.white60,
    marginHorizontal: 25,
    marginBottom: 10
  }
});
