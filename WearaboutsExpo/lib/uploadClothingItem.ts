import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as ImageManipulator from "expo-image-manipulator";
import { Image } from "react-native";

/**
 * Uploads a clothing item to Supabase, handles optimization, tags via Vision API, 
 * and cleans up temporary files to prevent memory issues in Expo Go.
 */
export async function uploadClothingItem(
  uri: string,
  name: string,
  tags: string[],
  type: string
) {
  let finalUri = uri;
  let optimizedUri: string | null = null;

  try {
    // Step 1: Manipulate original image (convert to JPEG, compress)
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    finalUri = manipulated.uri;

    const fileExt = "jpg";
    const fileName = `${uuidv4()}.${fileExt}`;

    // Step 2: Determine optimized size
    const originalSize = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
      }
    );

    const maxWidth = 640;
    const maxHeight = 480;
    const widthRatio = maxWidth / originalSize.width;
    const heightRatio = maxHeight / originalSize.height;
    const scale = Math.min(widthRatio, heightRatio, 1); // prevents upscaling

    let optimizedFileName = fileName.replace(/\.jpg$/, "_optimized.jpg");

    if (scale < 1) {
      // Resize if needed
      const targetWidth = Math.round(originalSize.width * scale);
      const targetHeight = Math.round(originalSize.height * scale);
      const optimized = await ImageManipulator.manipulateAsync(
        finalUri,
        [{ resize: { width: targetWidth, height: targetHeight } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      optimizedUri = optimized.uri;
    }

    // Step 3: Upload original and optimized images directly from file URIs
    const { error: originalError } = await supabase.storage
      .from("Clothes")
      .upload(fileName, { uri: finalUri, type: "image/jpeg" }, { upsert: false });
    if (originalError) throw originalError;

    let optimized_url: string | null = null;
    if (optimizedUri) {
      const { error: optimizedError } = await supabase.storage
        .from("Clothes")
        .upload(optimizedFileName, { uri: optimizedUri, type: "image/jpeg" }, { upsert: false });
      if (optimizedError) throw optimizedError;

      optimized_url = supabase.storage
        .from("Clothes")
        .getPublicUrl(optimizedFileName).data.publicUrl;
    }

    const image_url = supabase.storage
      .from("Clothes")
      .getPublicUrl(fileName).data.publicUrl;

    console.log("Optimized image URL:", optimized_url);

    // Step 4: Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("No logged-in user");

    // Step 5: Insert metadata into DB
    const { error: dbError } = await supabase.from("clothing_items").insert({
      name,
      tags,
      type,
      image_url,
      user_id: user.id,
    });
    if (dbError) throw dbError;

    // Step 6: Call Vision API Edge Function
    const { data, error: visionError } = await supabase.functions.invoke("analyze-image", {
      body: { imageUrl: image_url, optimizedImageUrl: optimized_url },
    });
    if (visionError) throw visionError;

    console.log("Vision API response:", data);

    return { image_url, optimized_url, fileName, optimizedFileName };
  } catch (err) {
    console.error("uploadClothingItem error", err);
    throw err;
  } finally {
    // Step 7: Delete temporary files immediately
    try {
      if (finalUri) await FileSystem.deleteAsync(finalUri, { idempotent: true });
      if (optimizedUri && optimizedUri !== finalUri) await FileSystem.deleteAsync(optimizedUri, { idempotent: true });
    } catch (delErr) {
      console.warn("Failed to delete temporary files:", delErr);
    }
  }
}
