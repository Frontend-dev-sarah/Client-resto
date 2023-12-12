import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from 'src/resources/common/colors';

export default function AuthLoadingPage() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' }
});
