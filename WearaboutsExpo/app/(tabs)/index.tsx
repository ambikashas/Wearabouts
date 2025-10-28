import { Image } from 'expo-image';
import { View, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // background gradient
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#FFC9D8','#FFFFFF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >

    <ParallaxScrollView
      headerImage={<View />} // placeholder header
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >

    {/* Welcome card with background image */}
    <View style={styles.card}>
      <Image
        source={require('@/assets/images/dashboard-bg.jpg')}
        style={styles.dashboardCard}
        contentFit="cover"
      />

      {/* Overlayed text on welcome card */}
      <View style={styles.overlay}>
        <ThemedText type="title" style={styles.welcome}>
          Welcome stylist!
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          passion{'\n'}personalization{'\n'}productivity
        </ThemedText>

        <View style={styles.brandRow}>
          <Ionicons name="shirt-outline" size={28} color="#131C16" style={styles.brandIcon} />
          <ThemedText style={styles.brand}>Wearabouts</ThemedText>
        </View>

        {/* Overlay pink dress image */}
        <Image
          source={require('@/assets/images/pink-dress.png')}
          style={styles.overlayImage2}
          contentFit="contain"
        />

        {/* Overlay blue dress image */}
        <Image
          source={require('@/assets/images/blue-dress.png')}
          style={styles.overlayImage}
          contentFit="contain"
        />
      </View>
    </View>

    {/* Buttons */}
    <View style={styles.buttonsContainer}>
      {/* My Closet */}
      <Link href="/closet" asChild>
        <Pressable
          style={styles.button}
          onPress={() => {
            Haptics.selectionAsync(); // this triggers the light “click” vibration
          }}
        >
          <ThemedText style={styles.buttonText}>♡ My Closet</ThemedText>
        </Pressable>
      </Link>
        
      {/* Create Outfit */}
      <Link href="/(tabs)/generate" asChild>
        <Pressable
          style={styles.button}
          onPress={() => {
            Haptics.selectionAsync();
          }}
        >
          <ThemedText style={styles.buttonText}>♡ Create outfit</ThemedText>
        </Pressable>
      </Link>
    </View>

    </ParallaxScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  transparentScroll: {
    backgroundColor: 'transparent',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  dashboardCard: {
    width: '100%',
    height: 460,
    borderRadius: 20,
    opacity: 0.7,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 46,
    fontWeight: '600',
    color: '#35403A',
    fontFamily: 'Georgia',
    lineHeight: 50,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#262E26',
    textAlign: 'right',
    lineHeight: 24,
    marginTop: 180,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8, // spacing between icon and text
  },
  brandIcon: {
    marginRight: 2,
    marginBottom: 4,
  },
  brand: {
    fontSize: 38,
    color: '#131C16',
    fontFamily: 'SF Pro Rounded',
    textAlign: 'right',
    lineHeight: 36,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
  },
  overlayImage: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    width: 230,
    height: 230,
    zIndex: 10,
    opacity: 1.0,
    transform: [
      { translateX: -75 },
      { translateY: -75 },
      { rotate: '-11deg' }, // rotate 11 degrees to the left
    ],
  },
  overlayImage2: {
    position: 'absolute',
    top: '55%',
    left: '42%',
    width: 170,
    height: 170,
    zIndex: 10,
    opacity: 0.75,
    transform: [
      { translateX: -75 },
      { translateY: -75 },
      { rotate: '8deg' }, // rotate 8 degrees to the right
    ],
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#FBD6DB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
