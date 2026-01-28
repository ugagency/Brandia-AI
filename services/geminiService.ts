
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, MarketingPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMarketingPlan = async (profile: BusinessProfile): Promise<MarketingPlan> => {
  const prompt = `
    Aja como um Diretor de Marketing especialista em microempreendedores.
    Gere um plano de marketing completo para: ${profile.name} (${profile.businessType}).
    Público: ${profile.targetAudience} na região de ${profile.region}.
    Objetivo: ${profile.objective}. Estilo de comunicação: ${profile.style}.

    Retorne os seguintes dados em JSON estruturado:
    1. Identidade da Marca (BrandIdentity): bio, descrição curta, promessa de valor, palavras-chave, cores sugeridas (hex), estilo visual.
    2. Estratégia de Conteúdo (ContentStrategy): tipos ideais, frequência semanal, formatos (Reels, Stories, etc), temas quentes e justificativa estratégica.
    3. Calendário de Conteúdo (PostItem[]): 7 ideias de postagens específicas, incluindo o gancho, legenda completa, hashtags, roteiro se for vídeo, melhor horário e plataforma.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identity: {
            type: Type.OBJECT,
            properties: {
              bio: { type: Type.STRING },
              description: { type: Type.STRING },
              promise: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedColors: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualStyle: { type: Type.STRING }
            },
            required: ["bio", "description", "promise", "keywords", "suggestedColors", "visualStyle"]
          },
          strategy: {
            type: Type.OBJECT,
            properties: {
              idealTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
              frequency: { type: Type.STRING },
              formats: { type: Type.ARRAY, items: { type: Type.STRING } },
              hotTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING }
            },
            required: ["idealTypes", "frequency", "formats", "hotTopics", "rationale"]
          },
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                topic: { type: Type.STRING },
                hook: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                script: { type: Type.STRING },
                bestTime: { type: Type.STRING },
                platform: { type: Type.STRING }
              },
              required: ["id", "type", "topic", "hook", "caption", "hashtags", "bestTime", "platform"]
            }
          }
        },
        required: ["identity", "strategy", "calendar"]
      }
    }
  });

  return JSON.parse(response.text);
};
