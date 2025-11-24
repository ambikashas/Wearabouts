import { supabase } from "./supabase";

export type GeneratedOutfitInsert = {
  name: string;
  event_type: string;
  top?: string | null;
  bottom?: string | null;
  full?: string | null;
  shoes?: string | null;
};

export async function uploadGeneratedOutfit(outfit: GeneratedOutfitInsert) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw userError;
    }
    if (!user) {
      throw new Error("No logged-in user");
    }
    const { data, error } = await supabase
      .from("outfits")
      .insert([
        {
          ...outfit,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("uploadGeneratedOutfit error", err);
    throw err;
  }
}
