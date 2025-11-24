import { Outfit } from "@/types/outfit";
import { supabase } from "./supabase";

export async function getOutfits(page: number = 0, pageSize: number = 10) {
  const from = page * pageSize;
  const to = (page + 1) * pageSize - 1;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

  const { data, error } = await supabase
    .from("outfits")
    .select("id, name, top, bottom, full, shoes")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const hasMore = (data?.length ?? 0) === pageSize;

  return { data: data as Outfit[], hasMore };
}