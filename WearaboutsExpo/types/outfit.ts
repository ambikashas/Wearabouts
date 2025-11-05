export type Outfit = {
  id: string;
  name: string;
  full: string | null;
  top: string | null;
  bottom: string | null;
  shoes: string;
};

export const typeDisplayNames: Record<string, string> = {
  top: "Tops",
  bottom: "Bottoms",
  shoes: "Shoes",
  full: "Fulls",
};

export const allOutfitItemTypes = ["top", "bottom", "full", "shoes"] as const;

export type OutfitTypes = (typeof allOutfitItemTypes)[number];

export type HasImage = {
  id: string;
  image_url: string;
};
