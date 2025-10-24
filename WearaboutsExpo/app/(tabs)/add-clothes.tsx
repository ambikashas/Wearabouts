import { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';

export default function AddClothesScreen() {
  const [imageUris, setImageUris] = useState<string[]>([]); // Manage multiple image URIs

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true, // Enable multiple photo selection
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri); // Extract URIs from selected assets
      setImageUris((prevUris) => [...prevUris, ...selectedUris]); // Append new URIs to the existing list
    }
  };

  const deleteImage = (uri: string) => {
    setImageUris((prevUris) => prevUris.filter((item) => item !== uri)); // Remove the selected image
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Add To Your Closet
        </ThemedText>
      </View>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadArea} onPress={pickImages}>
        <ThemedText style={styles.uploadText}>Tap to upload images</ThemedText>
      </TouchableOpacity>

      {/* Display Selected Images */}
      <View style={styles.imageGrid}>
        {imageUris.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteImage(uri)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    padding: 16,
  },
  headerContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  uploadArea: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FFB6C1',
    borderRadius: 16,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 16,
    color: '#FF69B4',
  },
  imageGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF69B4',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
