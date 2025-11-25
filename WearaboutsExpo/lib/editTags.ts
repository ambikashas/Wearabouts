import { supabase } from "./supabase";

export async function editItemTags(itemId: string, newTags: string[]) {
  if (!itemId) throw new Error("Missing item ID");

  const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

  const { data, error } = await supabase
    .from("clothing_items")
    .update({ tags: newTags })
    .eq("user_id", user.id)
    .eq("id", itemId)
    .select("id, tags")
    .single();

  if (error) {
    console.error("Error updating tags:", error);
    throw error;
  }

  return data;
}
