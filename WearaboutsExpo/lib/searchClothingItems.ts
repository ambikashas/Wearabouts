import { supabase } from "./supabase";

export async function searchClothingItems(searchText: string, userId: string) {
  const words = searchText.trim().split(/\s+/);
  if (words.length === 0) return [];

  // Build OR conditions for name
  const nameConditions = words.map((word) => `name.ilike.%${word}%`).join(",");

  // Only fetch items belonging to the user
  const { data: nameMatches, error: nameError } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("user_id", userId)          // <-- filter by user
    .or(nameConditions);

  if (nameError) {
    console.error("Search error (name):", nameError);
    return [];
  }

  // Fetch all items for this user for tag filtering
  const { data: allItems, error: allError } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("user_id", userId);          // <-- filter by user

  if (allError) {
    console.error("Search error (all items for tags):", allError);
    return nameMatches ?? [];
  }

  // Match tags by substring
  const tagMatches = allItems?.filter((item: any) =>
    Array.isArray(item.tags) &&
    words.some((word) =>
      item.tags.some((tag) => tag.toLowerCase().includes(word.toLowerCase()))
    )
  ) ?? [];

  // Combine nameMatches and tagMatches without duplicates
  const combined = [
    ...(nameMatches ?? []),
    ...tagMatches.filter((item) => !(nameMatches ?? []).some((n) => n.id === item.id)),
  ];

  return combined;
}
