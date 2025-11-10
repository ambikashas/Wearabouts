import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Headers": 'authorization, x-client-info, apikey, content-type'
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // 1. Function entered
    console.log('Analyze Image function invoked')

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const visionApiKey = Deno.env.get("VISION_API_KEY")!
    console.log('Secrets loaded:', {
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      visionApiKey: !!visionApiKey
    });

    // 2. Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created');

    // 3. Parse image URL from request body
    const { imageUrl } = await req.json();
    if (!imageUrl ) throw new Error("imageUrl is required");
    console.log('Image URL received:', imageUrl);


    // 4. Call Google Vision API
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { source: { imageUri: imageUrl } },
              features: [{ type: "LABEL_DETECTION", maxResults: 10 }],
            },
          ],
        }),
      }
    );

    if (!visionRes.ok) {
      const text = await visionRes.text();
      console.log('Vision API error response:', text);
      throw new Error(`Vision API Error: ${text}`);
    }
    console.log('Vision API response received');

    const data = await visionRes.json();
    const labels =
      data.responses?.[0]?.labelAnnotations?.map((l: any) => l.description) || [];

    // 5. Save labels into tags column by merging with user-provided tags
    const { data: itemData, error: fetchError } = await supabase
      .from("clothing_items")
      .select("tags")
      .eq("image_url", imageUrl)
      .maybeSingle();

    if (fetchError) throw fetchError;
    console.log('Fetched existing tags from Supabase:', itemData?.tags);

    const currentTags: string[] = itemData?.tags || [];
    const mergedTags = Array.from(new Set([...currentTags, ...labels])); // remove duplicates

    if (itemData) {
      await supabase.from("clothing_items")
        .update({ tags: mergedTags })
        .eq("image_url", imageUrl);
    } else {
      console.log("No row found for image_url:", imageUrl);
    }

    return new Response(
      JSON.stringify({ tags: mergedTags }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});