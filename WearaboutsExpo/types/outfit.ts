export type OutfitItem = {
  id: string;
  type: OutfitTypes;
  subtype: string;
  color: string;
  image: string;
};

export const allOutfitItemTypes = ["top", "bottom", "full"] as const;

export type OutfitTypes = (typeof allOutfitItemTypes)[number];

export type HasImage = {
  id: string;
  image: string;
};
