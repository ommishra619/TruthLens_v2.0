import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, AnalysisSource } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an elite E-commerce Fraud & Intelligence Analyst.
      
      TARGET ASSET: "${url}"
      
      YOUR DIRECTIVE:
      1. Identify the specific product and brand from the URL.
      2. Synthesize a global intelligence report by searching for real consumer data, Reddit threads, tech forums, and third-party review aggregators.
      3. Identify "Fraud Vectors":
         - Linguistic anomalies suggesting LLM-generated reviews.
         - Synchronized review spikes (bot farms).
         - High sentiment bias (extreme positivity with zero nuance).
         - Recurring technical phrasing across diverse platforms.
      
      OUTPUT ARCHITECTURE:
      Return a SINGLE Valid JSON object. Do not include markdown formatting.
      The JSON must strictly match this schema:
      {
        "productName": "string",
        "overallScore": number (0-100, where 100 is EXTREME FRAUD/SCAM, 0 is AUTHENTIC),
        "verdict": "string" (e.g., "Authentic", "Anomalous", "Extreme Fraud Risk"),
        "summary": "string (A high-level synthesis of your findings)",
        "keyInsights": ["string (3 distinct bullet points about intelligence gathered)"],
        "ratingDistribution": [
           {"star": 1, "count": number}, 
           {"star": 2, "count": number}, 
           {"star": 3, "count": number}, 
           {"star": 4, "count": number}, 
           {"star": 5, "count": number}
        ],
        "reviews": [
          {
            "id": "string",
            "reviewerName": "string",
            "rating": number (1-5),
            "text": "string (Real quote or synthesized summary of a specific user point)",
            "date": "string",
            "fakeScore": number (0-100),
            "flags": ["string (e.g., 'Bot Pattern', 'Linguistic Anomaly', 'Paid Review')"],
            "sentiment": "Positive" | "Negative" | "Neutral"
          }
        ]
      }
    `;

    let response;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          }
        });
        break;
      } catch (err: any) {
        attempts++;
        const isOverloaded = err.message?.includes('503') || err.message?.includes('overloaded');
        if (isOverloaded && attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000;
          await wait(delay);
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Fraud Defense Node unreachable.");
    }

    const rawText = response.text || "{}";
    let jsonString = rawText.trim();
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    let data: AnalysisResult = JSON.parse(jsonString);

    if (!data.ratingDistribution) data.ratingDistribution = [1,2,3,4,5].map(s => ({ star: s, count: 0 }));
    if (!data.reviews) data.reviews = [];

    // Correctly handle Grounding Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const sourcesMap = new Map<string, AnalysisSource>();
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sourcesMap.set(chunk.web.uri, {
            uri: chunk.web.uri,
            title: chunk.web.title || "Intelligence Source"
          });
        }
      });
      data.sources = Array.from(sourcesMap.values());
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Fraud analysis synthesis failed.");
  }
};