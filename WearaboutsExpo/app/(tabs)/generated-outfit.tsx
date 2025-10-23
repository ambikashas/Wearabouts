import React from 'react';
import { Modal, View, StyleSheet, TextInput } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function EventSummaryScreen() {
  const { eventType } = useLocalSearchParams(); 
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [outfitName, setOutfitName] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSave = () => {
    setModalVisible(true);

    setTimeout(() => setModalVisible(false), 2000);

    console.log('Outfit saved:', outfitName, 'Event type:', eventType);
  };


  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.content}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          Event Summary
        </ThemedText>

        <ThemedText type="subtitle">
          Selected Event Type:
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 20 }}>
          {eventType || '—'}
        </ThemedText>

        <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
          Generated Outfit Preview:
        </ThemedText>
        <View
          style={[
            styles.box,
            { borderColor: tintColor, backgroundColor: backgroundColor === '#000' ? '#1a1a1a' : '#f2f2f2' },
          ]}
        />
        <TextInput
            style={{
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            padding: 8,
            marginTop: 8,
            backgroundColor: '#f2f2f2',
            }}
            onChangeText={setOutfitName}
            value={outfitName}
            placeholder="Name your outfit"
            placeholderTextColor="#666"
        />
      </View>

      <View style={[styles.bottomContainer, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: backgroundColor, borderWidth: 1, borderColor: tintColor }]}
          onPress={() => router.push('/(tabs)/generate')}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Back
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: backgroundColor, borderWidth: 1, borderColor: tintColor }]}
          onPress={handleSave}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Save
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText type="title">Outfit Saved</ThemedText>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  box: {
    height: 150,
    borderWidth: 2,
    borderRadius: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088', // semi-transparent overlay
  },
  modalContent: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
