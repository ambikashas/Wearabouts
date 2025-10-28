export type OutfitItem = {
  id: string;
  type: OutfitTypes;
  subtype: string;
  color: string;
  image: string;
};

export const allOutfitTypes = ["top", "bottom", "full"] as const;

export type OutfitTypes = (typeof allOutfitTypes)[number];

export type HasImage = {
  id: string;
  image: string;
};
