import { render, screen, waitFor } from "@testing-library/react-native";
import { Image } from "react-native";
import SavedOutfitsScreen from "../app/(tabs)/closet/saved-outfits";

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
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

// Mock getOutfits
jest.mock("@/lib/getOutfits", () => ({
  getOutfits: jest.fn().mockResolvedValue({
    data: [
      { id: "1", name: "Test Outfit 1", top: "top1", bottom: "bottom1", shoes: "shoes1", full: null },
      { id: "2", name: "Test Outfit 2", top: null, bottom: null, shoes: "shoes2", full: "full2" },
    ],
    hasMore: false,
  }),
}));

// Mock getClothingItemUrl
jest.mock("@/lib/getClothingItems", () => ({
  getClothingItemUrl: jest.fn((id: string) =>
    Promise.resolve(`https://example.com/${id}`)
  ),
}));

describe("SavedOutfitsScreen", () => {
  it("renders without crashing", async () => {
    const { toJSON } = render(<SavedOutfitsScreen />);
    await waitFor(() => expect(toJSON()).toBeTruthy());
  });

  it("renders outfit names", async () => {
    render(<SavedOutfitsScreen />);
    expect(await screen.findByText("Test Outfit 1")).toBeTruthy();
    expect(await screen.findByText("Test Outfit 2")).toBeTruthy();
  });

  it("renders outfit images", async () => {
    render(<SavedOutfitsScreen />);
    const outfitCards = await screen.findAllByTestId("OutfitCard");

    await waitFor(() => {
      let images = outfitCards[0].findAll((node) => node.type === Image);
      expect(images.length).toBe(3);
      expect(images[0].props.source.uri).toBe("https://example.com/top1");
      expect(images[1].props.source.uri).toBe("https://example.com/bottom1");
      expect(images[2].props.source.uri).toBe("https://example.com/shoes1");

      images = outfitCards[1].findAll((node) => node.type === Image);
      expect(images.length).toBe(2);
      expect(images[0].props.source.uri).toBe("https://example.com/full2");
      expect(images[1].props.source.uri).toBe("https://example.com/shoes2");
    });
  });
});
