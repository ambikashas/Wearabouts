import { mockOutfits } from "@/mock-data/items";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import ClosetView from "../app/(tabs)/closet/index";

// Mock router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("ClosetView", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders without crashing
  it("renders without crashing", () => {
    const { toJSON } = render(<ClosetView />);
    expect(toJSON()).toBeTruthy();
  });

  // Test 2: Renders at least one outfit category title
  it("renders at least one outfit category title", () => {
    render(<ClosetView />);
    const firstType = mockOutfits[0]?.type;
    if (firstType) {
      const title = screen.getByText(new RegExp(`${firstType}s`, "i"));
      expect(title).toBeTruthy();
    }
  });

  // Test 3: Renders horizontal lists for outfit categories
  it("renders a horizontal list for each outfit category with items", () => {
    const { UNSAFE_getAllByType } = render(<ClosetView />);
    // The ListHorizontalScrollDisplay should be rendered
    const horizontalLists = UNSAFE_getAllByType(
      require("@/components/ImageListHorizontalScrollDisplay").default
    );
    expect(horizontalLists.length).toBeGreaterThan(0);
  });

  // Test 4: Clicking on category title triggers navigation to type page
  it("navigates to the correct category page when pressing a category", () => {
    render(<ClosetView />);
    const firstType = mockOutfits[0]?.type;
    if (firstType) {
      const title = screen.getByText(new RegExp(`${firstType}s`, "i"));
      fireEvent.press(title);
      expect(mockPush).toHaveBeenCalledWith(`/closet/type?type=${firstType}`);
    }
  });

  // Test 5: Does not render sections for empty categories
  it("does not render a section if no items exist for a type", () => {
    const { queryByText } = render(<ClosetView />);
    const nonExisting = queryByText(/nonexistenttype/i);
    expect(nonExisting).toBeNull();
  });
});
