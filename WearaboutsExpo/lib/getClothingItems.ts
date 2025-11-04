import { supabase } from "./supabase";

export async function getClothingItems() {
  const { data, error } = await supabase
    .from("clothing_items")
    .select("id, name, image_url, tags")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}