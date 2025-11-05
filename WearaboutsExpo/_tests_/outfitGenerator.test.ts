import { generateOutfit, ClothingItem } from "@/lib/outfitGenerator";

describe("generateOutfit", () => {
  const mockItems: ClothingItem[] = [
    { id: "1", name: "T-shirt", type: "top", tags: ["casual"], image_url: "url1" },
    { id: "2", name: "Jeans", type: "bottom", tags: ["casual"], image_url: "url2" },
    { id: "3", name: "Dress", type: "full", tags: ["party"], image_url: "url3" },
    { id: "4", name: "Sneakers", type: "shoes", tags: ["casual"], image_url: "url4" },
  ];

  it("returns an object with top, bottom, full, and shoes keys", () => {
    const outfit = generateOutfit(mockItems);
    expect(outfit).toHaveProperty("top");
    expect(outfit).toHaveProperty("bottom");
    expect(outfit).toHaveProperty("full");
    expect(outfit).toHaveProperty("shoes");
  });

  it("uses full instead of top/bottom sometimes", () => {
    let usedFull = false;
    for (let i = 0; i < 100; i++) {
      const outfit = generateOutfit(mockItems);
      if (outfit.full) {
        expect(outfit.top).toBeNull();
        expect(outfit.bottom).toBeNull();
        usedFull = true;
        break;
      }
    }
    expect(usedFull).toBe(true);
  });

  it("always picks shoes if available", () => {
    const shoesPicked = generateOutfit(mockItems).shoes;
    expect(shoesPicked).not.toBeNull();
    expect(shoesPicked?.type).toBe("shoes");
  });

  it("returns null for missing categories", () => {
    const itemsWithoutShoes: ClothingItem[] = mockItems.filter((i) => i.type !== "shoes");
    const outfit = generateOutfit(itemsWithoutShoes);
    expect(outfit.shoes).toBeNull();
  });
});
