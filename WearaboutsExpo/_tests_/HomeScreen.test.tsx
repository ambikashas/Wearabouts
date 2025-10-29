import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/(home)/index';
import * as Haptics from 'expo-haptics';

// Mock native + Expo modules
jest.mock('expo-haptics', () => ({
selectionAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
Link: ({ children }) => children,
}));

jest.mock('expo-linear-gradient', () => ({
LinearGradient: ({ children }) => <>{children}</>,
}));

jest.mock('react-native-safe-area-context', () => ({
SafeAreaView: ({ children }) => <>{children}</>,
}));

jest.mock('expo-image', () => ({
Image: ({ children }) => <>{children}</>,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

// Tests for HomeScreen UI component and interactions
describe('HomeScreen', () => {
it('renders the welcome title', () => {
render(<HomeScreen />);
expect(screen.getByText(/Welcome stylist!/i)).toBeTruthy();
});

it('renders the subtitle words', () => {
render(<HomeScreen />);
expect(screen.getByText(/passion/i)).toBeTruthy();
expect(screen.getByText(/personalization/i)).toBeTruthy();
expect(screen.getByText(/productivity/i)).toBeTruthy();
});

it('renders the brand name Wearabouts', () => {
render(<HomeScreen />);
expect(screen.getByText(/Wearabouts/i)).toBeTruthy();
});

it('renders both buttons', () => {
render(<HomeScreen />);
expect(screen.getByText(/My Closet/i)).toBeTruthy();
expect(screen.getByText(/Create outfit/i)).toBeTruthy();
});

it('calls Haptics.selectionAsync when pressing buttons', () => {
render(<HomeScreen />);
const closetButton = screen.getByText(/My Closet/i);
const outfitButton = screen.getByText(/Create outfit/i);

fireEvent.press(closetButton);
fireEvent.press(outfitButton);

expect(Haptics.selectionAsync).toHaveBeenCalledTimes(2);

});

it('renders without crashing', () => {
const { toJSON } = render(<HomeScreen />);
expect(toJSON()).toBeTruthy();
});
});