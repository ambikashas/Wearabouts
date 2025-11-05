import { supabase } from "./supabase";

export async function getClothingItems() {
  const { data, error } = await supabase
    .from("clothing_items")
    .select("id, name, image_url, tags")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClothingItemUrl(id: string) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("clothing_items")
    .select("id, image_url")
    .eq("id", id)
    .single();

  if (error || !data?.image_url) return null;

  const { data: publicUrlData } = supabase.storage
    .from("Clothes")
    .getPublicUrl(data.image_url);

  return publicUrlData?.publicUrl ?? null;
}
