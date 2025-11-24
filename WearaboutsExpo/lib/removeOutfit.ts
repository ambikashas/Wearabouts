import { supabase } from "./supabase";

export async function removeOutfit(id: string) {
  if (!id) throw new Error("Missing outfit ID");

  const { error } = await supabase
    .from("outfits")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting outfit:", error);
    throw error;
  }

  return true;
}
