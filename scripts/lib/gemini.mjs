import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import {
  GEMINI_API_KEY,
  GEMINI_TEXT_MODEL,
  GEMINI_IMAGE_MODEL,
  requireGemini,
} from "./env.mjs";

export function getTextModel() {
  requireGemini();
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });
}

export async function generateText(prompt) {
  const model = getTextModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateImage(prompt, outPath) {
  requireGemini();
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: GEMINI_IMAGE_MODEL,
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  });

  const result = await model.generateContent(prompt);
  const parts = result.response.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData?.data) {
      const buf = Buffer.from(part.inlineData.data, "base64");
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const ext = part.inlineData.mimeType?.includes("png") ? ".png" : ".webp";
      const finalPath = outPath.replace(/\.[^.]+$/, ext);
      await fs.writeFile(finalPath, buf);
      return finalPath;
    }
  }

  throw new Error(`No image in Gemini response for ${outPath}`);
}
