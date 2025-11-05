import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import GenerateScreen from '../app/(tabs)/(home)/outfit-generation/generate';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock RadioButton
jest.mock('../components/radio-button', () => ({ label, selected, onPress }) => (
  <mock-radio-button onPress={onPress} testID={`radio-${label}`}>{label}</mock-radio-button>
));

// Mock Supabase + getClothingItems
jest.mock('@/lib/getClothingItems', () => ({
  getClothingItems: jest.fn().mockResolvedValue([
    { id: 'top1', name: 'Top', type: 'top', tags: [], image_url: 'top.png' },
    { id: 'bottom1', name: 'Bottom', type: 'bottom', tags: [], image_url: 'bottom.png' },
    { id: 'shoes1', name: 'Shoes', type: 'shoes', tags: [], image_url: 'shoes.png' },
  ]),
}));

jest.mock('@/lib/outfitGenerator', () => ({
  generateOutfit: jest.fn((items) => ({
    top: items.find(i => i.type === 'top'),
    bottom: items.find(i => i.type === 'bottom'),
    full: null,
    shoes: items.find(i => i.type === 'shoes'),
  })),
}));

describe('GenerateScreen', () => {
  it('renders the main title', () => {
    render(<GenerateScreen />);
    expect(screen.getByText(/Select Event Type/i)).toBeTruthy();
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

  it('generates an outfit and pushes route', async () => {
    const { router } = require('expo-router');
    render(<GenerateScreen />);
    fireEvent.press(screen.getByTestId('radio-Casual'));
    
    await act(async () => {
      fireEvent.press(screen.getByText('Generate'));
    });

    expect(router.push).toHaveBeenCalled();
    const calledWith = router.push.mock.calls[0][0];
    expect(calledWith.params.top).toBe('top1');
    expect(calledWith.params.bottom).toBe('bottom1');
    expect(calledWith.params.shoes).toBe('shoes1');
  });
});
