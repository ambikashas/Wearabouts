import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';

// Mock expo-router so Jest doesn’t parse its JSX
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock RadioButton component
jest.mock('../components/radio-button', () => {
  return ({ label, selected, onPress }) => (
    <mock-radio-button onPress={onPress} testID={`radio-${label}`}>{label}</mock-radio-button>
  );
});

import GenerateScreen from '../app/(tabs)/generate';

describe('GenerateScreen', () => {
  it('renders the main title', () => {
    render(<GenerateScreen />);
    expect(screen.getByText(/Generate Outfit/i)).toBeTruthy();
  });

  it('renders all event type options', () => {
    render(<GenerateScreen />);
    ['Casual', 'Work', 'Party', 'Formal', 'Other'].forEach(option => {
      expect(screen.getByTestId(`radio-${option}`)).toBeTruthy();
    });
  });

  it('shows text input when "Other" is selected', () => {
    render(<GenerateScreen />);
    fireEvent.press(screen.getByTestId('radio-Other'));
    expect(screen.getByPlaceholderText(/Please specify/i)).toBeTruthy();
  });

  it('renders Back and Generate buttons', () => {
    render(<GenerateScreen />);
    expect(screen.getByTestId(/Back/i)).toBeTruthy();
    expect(screen.getByTestId(/Generate/i)).toBeTruthy();
  });

  it('disables Generate button if no option or text is selected', () => {
    render(<GenerateScreen />);
    const generateButton = screen.getByTestId(/Generate/i).parent;
    expect(generateButton.props.accessibilityState.disabled).toBe(true);
  });

  it('enables Generate button when an option is selected', () => {
    render(<GenerateScreen />);
    fireEvent.press(screen.getByTestId('radio-Casual'));
    const generateButton = screen.getByTestId(/Generate/i).parent;
    expect(generateButton.props.accessibilityState.disabled).toBe(false);
  });

  it('shows loading state when generating', () => {
    jest.useFakeTimers();
    render(<GenerateScreen />);
    fireEvent.press(screen.getByTestId('radio-Casual'));
    fireEvent.press(screen.getByTestId(/Generate/i));

    expect(screen.getByText(/Generating outfit/i)).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    jest.useRealTimers();
  });
});
