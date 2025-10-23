import { router } from 'expo-router';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import RadioButton from '@/components/radio-button';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function GenerateScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");

  const options = ['Casual', 'Work', 'Party', 'Formal', 'Other'];

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={200}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
              textAlign: 'center',
            }}>
            Generate Outfit
          </ThemedText>
        </ThemedView>
        <View>
          <ThemedText type='subtitle'>Event Type</ThemedText>
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
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 5,
                padding: 8,
                marginTop: 8,
                backgroundColor: '#f2f2f2',
              }}
              onChangeText={setOtherText}
              value={otherText}
              placeholder="Please specify"
              placeholderTextColor="#666"
            />
          )}
        </View>
      </ParallaxScrollView>

      <View
          style={[
            styles.bottomContainer,
            { backgroundColor: backgroundColor },
          ]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: backgroundColor, borderWidth: 1, borderColor: tintColor }]}
            onPress={() => router.back()}>
            <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
              Back
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: backgroundColor, borderWidth: 1, borderColor: tintColor }]}
            onPress={() => {
              const event = selectedOption === 'Other' ? otherText : selectedOption;
              if (!event) return;
              router.push({ pathname: '/(tabs)/generated-outfit', params: { eventType: event } });
            }}>
            <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
              Generate
            </ThemedText>
          </TouchableOpacity>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
});
