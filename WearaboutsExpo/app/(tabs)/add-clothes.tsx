import React, { useState } from 'react';
import { StyleSheet, Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddClothesScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Upload Clothes
      </ThemedText>

      <Button title="Choose Image from Device" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  imagePreview: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
