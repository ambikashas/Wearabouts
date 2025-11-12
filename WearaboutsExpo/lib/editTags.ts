import { supabase } from "./supabase";

export async function editItemTags(itemId: string, newTags: string[]) {
  if (!itemId) throw new Error("Missing item ID");

  const { data, error } = await supabase
    .from("clothing_items")
    .update({ tags: newTags })
    .eq("id", itemId)
    .select("id, tags")
    .single();

  if (error) {
    console.error("Error updating tags:", error);
    throw error;
  }

  return data;
}
