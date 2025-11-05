// _tests_/saved-outfits.test.tsx
import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Image } from "react-native";
import "react-native-gesture-handler/jestSetup";
import SavedOutfitsScreen from "../app/(tabs)/closet/saved-outfits";

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: "1", image_url: "top.png", name: "Test Outfit" },
        error: null,
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: "1", image_url: "top.png" },
        error: null,
      }),
    })),
    storage: {
      from: jest.fn(() => ({
        getPublicUrl: jest.fn((path: string) => ({
          data: { publicUrl: `https://example.com/${path}` },
          error: null,
        })),
      })),
    },
  },
}));

// Mock getOutfits avec 2 outfits pour tester top/bottom/shoes et full/shoes
jest.mock("@/lib/getOutfits", () => ({
  getOutfits: jest.fn().mockResolvedValue({
    data: [
      {
        id: "1",
        name: "Test Outfit 1",
        top: "top1",
        bottom: "bottom1",
        shoes: "shoes1",
        full: null,
      },
      {
        id: "2",
        name: "Test Outfit 2",
        top: null,
        bottom: null,
        shoes: "shoes2",
        full: "full2",
      },
    ],
    hasMore: false,
  }),
}));

jest.mock("@/lib/getClothingItems", () => ({
  getClothingItemUrl: jest.fn((id: string) =>
    Promise.resolve(`https://example.com/${id}`)
  ),
}));

// Silence warnings act(...)
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
    if (
      typeof msg === "string" &&
      msg.includes("An update to") &&
      msg.includes("inside a test was not wrapped in act")
    ) {
      return;
    }
    console.error(msg, ...args);
  });
});

describe("SavedOutfitsScreen", () => {
  it("renders without crashing", async () => {
    const { toJSON } = render(<SavedOutfitsScreen />);
    await waitFor(() => expect(toJSON()).toBeTruthy());
  });

  it("shows a loading indicator initially", async () => {
    render(<SavedOutfitsScreen />);
    const loader = await screen.findByTestId("ActivityIndicator");
    expect(loader).toBeTruthy();
  });

  it("renders outfit names correctly", async () => {
    render(<SavedOutfitsScreen />);
    const outfit1 = await screen.findByText("Test Outfit 1");
    const outfit2 = await screen.findByText("Test Outfit 2");
    expect(outfit1).toBeTruthy();
    expect(outfit2).toBeTruthy();
  });

  it("renders a FlatList with items", async () => {
    render(<SavedOutfitsScreen />);
    const outfitCards = await screen.findAllByTestId("OutfitCard");
    expect(outfitCards.length).toBe(2);
  });

  it("renders OutfitCard images correctly", async () => {
    render(<SavedOutfitsScreen />);
    const outfitCards = await screen.findAllByTestId("OutfitCard");

    await waitFor(() => {
      // Outfit 1 => top, bottom, shoes => 3 images
      let images = outfitCards[0].findAll((node) => node.type === Image);
      expect(images.length).toBe(3);
      expect(images[0].props.source.uri).toBe("https://example.com/top1");
      expect(images[1].props.source.uri).toBe("https://example.com/bottom1");
      expect(images[2].props.source.uri).toBe("https://example.com/shoes1");

      // Outfit 2 => full, shoes => 2 images
      images = outfitCards[1].findAll((node) => node.type === Image);
      expect(images.length).toBe(2);
      expect(images[0].props.source.uri).toBe("https://example.com/full2");
      expect(images[1].props.source.uri).toBe("https://example.com/shoes2");
    });
  });
});
