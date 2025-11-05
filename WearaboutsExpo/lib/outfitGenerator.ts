export type ClothingItem = { // TEMPORARY
  id: string;
  name: string;
  image_url: string;
  tags: string[];
  type: "top" | "bottom" | "full" | "shoes";
};

export function generateOutfit(items: ClothingItem[]) {
  const tops = items.filter((i) => i.type === "top");
  const bottoms = items.filter((i) => i.type === "bottom");
  const fulls = items.filter((i) => i.type === "full");
  const shoes = items.filter((i) => i.type === "shoes");

  const randomPick = <T,>(arr: T[]): T | null =>
    arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

  const useFull = Math.random() < 0.5 && fulls.length > 0;

  const selectedTop = useFull ? null : randomPick(tops);
  const selectedBottom = useFull ? null : randomPick(bottoms);
  const selectedFull = useFull ? randomPick(fulls) : null;
  const selectedShoes = randomPick(shoes);

  return { top: selectedTop, bottom: selectedBottom, full: selectedFull, shoes: selectedShoes };
}
