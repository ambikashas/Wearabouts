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

// Mock ConfettiCannon (native) to avoid transformer issues
jest.mock('react-native-confetti-cannon', () => jest.fn().mockImplementation(() => null));

// Use fake timers so we can control setTimeout
jest.useFakeTimers();

function nearestAccessibilityDisabled(node: any): boolean | undefined {
  // defensive traversal: text.parent, text.parent.parent, etc.
  try {
    let cur = node;
    for (let i = 0; i < 4 && cur; i++) {
      if (cur.props && cur.props.accessibilityState && typeof cur.props.accessibilityState.disabled !== 'undefined') {
        return cur.props.accessibilityState.disabled;
      }
      cur = cur.parent ?? cur.parentNode ?? cur.parentElement ?? cur._fiberReturn ?? cur._owner; // try several fallbacks
    }
  } catch (e) {
    // ignore
  }
  return undefined;
}

describe('AddClothesScreen (stable tests)', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('renders header correctly', () => {
    render(<AddClothesScreen />);
    expect(screen.getByText('Add To Your Closet')).toBeTruthy();
  });

  it('upload button is initially disabled', () => {
    render(<AddClothesScreen />);

    const uploadText = screen.getByText('Upload');
    // try to read disabled from nearest ancestor (robust)
    const disabled = nearestAccessibilityDisabled(uploadText);
    // if we couldn't find the accessibilityState, fail with helpful message
    expect(disabled).toBe(true);
  });

  it('picks an image and shows a delete (X) button', async () => {
    render(<AddClothesScreen />);

    // press upload area to trigger mocked image picker
    await act(async () => {
      fireEvent.press(screen.getByText('Tap to upload images'));
      // allow Promise from mocked picker to resolve
      await Promise.resolve();
    });

    // Wait for the delete button "X" to appear which confirms image rendered
    await waitFor(() => {
      expect(screen.getByText('X')).toBeTruthy();
    });

    // after adding image, upload should be enabled
    const uploadText = screen.getByText('Upload');
    const disabledAfter = nearestAccessibilityDisabled(uploadText);
    expect(disabledAfter).toBe(false);
  });

  it('upload clears images and shows success modal', async () => {
    render(<AddClothesScreen />);

    // pick an image
    await act(async () => {
      fireEvent.press(screen.getByText('Tap to upload images'));
      await Promise.resolve();
    });

    // ensure Upload is present (enabled)
    await waitFor(() => screen.getByText('Upload'));

    // press upload and advance timers to trigger upload completion and modal
    await act(async () => {
      fireEvent.press(screen.getByText('Upload'));
      // advance by 2000ms to finish the simulated upload (this sets showSuccess = true)
      jest.advanceTimersByTime(2000);
      // there is a nested timeout for confetti (100) and a hide after 3000
      // we only need showSuccess to be true now, so 2000 is sufficient
    });

    // wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText('Added to your closet!')).toBeTruthy();
    });

    // images should be cleared after upload (delete button "X" gone)
    expect(screen.queryByText('X')).toBeNull();

    // clean up leftover timers (advance hide timeout to avoid open handles)
    act(() => {
      jest.advanceTimersByTime(3100);
    });
  });
});
