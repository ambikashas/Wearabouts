import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SavedOutfits from '../app/(tabs)/saved-outfits';

describe('SavedOutfits', () => {

  // Test 1: Ensure the main title renders
  it('renders the Saved Outfits title', () => {
    render(<SavedOutfits />);
    const title = screen.getByText(/Saved Outfits/i);
    expect(title).toBeTruthy();
  });

  // Test 2: Ensure at least one category is displayed
  it('renders at least one outfit category', () => {
    render(<SavedOutfits />);
    const category = screen.queryByText(/Casual/i); // replace with a real category if needed
    expect(category).not.toBeNull();
  });

  // Test 3: Ensure at least one outfit item is displayed
  it('renders at least one outfit item', () => {
    render(<SavedOutfits />);
    const outfitItems = screen.getAllByText(/Outfit/i);
    expect(outfitItems.length).toBeGreaterThan(0);
  });

  // Test 4: Render the component without crashing
  it('renders without crashing', () => {
    const { root } = render(<SavedOutfits />);
    expect(root).toBeTruthy();
  });

});
