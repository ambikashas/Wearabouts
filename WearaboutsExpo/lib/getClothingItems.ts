import { supabase } from "./supabase";

export async function getClothingItems() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

  const { data, error } = await supabase
    .from("clothing_items")
    .select("id, name, image_url, tags, type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClothingItemsPerType(
  type: string,
  offset = 0,
  limit = 10
) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

  const { data, error } = await supabase
    .from("clothing_items")
    .select("id, name, image_url, tags, type")
    .eq("type", type)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

export async function getClothingItemUrl(id: string) {
  if (!id) return null;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

  const { data, error } = await supabase
    .from("clothing_items")
    .select("image_url")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error || !data?.image_url) return null;

  const path = data.image_url;

  if (path.startsWith("http")) {
    return path;
  }

  const { data: publicUrlData } = supabase.storage
    .from("Clothes")
    .getPublicUrl(path);

  return publicUrlData?.publicUrl ?? null;
}

