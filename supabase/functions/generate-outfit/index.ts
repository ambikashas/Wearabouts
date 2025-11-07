import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, eventType } = await req.json();

    if (!userId) throw new Error('userId is required');
    if (!eventType || !eventType.trim()) throw new Error('eventType is required');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch clothing items for the user
    const { data: items, error: fetchError } = await supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;
    if (!items || items.length === 0) throw new Error('No clothing items found. Please add items to your wardrobe first.');

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a fashion stylist AI.
Given the event: "${eventType}" and these clothing items with tags: ${JSON.stringify(items, null, 2)}
Suggest an outfit (top + bottom or full, plus shoes). Only return one of (top + bottom) or (full), not both. Return ONLY valid JSON. Do NOT include any \`\`\` or extra text.
The format must be:
{
  "outfit": {
    "top": "string",
    "bottom": "string",
    "full": "string",
    "shoes": "string"
  }
}`
            }]
          }]
        })
      }
    );

    if (!geminiResponse.ok) throw new Error('Failed to generate outfits with Gemini');

    const geminiData = await geminiResponse.json();
    let outfitsText = geminiData.candidates[0].content.parts[0].text;

    // Clean up markdown if present
    outfitsText = outfitsText.replace(/```json\n?|\n?```/g, '').trim();
    const outfits = JSON.parse(outfitsText);

    // Save generated outfit to Supabase
    const { data: savedOutfits, error: saveError } = await supabase
      .from('outfits')
      .insert([
        {
          user_id: userId,
          name: `Outfit for ${eventType}`,
          item_ids: Object.values(outfits.outfit).filter(Boolean),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (saveError) throw saveError;

    return new Response(JSON.stringify({ success: true, outfits: savedOutfits }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});