import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { decode as atob } from "base-64";
import * as ImageManipulator from "expo-image-manipulator";

export async function uploadClothingItem(
  uri: string,
  name: string,
  tags: string[],
  type: string
) {
  try {
    // Convert any image (HEIC, PNG, JPG) → JPEG
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    const finalUri = manipulated.uri;

    // Always set extension to jpg since we converted to JPEG
    const fileExt = "jpg";
    const fileName = `${uuidv4()}.${fileExt}`;

    // Read the file as base64 (use string, not enum)
    const base64 = await FileSystem.readAsStringAsync(finalUri, {
      encoding: "base64",
    });

    // Convert base64 → binary buffer
    const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Determine content type
    let contentType = "image/jpeg";

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Clothes")
      .upload(fileName, binary, {
        contentType,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("Clothes")
      .getPublicUrl(fileName);
    const image_url = publicData.publicUrl;

    // Insert metadata into "clothing_items"
    const { error: dbError } = await supabase.from("clothing_items").insert({
      name,
      tags,
      type,
      image_url
    });

    if (dbError) throw dbError;

    // Call Edge Function to analyze image
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { 
        imageUrl: image_url
      },
    });

    if (error) throw error;
    console.log("Vision API response:", data);

    return { image_url, fileName };
  } catch (err) {
    console.error("uploadClothingItem error", err);
    throw err;
  }
}