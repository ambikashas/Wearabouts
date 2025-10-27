import React from 'react';
import { ActivityIndicator, Modal, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function EventSummaryScreen() {
  const { eventType } = useLocalSearchParams(); 
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [outfitName, setOutfitName] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const confettiRef = React.useRef(null);

  const handleSave = () => {
    if (!outfitName.trim()) return;

    setIsSaving(true);

    // Simulate a save delay
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);

      setTimeout(() => {
        if (confettiRef.current) {
          (confettiRef.current as any).start();
        }
      }, 100);

      // Hide success after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  if (isSaving) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <ThemedText style={styles.loadingText}>Saving outfit...</ThemedText>
      </ThemedView>
    );
  }


  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Event Summary
        </ThemedText>

        <ThemedText type="subtitle" style={styles.label}>
          Selected Event Type:
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.value}>
          {eventType || '—'}
        </ThemedText>

        <ThemedText type="subtitle" style={styles.label}>
          Generated Outfit Preview:
        </ThemedText>
        <View
          style={styles.previewBox}
        />
        <TextInput
            style={styles.input}
            onChangeText={setOutfitName}
            value={outfitName}
            placeholder="Name your outfit"
            placeholderTextColor="#666"
        />
      </View>

      <View style={[styles.bottomButtons]}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.push('/(tabs)/generate')}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Back
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Save
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View style={styles.successOverlay}>
          <ThemedText type="title" style={styles.successText}>
            Outfit Saved!
          </ThemedText>
          {showSuccess && (
            <ConfettiCannon
              ref={confettiRef}
              count={200}
              origin={{ x: -10, y: 0 }}
              autoStart={false}
              fadeOut={true}
              colors={['#FF69B4', '#FFB6C1', '#FFF0F5', '#DB7093']}
            />
          )}
        </View>
      </Modal>
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
  infoSection: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: '#FF69B4',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  previewBox: {
    height: 150,
    borderWidth: 2,
    borderColor: '#FFB6C1',
    borderRadius: 12,
    backgroundColor: '#FFF0F5',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#FFB6C1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF0F5',
    color: '#333',
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
  saveButton: {
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
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});
