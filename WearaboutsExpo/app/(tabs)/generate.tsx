import { router } from 'expo-router';
import { ActivityIndicator, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import RadioButton from '@/components/radio-button';

export default function GenerateScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const options = ['Casual', 'Work', 'Party', 'Formal', 'Other'];

  const handleGenerate = () => {
    const event = selectedOption === 'Other' ? otherText : selectedOption;
    if (!event.trim()) return;

    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      router.push({
        pathname: '/(tabs)/generated-outfit',
        params: { eventType: event },
      });
    }, 1200);
  };

  if (isGenerating) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <ThemedText style={styles.loadingText}>Generating outfit...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Generate Outfit
        </ThemedText>
      </View>

      {/* Event Type Selection */}
      <View style={styles.formContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Select Event Type
        </ThemedText>

        {options.map((option) => (
          <RadioButton
            key={option}
            label={option}
            selected={selectedOption === option}
            onPress={() => setSelectedOption(option)}
          />
        ))}

        {selectedOption === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Please specify"
            placeholderTextColor="#888"
            onChangeText={setOtherText}
            value={otherText}
          />
        )}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Back</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedOption || otherText
              ? styles.generateButton
              : styles.disabledButton,
          ]}
          disabled={!selectedOption && !otherText}
          onPress={handleGenerate}
        >
          <ThemedText style={styles.buttonText}>Generate</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF69B4',
  },
  headerContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  formContainer: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF69B4',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#FFB6C1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF0F5',
    color: '#333',
    marginTop: 10,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#FFC0CB',
  },
  generateButton: {
    backgroundColor: '#FF69B4',
  },
  disabledButton: {
    backgroundColor: '#FFC0CB',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});