export type OutfitItem = {
  id: string;
  type: OutfitTypes;
  subtype: string;
  color: string;
  image: string;
};

export type Outfit = {
  id: string;
  name: string;
  full: string | null;
  top: string | null;
  bottom: string | null;
  shoes: string;
};

export const allOutfitItemTypes = ["top", "bottom", "full"] as const;

export type OutfitTypes = (typeof allOutfitItemTypes)[number];

export type HasImage = {
  id: string;
  image: string;
};
