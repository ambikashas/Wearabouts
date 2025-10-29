import { render, screen } from "@testing-library/react-native";
import React from "react";
import SavedOutfits from "../app/(tabs)/closet/saved-outfits";

describe("SavedOutfits", () => {
  // Test 1: Ensure the main title renders
  it("renders the Saved Outfits title", () => {
    render(<SavedOutfits />);
    const title = screen.getByText(/Saved Outfits/i);
    expect(title).toBeTruthy();
  });

  // Test 2: Ensure at least one category is displayed
  it("renders at least one outfit category", () => {
    render(<SavedOutfits />);
    const category = screen.queryByText(/Casual/i); // adjust to a real category if needed
    expect(category).not.toBeNull();
  });

  // Test 3: Ensure at least one outfit item is displayed
  it("renders at least one outfit item", () => {
    render(<SavedOutfits />);
    const outfitItems = screen.getAllByText(/Outfit/i); // matches multiple outfit names
    expect(outfitItems.length).toBeGreaterThan(0);
  });

  // Test 4: Render the component without crashing
  it("renders without crashing", () => {
    const { root } = render(<SavedOutfits />);
    expect(root).toBeTruthy();
  });

  // Test 5: Ensure Delete buttons exist for outfits
  it("renders Delete buttons for outfits", () => {
    render(<SavedOutfits />);
    const deleteButtons = screen.getAllByText(/Delete/i);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  // Test 6: Ensure categories with no outfits show proper message
  it('displays "No outfits in this category" for empty categories', () => {
    render(<SavedOutfits />);
    const emptyMessages = screen.getAllByText(/No outfits in this category/i);
    expect(emptyMessages.length).toBeGreaterThan(0);
  });
});
