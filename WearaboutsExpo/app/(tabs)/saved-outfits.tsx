import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

// Example categorized outfits data
const categorizedOutfits: { [category: string]: string[][] } = {
  Party: [
    [
      'https://via.placeholder.com/100x100?text=Top',
      'https://via.placeholder.com/100x100?text=Bottom',
      'https://via.placeholder.com/100x100?text=Shoes',
    ],
  ],
  Formal: [
    [
      'https://via.placeholder.com/100x100?text=Jacket',
      'https://via.placeholder.com/100x100?text=Jeans',
      'https://via.placeholder.com/100x100?text=Sneakers',
    ],
    [
      'https://via.placeholder.com/100x100?text=Blazer',
      'https://via.placeholder.com/100x100?text=Shirt',
      'https://via.placeholder.com/100x100?text=Heels',
    ]
  ],
  Casual: [],
  Other: [],
};

const SavedOutfitsScreen = () => {
  const [outfitsByCategory, setOutfitsByCategory] = useState(categorizedOutfits);

  const handleDelete = (category: string, idx: number) => {
    setOutfitsByCategory((prev) => {
      const updated = { ...prev };
      updated[category] = updated[category].filter((_, i) => i !== idx);
      return updated;
    });
  };

  const renderOutfit = (category: string) => ({ item, index }: { item: string[] | undefined; index: number }) => {
    if (!Array.isArray(item)) return null;
    return (
      <View style={styles.outfitContainer}>
        <ThemedText type="subtitle" style={styles.outfitTitle}>Outfit {index + 1} Name</ThemedText>
        <View style={styles.imagesRow}>
          {item.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.outfitImage} />
          ))}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(category, index)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerSpacer} />
      <ThemedText type="title" style={styles.title}>Saved Outfits</ThemedText>
      <FlatList
        data={Object.keys(outfitsByCategory)}
        renderItem={({ item: category }) => (
          <View style={styles.categorySection}>
            <ThemedText type="subtitle" style={styles.categoryTitle}>{category}</ThemedText>
            {outfitsByCategory[category].length === 0 ? (
              <ThemedText type="default">No outfits in this category.</ThemedText>
            ) : (
              <FlatList
                data={outfitsByCategory[category]}
                renderItem={renderOutfit(category)}
                keyExtractor={(_, idx) => idx.toString()}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}
        keyExtractor={(category) => category}
        contentContainerStyle={styles.flatListContent}
      />
    </ThemedView>
  );
};

export default SavedOutfitsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8FF',
  },
  headerSpacer: {
    height: 40, // Pushes the title down
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 18,
  },
  listContent: {
    paddingVertical: 8,
  },
  outfitContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outfitTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  outfitImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#EEE',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#fd6cb5ff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 32,
  },
});
