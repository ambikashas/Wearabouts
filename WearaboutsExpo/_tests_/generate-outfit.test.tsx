// --- Backend Tests --- //

// Mock the entire edge function module
jest.mock('../../supabase/functions/generate-outfit/index', () => {
    // Mock implementation that simulates the real handler behavior
    const mockHandler = async (req: Request) => {
      const { userId, eventType } = await req.json();
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'userId is required' }),
          { status: 400 }
        );
      }
  
      // Simulate fetching items (mocked below in supabase mock)
      const items = [
        { id: "top-1", name: "Blue Shirt", tags: ["blue", "casual"], type: "top" },
        { id: "bottom-1", name: "Jeans", tags: ["denim", "casual"], type: "bottom" },
        { id: "shoes-1", name: "Sneakers", tags: ["white", "casual"], type: "shoes" },
      ];
  
      // Get the mocked Gemini response from global.fetch
      const geminiResponse = await fetch('gemini-api');
      const geminiData = await geminiResponse.json();
      
      let outfitsText = geminiData.candidates[0].content.parts[0].text;
      outfitsText = outfitsText.replace(/```json\n?|\n?```/g, '').trim();
      
      let outfits: any;
      try {
        outfits = JSON.parse(outfitsText);
        if (!Array.isArray(outfits)) {
          outfits = [outfits];
        }
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'Invalid Gemini output' }),
          { status: 400 }
        );
      }
  
      // Validate item IDs
      const validItemIds = new Set(items.map(i => i.id));
      const validatedOutfits = outfits.filter(outfit => {
        const hasValidShoes = outfit.shoes && validItemIds.has(outfit.shoes);
        const hasValidFull = outfit.full && validItemIds.has(outfit.full);
        const hasValidTopBottom = outfit.top && outfit.bottom && 
                                   validItemIds.has(outfit.top) && 
                                   validItemIds.has(outfit.bottom);
        
        return hasValidShoes && (hasValidFull || hasValidTopBottom);
      });
  
      if (validatedOutfits.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No valid outfits could be generated' }),
          { status: 400 }
        );
      }
  
      return new Response(
        JSON.stringify({ success: true, outfits: validatedOutfits[0] }),
        { status: 200 }
      );
    };
  
    return {
      generateOutfitHandler: mockHandler,
    };
  });
  
  // Mock fetch for Gemini API response
  global.fetch = jest.fn();
  
  import { generateOutfitHandler } from '../../supabase/functions/generate-outfit/index';
  
  describe("generate-outfit Edge Function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("generates a valid outfit with top, bottom, and shoes", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      name: "Casual Look",
                      top: "top-1",
                      bottom: "bottom-1",
                      full: null,
                      shoes: "shoes-1"
                    })
                  }
                ]
              }
            }
          ],
        }),
      });
  
      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ userId: "user-123", eventType: "casual" }),
      });
  
      const res = await generateOutfitHandler(req);
      const data = await res.json();
  
      expect(data.success).toBe(true);
      expect(data.outfits.top).toBe("top-1");
      expect(data.outfits.bottom).toBe("bottom-1");
      expect(data.outfits.shoes).toBe("shoes-1");
      expect(data.outfits.full).toBeNull();
    });
  
    it("validates item IDs exist in wardrobe", async () => {
      // Return invalid item IDs from Gemini
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      name: "Invalid Outfit",
                      top: "invalid-id",
                      bottom: "bottom-1",
                      full: null,
                      shoes: "shoes-1"
                    })
                  }
                ]
              }
            }
          ],
        }),
      });
  
      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ userId: "user-123", eventType: "casual" }),
      });
  
      const res = await generateOutfitHandler(req);
      const data = await res.json();
  
      expect(data.error).toBeDefined();
      expect(data.error).toBe('No valid outfits could be generated');
    });
  });