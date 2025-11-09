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

// Mock supabase functions.invoke
jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockResolvedValue({
        data: {
          success: true,
          outfits: [
            { id: 'outfit123', name: 'AI Generated Casual Outfit', top: 'top1', bottom: 'bottom1', shoes: 'shoes1', full: null },
          ],
        },
        error: null,
      }),
    },
  },
}));

// Mock Outfit Generation AI
jest.mock('@/lib/uploadOutfits', () => ({
  uploadGeneratedOutfit: jest.fn().mockResolvedValue({
    id: 'outfit123',
    name: 'AI Generated Casual Outfit',
    event_type: 'casual',
    top: 'top1',
    bottom: 'bottom1',
    full: null,
    shoes: 'shoes1',
  }),
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
  
    // Select Casual
    fireEvent.press(screen.getByTestId('radio-Casual'));
  
    // Press Generate
    await act(async () => {
      fireEvent.press(screen.getByText('Generate'));
    });
  
    // Wait for navigation to be called
    await screen.findByText('Generating outfit...').catch(() => null); // optional check
    expect(router.push).toHaveBeenCalledTimes(1);
    const calledWith = router.push.mock.calls[0][0];
    expect(calledWith.params.top).toBe('top1');
    expect(calledWith.params.bottom).toBe('bottom1');
    expect(calledWith.params.shoes).toBe('shoes1');
  });
  
});
