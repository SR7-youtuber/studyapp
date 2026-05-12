/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestionsFromAIService(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{
            text: `You are a professional teacher. Based on the text below, generate 20 unique multiple-choice questions. 
Return ONLY a raw JSON array. 
Format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]. 
Do not include markdown formatting or "\`\`\`json".

Text: ${text}`
          }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.NUMBER }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Empty response from AI");
    
    return JSON.parse(textResponse.trim());
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
