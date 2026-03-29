import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
const cleanJSON = (text) => {
  return text
    .replace(/^```json\s*/i, "")  // remove opening ```json
    .replace(/^```\s*/i, "")      // remove opening ``` (no lang)
    .replace(/```\s*$/i, "")      // remove closing ```
    .trim();
};


const generateAIResponse = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return  cleanJSON(response.text);

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI generation failed");
  }
};

export { generateAIResponse };