import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Check API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in .env.local file");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface ClothingItem {
  id: string;
  name: string;
  image_url: string;
  tags: string[];
  type: "top" | "bottom" | "full" | "shoes";
}

export interface OutfitSuggestion {
  outfit: {
    top?: string;
    bottom?: string;
    full?: string;
    shoes?: string;
  };
}

// Helper to clean Markdown code fences
function extractJSON(text: string): string {
  return text.replace(/```(json)?/g, "").trim();
}

// Main function to generate outfit
export async function generateOutfit(
  event: string,
  items: ClothingItem[]
): Promise<OutfitSuggestion | string> {
  const prompt = `
You are a fashion stylist AI.
Given the event: "${event}"
and these clothing items with tags:
${JSON.stringify(items, null, 2)}

Suggest an outfit (top + bottom or full, plus shoes).
Only return one of (top + bottom) or (full), not both.
Return ONLY valid JSON. Do NOT include any \`\`\` or extra text.
The format must be:
{
  "outfit": {
    "top": "string",
    "bottom": "string",
    "full": "string",
    "shoes": "string"
  }
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const cleaned = extractJSON(text);
    return JSON.parse(cleaned) as OutfitSuggestion;
  } catch (err) {
    console.warn("⚠️ Model did not return valid JSON. Returning raw text instead.", err);
    return text;
  }
}