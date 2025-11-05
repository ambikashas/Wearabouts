import { Outfit } from "@/types/outfit";
import { supabase } from "./supabase";

export async function getOutfits(page: number = 0, pageSize: number = 10) {
  const from = page * pageSize;
  const to = (page + 1) * pageSize - 1;

  const { data, error } = await supabase
    .from("outfits")
    .select("id, name, top, bottom, full, shoes")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const hasMore = (data?.length ?? 0) === pageSize;

  return { data: data as Outfit[], hasMore };
}