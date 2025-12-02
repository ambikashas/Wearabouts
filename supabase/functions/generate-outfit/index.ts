import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    console.log('Function invoked')

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

  try {
    console.log('Parsing request body...')
    const { userId, eventType } = await req.json()
    console.log('Request data:', { userId, eventType })

    if (!userId) {
      throw new Error('userId is required')
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasGeminiKey: !!geminiKey
    })

    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Fetch clothing items - using your actual column names
    const { data: items, error: fetchError } = await supabase
      .from('clothing_items')
      .select('id, name, tags, image_url, type')
      .eq('user_id', userId)

    console.log('Items fetched:', { count: items?.length, error: fetchError })
    
    if (fetchError) {
      console.error('Fetch error:', fetchError)
      throw fetchError
    }

    if (!items || items.length === 0) {
      throw new Error('No clothing items found. Please add items to your wardrobe first.')
    }

    console.log(`Found ${items.length} clothing items for user ${userId}`)
    
    // Group items by type
    const tops = items.filter(i => i.type === 'top')
    const bottoms = items.filter(i => i.type === 'bottom')
    const shoes = items.filter(i => i.type === 'shoes')
    const fulls = items.filter(i => i.type === 'full')

    console.log('Items by type:', {
      tops: tops.length,
      bottoms: bottoms.length,
      shoes: shoes.length,
      fulls: fulls.length
    })
    
    // Shuffle items to introduce randomness
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    shuffle(tops);
    shuffle(bottoms);
    shuffle(shoes);
    shuffle(fulls);

    // Format items for Gemini
    const itemsDescription = {
      tops: tops.map(i => ({ id: i.id, name: i.name, tags: i.tags })),
      bottoms: bottoms.map(i => ({ id: i.id, name: i.name, tags: i.tags })),
      shoes: shoes.map(i => ({ id: i.id, name: i.name, tags: i.tags })),
      fulls: fulls.map(i => ({ id: i.id, name: i.name, tags: i.tags }))
    }

    // Introduce noise to vary outputs
    const noise1 = crypto.randomUUID()
    const noise2 = Math.random()
    const noise3 = crypto.getRandomValues(new Uint32Array(1))[0]
    
    
    // Call Gemini API
    console.log('Calling Gemini API...')
    const modelName = "gemini-2.5-flash";
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationConfig: {
            temperature: 1.8,
            topK: 40,
            topP: 0.95
          },
          contents: [{
            parts: [{
text: `
You are a professional fashion stylist.
The user is attending an event of type: "${eventType}".
Randomization tokens:
- ${noise1}
- ${noise2}
- ${noise3}

Given these clothing items (as JSON): ${JSON.stringify(itemsDescription)}

Your task: Create exactly ONE complete outfit suggestion.

Hard rules:
- The outfit MUST be different from past outputs. 
- Even if eventType and clothing items are identical, you MUST rotate which items are chosen.
- Do NOT pick the same combination of item IDs unless no other valid combination exists.
- Randomize your selection to avoid repetition.

Outfit rules:
- Must be (top + bottom + shoes) OR (full + shoes).
- Never mix full with top/bottom.
- Use ONLY the provided IDs.
- If using a full item, top and bottom = null.
- Basic style coherence required.

Response format:
Return ONLY a JSON array with a single outfit:
{
  "name": "Outfit name",
  "top": "top_item_id or null",
  "bottom": "bottom_item_id or null",
  "full": "full_item_id or null",
  "shoes": "shoes_item_id"
}

Important:
- Do NOT include markdown, explanations, or code fences.
- The response must be pure JSON.
`
            }]
          }]
        })
      }
    )
    
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API failed: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      throw new Error('No response from Gemini')
    }

    let outfitsText = geminiData.candidates[0].content.parts[0].text
    
    console.log('Gemini response:', outfitsText)
    
    // Clean up markdown if present
    outfitsText = outfitsText.replace(/```json\n?|\n?```/g, '').trim()
    let outfits: any;
    try {
      outfits = JSON.parse(outfitsText);
      if (!Array.isArray(outfits)) {
        // wrap single object in array
        outfits = [outfits];
      }
    } catch (err) {
      console.error("Failed to parse Gemini output:", outfitsText, err);
      throw new Error("Invalid Gemini output");
    }
     
    // Validate item IDs exist
    const validItemIds = new Set(items.map(i => i.id))
    const validatedOutfits = outfits.filter(outfit => {
      const hasValidShoes = outfit.shoes && validItemIds.has(outfit.shoes)
      const hasValidFull = outfit.full && validItemIds.has(outfit.full)
      const hasValidTopBottom = outfit.top && outfit.bottom && 
                                 validItemIds.has(outfit.top) && 
                                 validItemIds.has(outfit.bottom)
      
      return hasValidShoes && (hasValidFull || hasValidTopBottom)
    })

    if (validatedOutfits.length === 0) {
      throw new Error('No valid outfits could be generated')
    }
    
    return new Response(
      JSON.stringify({ success: true, outfits: validatedOutfits[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})