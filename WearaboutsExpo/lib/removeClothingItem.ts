import { supabase } from "./supabase";

/**
 * Deletes a clothing item from Supabase (and its image from storage if applicable).
 * @param id - The clothing item’s ID to delete.
 */
export async function removeClothingItem(id: string) {
  try {
    // Fetch the image path so we can remove it from storage later
    const { data: item, error: fetchError } = await supabase
      .from("clothing_items")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the record from the database
    const { error: deleteError } = await supabase
      .from("clothing_items")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Delete the image from Supabase Storage if it's stored there
    if (item?.image_url && !item.image_url.startsWith("http")) {
      const fileName = item.image_url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("Clothes").remove([fileName]);
      }
    }

    console.log(`Successfully removed clothing item with id: ${id}`);
    return true;
  } catch (err) {
    console.error("Error removing clothing item:", err);
    throw err;
  }
}
