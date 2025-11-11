import { render, screen, waitFor } from "@testing-library/react-native";
import { Image } from "react-native";
import SavedOutfitsScreen from "../app/(tabs)/closet/saved-outfits";

jest.mock("@/lib/getOutfits", () => ({
  getOutfits: jest.fn().mockResolvedValue({
    data: [
      { id: "1", name: "Test Outfit 1", top: "top1", bottom: "bottom1", shoes: "shoes1", full: null },
      { id: "2", name: "Test Outfit 2", top: null, bottom: null, shoes: "shoes2", full: "full2" },
    ],
    hasMore: false,
  }),
}));

jest.mock("@/lib/getClothingItems", () => ({
  getClothingItemUrl: jest.fn((id: string) =>
    Promise.resolve(`https://example.com/${id}`)
  ),
}));

test("renders outfit images without act warning", async () => {
  render(<SavedOutfitsScreen />);

  // Wait for all OutfitCards to appear
  const outfitCards = await screen.findAllByTestId("OutfitCard");

  // Wait for all images inside to finish loading
  await waitFor(() => {
    outfitCards.forEach((card) => {
      const images = card.findAll((node) => node.type === Image);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  // Now assert exact image expectations
  outfitCards.forEach((card, index) => {
    const images = card.findAll((node) => node.type === Image);

    if (index === 0) {
      expect(images.length).toBe(3);
      expect(images[0].props.source.uri).toBe("https://example.com/top1");
      expect(images[1].props.source.uri).toBe("https://example.com/bottom1");
      expect(images[2].props.source.uri).toBe("https://example.com/shoes1");
    } else if (index === 1) {
      expect(images.length).toBe(2);
      expect(images[0].props.source.uri).toBe("https://example.com/full2");
      expect(images[1].props.source.uri).toBe("https://example.com/shoes2");
    }
  });
});
