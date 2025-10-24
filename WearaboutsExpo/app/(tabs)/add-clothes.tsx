import { useState } from 'react';
import { StyleSheet, View, Button, Image, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';

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
        Add To Your Closet
      </ThemedText>

      <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
        ) : (
          <Text style={styles.uploadText}>Tap to upload an image</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomTabSpace} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1', // Light pink background
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4', // Pink tone for the title
    textAlign: 'center',
    marginVertical: 16,
  },
  uploadArea: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FFB6C1', // Soft pink border
    borderRadius: 16,
    backgroundColor: '#FFF0F5', // Light pink background for the upload area
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#FF69B4', // Pink tone for the text
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  bottomTabSpace: {
    height: 60, // Reserve space for the bottom tab bar
  },
});
