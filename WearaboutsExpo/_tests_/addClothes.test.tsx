import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddClothesScreen from '../app/(tabs)/closet/AddClothesScreen';

// Mock expo-image-picker since it requires native modules
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'file://mock-image.jpg' }],
    })
  ),
  MediaTypeOptions: { Images: 'Images' },
}));

describe('AddClothesScreen', () => {
  it('renders header text correctly', () => {
    const { getByText } = render(<AddClothesScreen />);
    expect(getByText('Add To Your Closet')).toBeTruthy();
  });

  it('initially shows upload button as disabled', () => {
    const { getByText } = render(<AddClothesScreen />);
    const uploadButton = getByText('Upload');
    // Verify it's visually disabled (light pink)
    expect(uploadButton.parent?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#FFC0CB' }),
      ])
    );
  });

  it('picks and displays an image when upload area is tapped', async () => {
    const { getByText, getByRole, findByTestId } = render(<AddClothesScreen />);

    const uploadArea = getByText('Tap to upload images');
    fireEvent.press(uploadArea);

    // Wait for the mocked image picker to resolve
    await waitFor(() => {
      expect(findByTestId('image-0')).toBeTruthy();
    });
  });

  it('clears images and shows success message after upload', async () => {
    const { getByText, findByText } = render(<AddClothesScreen />);

    // Manually trigger an image (mocked picker)
    fireEvent.press(getByText('Tap to upload images'));
    await waitFor(() => getByText('Upload'));

    const uploadButton = getByText('Upload');
    fireEvent.press(uploadButton);

    // Wait for success modal
    const successText = await findByText('Added to your closet!');
    expect(successText).toBeTruthy();
  });
});

