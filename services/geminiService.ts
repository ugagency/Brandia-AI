
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, MarketingPlan, PostItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractColorsFromLogo = async (base64Image: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image.split(',')[1] || base64Image,
        },
      },
      {
        text: "Analyze this logo and identify the primary and secondary brand colors. Return ONLY an array of hex color codes in JSON format like this: ['#HEX1', '#HEX2']. Do not include any other text.",
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Error parsing colors", e);
    return ['#4F46E5', '#0F172A'];
  }
};

const POST_SCHEMA = {
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
    platform: { type: Type.STRING },
    status: { type: Type.STRING, description: "Must be 'pending'" },
    isTrend: { type: Type.BOOLEAN },
    dayOfMonth: { type: Type.INTEGER }
  },
  required: ["id", "type", "topic", "hook", "caption", "hashtags", "bestTime", "platform", "status", "dayOfMonth"]
};

export const generateMarketingPlan = async (profile: BusinessProfile): Promise<MarketingPlan> => {
  const colorContext = profile.manualColors ? `Use estas cores como base para a identidade visual: ${profile.manualColors.join(', ')}.` : '';
  
  const prompt = `
    Aja como um Diretor de Marketing especialista em microempreendedores.
    Gere um plano de marketing completo para: ${profile.name} (${profile.businessType}).
    Público: ${profile.targetAudience} na região de ${profile.region}.
    Objetivo: ${profile.objective}. Estilo de comunicação: ${profile.style}.
    ${colorContext}

    IMPORTANTE: Pesquise memes, trends e acontecimentos recentes de 2024/2025 que façam sentido para o nicho de ${profile.businessType}.
    Gere um CALENDÁRIO MENSAL com 20 posts (distribuídos ao longo de um mês de 30 dias).
    Alguns posts DEVEM ser baseados em memes/trends atuais (marque isTrend: true).

    Retorne os seguintes dados em JSON estruturado:
    1. Identidade da Marca (BrandIdentity): bio, descrição curta, promessa de valor, palavras-chave, cores sugeridas (hex), estilo visual.
    2. Estratégia de Conteúdo (ContentStrategy): tipos ideais, frequência semanal, formatos, temas quentes e justificativa estratégica.
    3. Calendário de Conteúdo (PostItem[]): 20 postagens variadas, sem repetir temas.
    4. Análise de Concorrentes (Competitor[]): 2-3 tipos de concorrentes locais.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
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
            items: POST_SCHEMA
          },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                postTypes: { type: Type.STRING },
                engagementLevel: { type: Type.STRING },
                opportunity: { type: Type.STRING }
              },
              required: ["name", "postTypes", "engagementLevel", "opportunity"]
            }
          }
        },
        required: ["identity", "strategy", "calendar", "competitors"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const extendCalendar = async (profile: BusinessProfile, existingPosts: PostItem[]): Promise<PostItem[]> => {
  const lastDay = Math.max(...existingPosts.map(p => p.dayOfMonth), 0);
  const existingTopics = existingPosts.map(p => p.topic).join(', ');

  const prompt = `
    Aja como um Estrategista de Conteúdo para ${profile.name}.
    Temos os seguintes posts já planejados: ${existingTopics}.
    
    Gere mais 10 NOVOS posts para os dias ${lastDay + 1} em diante.
    NÃO REPITA os temas já abordados.
    Inclua novas tendências e memes recentes (pesquise no Google).
    
    Retorne apenas um array JSON de objetos PostItem.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: POST_SCHEMA
      }
    }
  });

  return JSON.parse(response.text);
};
