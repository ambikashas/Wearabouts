import { StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function GenerateScreen() {
  return (
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
          }}>
          Generate Outfit
        </ThemedText>
      </ThemedView>
      <ThemedText>Generate a personalized outfit recommendation based on your preferences.</ThemedText>
      <Collapsible title="Outfit Generation">
        <ThemedText>
          This screen will help you generate outfit recommendations based on your wardrobe, 
          weather, occasion, and personal style preferences.
        </ThemedText>
        <ThemedText>
          Features coming soon:
        </ThemedText>
        <ThemedText>• Weather-based recommendations</ThemedText>
        <ThemedText>• Occasion-specific styling</ThemedText>
        <ThemedText>• Personal style analysis</ThemedText>
        <ThemedText>• Color coordination</ThemedText>
      </Collapsible>
      <Collapsible title="Your Wardrobe">
        <ThemedText>
          Connect your wardrobe items to get more accurate recommendations. 
          Add items from your closet to improve the AI's suggestions.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more about outfit generation</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Style Preferences">
        <ThemedText>
          Set your style preferences to get personalized recommendations that match your taste.
        </ThemedText>
        <ThemedText>
          You can adjust preferences for:
        </ThemedText>
        <ThemedText>• Color schemes</ThemedText>
        <ThemedText>• Style categories (casual, formal, etc.)</ThemedText>
        <ThemedText>• Comfort levels</ThemedText>
        <ThemedText>• Seasonal preferences</ThemedText>
      </Collapsible>
    </ParallaxScrollView>
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
});
