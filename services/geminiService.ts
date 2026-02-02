
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
    return ['#22c55e', '#06b6d4']; 
  }
};

const REELS_METADATA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hook3s: { type: Type.STRING, description: "Attention-grabbing hook for the first 3 seconds." },
    cta: { type: Type.STRING, description: "Optimized Call to Action." },
    audioTrend: { type: Type.STRING, description: "Suggested trending audio or sound style." }
  },
  required: ["hook3s", "cta"]
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
    platform: { type: Type.STRING, description: "Must be 'Instagram', 'TikTok', 'LinkedIn' or 'YouTube Shorts'" },
    status: { type: Type.STRING, description: "Must be 'pending'" },
    isTrend: { type: Type.BOOLEAN },
    dayOfMonth: { type: Type.INTEGER },
    reelsMetadata: REELS_METADATA_SCHEMA
  },
  required: ["id", "type", "topic", "hook", "caption", "hashtags", "bestTime", "platform", "status", "dayOfMonth"]
};

export const generateMarketingPlan = async (profile: BusinessProfile): Promise<MarketingPlan> => {
  const colorContext = profile.manualColors ? `Cores base: ${profile.manualColors.join(', ')}.` : '';
  
  const prompt = `
    Aja como Diretor de Marketing Digital Sênior. Gere um plano completo e altamente detalhado para: ${profile.name}.
    TIPO DE NEGÓCIO: ${profile.businessType}.
    DESCRIÇÃO DETALHADA DO PRODUTO/SERVIÇO: ${profile.productDescription}.
    PÚBLICO-ALVO: ${profile.targetAudience} em ${profile.region}.
    OBJETIVO PRINCIPAL: ${profile.objective}. 
    ESTILO DE MARCA: ${profile.style}. 
    ${colorContext}

    REQUISITOS OBRIGATÓRIOS:
    1. CALENDÁRIO MENSAL: Gere 20 posts variados distribuídos entre Instagram (Reels/Carrossel), TikTok, LinkedIn e YouTube Shorts.
    2. GANCHOS E CTAS: Para vídeos curtos, use ganchos psicológicos de 3 segundos e CTAs focados no objetivo de ${profile.objective}.
    3. TENDÊNCIAS: Pesquise tendências de 2025 via Google Search relevantes para o produto: ${profile.productDescription}.
    4. ADAPTAÇÃO: Selecione os 3 melhores posts e adapte para TikTok, LinkedIn, YouTube Shorts e WhatsApp.
    5. CONCORRÊNCIA: Liste 3 concorrentes REAIS em ${profile.region} e aponte como superá-los com base no produto descrito.

    IMPORTANT: Return EXACTLY a valid JSON object matching the requested schema. No conversational text.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
                recentActivity: { type: Type.STRING },
                engagementLevel: { type: Type.STRING },
                opportunity: { type: Type.STRING }
              },
              required: ["name", "postTypes", "recentActivity", "engagementLevel", "opportunity"]
            }
          },
          adaptations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                postId: { type: Type.STRING },
                originalTopic: { type: Type.STRING },
                tiktok: {
                  type: Type.OBJECT,
                  properties: {
                    videoIdea: { type: Type.STRING },
                    caption: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    audioTrendSuggestion: { type: Type.STRING }
                  },
                  required: ["videoIdea", "caption", "hashtags", "audioTrendSuggestion"]
                },
                linkedin: {
                  type: Type.OBJECT,
                  properties: {
                    postText: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["postText", "hashtags"]
                },
                youtubeShorts: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    videoIdea: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "description", "videoIdea", "hashtags"]
                },
                whatsapp: {
                  type: Type.OBJECT,
                  properties: {
                    message: { type: Type.STRING },
                    statusIdea: { type: Type.STRING }
                  },
                  required: ["message", "statusIdea"]
                }
              },
              required: ["postId", "originalTopic", "tiktok", "linkedin", "youtubeShorts", "whatsapp"]
            }
          }
        },
        required: ["identity", "strategy", "calendar", "competitors", "adaptations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error. Raw response:", text);
    throw new Error("Falha ao processar os dados da IA. O formato retornado é inválido.");
  }
};

export const extendCalendar = async (profile: BusinessProfile, existingPosts: PostItem[]): Promise<PostItem[]> => {
  const lastDay = Math.max(...existingPosts.map(p => p.dayOfMonth), 0);
  const existingTopics = existingPosts.map(p => p.topic).slice(-10).join(', ');

  const prompt = `
    Aja como Estrategista de Conteúdo Sênior. Gere mais 10 posts novos para ${profile.name} do dia ${lastDay + 1} em diante.
    Contexto do produto: ${profile.productDescription}.
    NÃO REPITA ESTES TEMAS: ${existingTopics}.
    Distribua entre Instagram, TikTok, LinkedIn e YouTube Shorts.
    Retorne apenas um array JSON de PostItem.
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

  const text = response.text;
  if (!text) throw new Error("Empty response from AI extension");
  return JSON.parse(text);
};
