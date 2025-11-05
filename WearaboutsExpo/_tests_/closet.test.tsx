import { getClothingItemsPerType } from "@/lib/getClothingItems";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import ClosetView from "../app/(tabs)/closet/index";

// --- Mock router ---
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// --- Mock DB function ---
jest.mock("@/lib/getClothingItems", () => ({
  getClothingItemsPerType: jest.fn(),
}));

jest.mock("@/components/ImageListHorizontalScrollDisplay", () => {
  return ({ data }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="horizontal-list">
        {data?.map((i: any) => (
          <Text key={i.id}>{i.name}</Text>
        ))}
      </View>
    );
  };
});

describe("ClosetView", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getClothingItemsPerType as jest.Mock).mockImplementation(
      async (type: string) => {
        if (type === "top") {
          return [
            {
              id: "1",
              name: "Blue Shirt",
              image_url: "https://img",
              type: "top",
              tags: [],
            },
          ];
        }
        if (type === "bottom") {
          return [
            {
              id: "2",
              name: "Jeans",
              image_url: "https://img",
              type: "bottom",
              tags: [],
            },
          ];
        }
        return [];
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Test 1: Component renders without crashing ---
  it("renders without crashing", async () => {
    const { toJSON } = render(<ClosetView />);
    await waitFor(() => expect(toJSON()).toBeTruthy());
  });

  // --- Test 2: Renders at least one outfit category title ---
  it("renders at least one outfit category title", async () => {
    render(<ClosetView />);
    const title = await screen.findByText(/Tops/i);
    expect(title).toBeTruthy();
  });

  // --- Test 3: Renders horizontal lists for outfit categories with items ---
  it("renders a horizontal list for each outfit category with items", async () => {
    render(<ClosetView />);
    const lists = await screen.findAllByTestId("horizontal-list");
    expect(lists.length).toBeGreaterThan(0);
  });

  // --- Test 4: Clicking on category title triggers navigation to type page ---
  it("navigates to the correct category page when pressing a category", async () => {
    render(<ClosetView />);
    const title = await screen.findByText(/Tops/i);
    fireEvent.press(title);
    expect(mockPush).toHaveBeenCalledWith("/closet/type?type=top");
  });
});
