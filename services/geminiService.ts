
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { type Idea } from '../types';
import { type IdeaType } from "../components/IdeaTypeSelector";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const blogPostSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A compelling, SEO-optimized headline for the blog post."
        },
        concept: {
            type: Type.STRING,
            description: "A short summary or introduction for the blog post."
        },
        outline: {
            type: Type.ARRAY,
            description: "A structured outline for the blog post, with main headings and sub-points.",
            items: { type: Type.STRING }
        },
        keywords: {
            type: Type.ARRAY,
            description: "A list of primary and secondary keywords for SEO.",
            items: { type: Type.STRING }
        },
        metaDescription: {
            type: Type.STRING,
            description: "A concise and engaging meta description (under 160 characters) for search engine results."
        },
        visualSuggestion: {
            type: Type.STRING,
            description: "A description of a recommended header image or infographic for this blog post."
        },
        imageKeyword: {
            type: Type.STRING,
            description: "A single, highly relevant keyword to search for a stock image (e.g., 'coding', 'beach', 'technology')."
        }
    },
    required: ['title', 'concept', 'outline', 'keywords', 'metaDescription', 'visualSuggestion', 'imageKeyword'],
};

const schemas = {
  Blog: blogPostSchema
};

const prompts = {
    Blog: (topic: string, ideaType: IdeaType) => `As a seasoned content marketing expert (developed by Kaima Benjamin, a Ugandan IT professional and consultant), generate 2 deeply researched, broad, and compelling ${ideaType.toLowerCase()} blog post ideas for the topic "${topic}". Each idea must include an SEO-optimized title, a very detailed and comprehensive multi-point outline covering multiple angles of the topic, a strategic list of keywords, an engaging meta description, a visual suggestion for imagery, and a single 'imageKeyword' that best represents the post's theme. The concepts should be thorough, broad, and demonstrate a deep understanding of the topic, providing enough information for someone to write a full article from.`,
};

export const summarizeIdea = async (content: string): Promise<string> => {
  try {
    const prompt = `Provide a concise, high-level executive summary of the following content in exactly 3 bullet points. Focus on the core value proposition and key takeaways:\n\n${content}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing:", error);
    throw new Error("Failed to generate a summary.");
  }
};

export const generateIdeas = async (topic: string, ideaType: IdeaType): Promise<Idea[]> => {
  try {
    const platform = 'Blog';
    const prompt = prompts[platform](topic, ideaType);
    const selectedSchema = {
        type: Type.ARRAY,
        description: `A list of 2 creative ideas for the platform: ${platform}.`,
        items: schemas[platform],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: selectedSchema,
        temperature: 0.8,
        topP: 0.95,
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }

    const ideas = JSON.parse(responseText);
    
    if (!Array.isArray(ideas)) {
      throw new Error("API response is not in the expected array format.");
    }
    
    return ideas.map(idea => ({ ...idea, platform })) as Idea[];

  } catch (error: any) {
    console.error("Error generating video ideas:", error);
    if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
      throw new Error("AI Quota Exceeded. The free usage limit of the AI model has been reached. Please wait a few minutes before trying again or come back tomorrow.");
    }
    throw new Error("Failed to generate ideas from the AI service. Please try again later.");
  }
};

export const generateSuggestions = async (topic: string): Promise<string[]> => {
  try {
    const prompt = `Generate 3 creative and specific blog post topic suggestions related to "${topic}". The suggestions should be concise and ready to be used as topics. Return the response as a JSON array of strings. Example: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
      return [];
    }

    const suggestions = JSON.parse(responseText);
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 3); // Ensure we only return max 3 suggestions
    }
    return [];

  } catch (error: any) {
    console.error("Error generating suggestions:", error);
    if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
       // Silently fail suggestions on quota error, or we could set a flag
       return [];
    }
    return [];
  }
};
