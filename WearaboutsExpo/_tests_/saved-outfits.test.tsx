import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SavedOutfits from '../app/(tabs)/saved-outfits';

describe('SavedOutfits', () => {
  it('renders the SavedOutfits component', () => {
    render(<SavedOutfits />);
    
    // Example: check for a text that exists in your component
    const title = screen.getByText(/Saved Outfits/i); 
    expect(title).toBeTruthy();
  });
});
