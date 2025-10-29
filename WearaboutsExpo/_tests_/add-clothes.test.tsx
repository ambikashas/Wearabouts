// _tests_/add-clothes.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import AddClothesScreen from '../app/(tabs)/add-clothes';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'file://mock-image.jpg' }],
    })
  ),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock ConfettiCannon (native)
jest.mock('react-native-confetti-cannon', () => jest.fn().mockImplementation(() => null));

jest.useFakeTimers();

function getDisabledState(node: any): boolean | undefined {
  try {
    let cur = node;
    for (let i = 0; i < 5 && cur; i++) {
      if (cur.props?.accessibilityState?.disabled !== undefined) {
        return cur.props.accessibilityState.disabled;
      }
      cur = cur.parent ?? cur._fiberReturn ?? cur._owner;
    }
  } catch {}
  return undefined;
}

describe('AddClothesScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('upload button is initially disabled', () => {
    render(<AddClothesScreen />);
    const uploadText = screen.getByText('Upload');
    const disabled = getDisabledState(uploadText);
    expect(disabled).toBe(true);
  });

  it('can pick an image and show delete (X) button', async () => {
    render(<AddClothesScreen />);
    await act(async () => {
      fireEvent.press(screen.getByText('Tap to upload images'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByText('X')).toBeTruthy();
    });

    // Upload button should now be enabled
    const uploadText = screen.getByText('Upload');
    const disabledAfter = getDisabledState(uploadText);
    expect(disabledAfter).toBe(false);
  });

  it('clears images and shows success modal after upload', async () => {
    render(<AddClothesScreen />);

    await act(async () => {
      fireEvent.press(screen.getByText('Tap to upload images'));
      await Promise.resolve();
    });

    await waitFor(() => screen.getByText('Upload'));

    await act(async () => {
      fireEvent.press(screen.getByText('Upload'));
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('Added to your closet!')).toBeTruthy();
    });

    expect(screen.queryByText('X')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(3100);
    });
  });
});
