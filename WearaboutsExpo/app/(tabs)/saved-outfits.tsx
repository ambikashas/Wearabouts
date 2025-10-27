import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function SavedOutfitsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Saved Outfits</ThemedText>
      <ThemedText type="default">Your saved outfits will appear here.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
