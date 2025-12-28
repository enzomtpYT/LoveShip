import { GoogleGenAI, Type } from "@google/genai";
import { UserAnswers, CompatibilityResult } from '../types';
import { QUESTIONS } from '../constants';

const formatAnswers = (answers: UserAnswers): string => {
  return QUESTIONS.map(q => {
    const selected = q.options.find(opt => opt.value === answers[q.id]);
    return `Q: ${q.text}\nA: ${selected?.label || 'Unknown'}`;
  }).join('\n\n');
};

export const analyzeCompatibility = async (
  answersA: UserAnswers, 
  answersB: UserAnswers,
  apiKey: string
): Promise<CompatibilityResult> => {
  if (!apiKey) {
    throw new Error("No API key provided. Please set your Gemini API key.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Analyze the romantic compatibility between two users based on their quiz responses.
    
    User A's Answers:
    ${formatAnswers(answersA)}

    User B's Answers:
    ${formatAnswers(answersB)}

    Role: Act as an insightful, empathetic, and slightly humorous relationship psychologist.
    Task: Calculate a compatibility score (0-100), provide a one-paragraph summary, list 3 strengths, 3 potential challenges, and a witty "Relationship Forecast".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Using a standard available model
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Compatibility percentage from 0 to 100" },
            summary: { type: Type.STRING, description: "A paragraph summarizing the dynamic" },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 relationship strengths"
            },
            challenges: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 potential challenges"
            },
            forecast: { type: Type.STRING, description: "A witty, short prediction for the future" }
          },
          required: ["score", "summary", "strengths", "challenges", "forecast"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(text);
    return data as CompatibilityResult;

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    if (error.message?.includes("Requested entity was not found")) {
         throw new Error("API Key or Model error. Please check your key.");
    }
    throw new Error("Failed to generate compatibility report. Please try again.");
  }
};
