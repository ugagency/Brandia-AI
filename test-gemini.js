import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = env.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;
const genAI = new GoogleGenAI({ apiKey });

async function test() {
    console.log("Listing models...");
    try {
        const models = await genAI.models.list();
        const modelNames = [];
        for await (const m of models) {
            modelNames.push(m.name);
        }
        console.log("Models available:", modelNames);
    } catch (e) {
        console.log("Error listing models:", e.message);
    }

    console.log("\nTesting gemini-flash-latest...");
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ parts: [{ text: "Oi" }] }]
        });
        console.log("Success with gemini-flash-latest:", response.text);
    } catch (e) {
        console.log("Error with gemini-flash-latest:", e.message);
    }
}

test();
