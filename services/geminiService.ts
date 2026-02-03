
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
    return ['#39FF6A', '#F5F7FA']; 
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
    platform: { type: Type.STRING },
    status: { type: Type.STRING, description: "Must be 'pending'" },
    isTrend: { type: Type.BOOLEAN },
    dayOfMonth: { type: Type.INTEGER },
    reelsMetadata: REELS_METADATA_SCHEMA
  },
  required: ["id", "type", "topic", "hook", "caption", "hashtags", "bestTime", "platform", "status", "dayOfMonth"]
};

export const generateMarketingPlan = async (profile: BusinessProfile): Promise<MarketingPlan> => {
  const momentContext = profile.businessMoment ? `MOMENTO ATUAL DA EMPRESA: ${profile.businessMoment}.` : '';
  
  const prompt = `
    Aja como Diretor de Marketing Digital Sênior da STRATYX. Gere um plano de marketing ESTRATÉGICO para: ${profile.name}.
    TIPO DE NEGÓCIO: ${profile.businessType}.
    DESCRIÇÃO DO PRODUTO: ${profile.productDescription}.
    ${momentContext}
    PÚBLICO-ALVO: ${profile.targetAudience} em ${profile.region}.
    OBJETIVO: ${profile.objective}. ESTILO: ${profile.style}. 
    
    REQUISITOS DE AGENDAMENTO (OBRIGATÓRIOS E MATEMÁTICOS):
    - PLATAFORMAS SELECIONADAS: ${profile.selectedPlatforms.join(', ')}.
    - FREQUÊNCIA: ${profile.postsPerDay} post(s) POR DIA para CADA plataforma selecionada individualmente.
    - DIAS DA SEMANA ATIVOS: ${profile.selectedDaysOfWeek.join(', ')}.
    
    INSTRUÇÃO DE GERAÇÃO PARA SEMANA 1 (Dias 1 a 7):
    Para CADA dia da semana (de 1 a 7) que corresponder a um dos dias ativos em [${profile.selectedDaysOfWeek.join(', ')}], você DEVE gerar EXATAMENTE ${profile.postsPerDay} posts para CADA uma das plataformas em [${profile.selectedPlatforms.join(', ')}].
    
    Exemplo Crítico: Se o usuário selecionou 3 plataformas e 2 posts/dia, e o dia está ativo, o JSON deve conter exatamente 6 posts para aquele dia específico (2 para cada rede).
    
    NÃO pule nenhum dia ativo. NÃO ignore nenhuma das plataformas escolhidas.
    
    OUTROS REQUISITOS:
    1. RESUMO ESTRATÉGICO (summary): Justifique por que este plano (estilo de posts, tom e escolha de redes) é a melhor abordagem técnica considerando o momento da empresa e o público-alvo.
    2. CONCORRÊNCIA: Liste 3 rivais locais/digitais reais.
    3. ADAPTAÇÕES: Crie o Hub de Adaptação para as redes selecionadas.

    Retorne APENAS o JSON.
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
          summary: { type: Type.STRING },
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
        required: ["identity", "strategy", "summary", "calendar", "competitors", "adaptations"]
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error", text);
    throw new Error("Ocorreu um erro na estruturação dos dados. Tente novamente.");
  }
};

export const extendCalendar = async (profile: BusinessProfile, existingPosts: PostItem[]): Promise<PostItem[]> => {
  const lastDay = Math.max(...existingPosts.map(p => p.dayOfMonth), 0);
  const existingTopics = existingPosts.map(p => p.topic).slice(-10).join(', ');

  const prompt = `
    Aja como Estrategista de Conteúdo Sênior da STRATYX. Gere MAIS 7 dias de posts novos (Próxima Semana).
    - PLATAFORMAS: ${profile.selectedPlatforms.join(', ')}.
    - FREQUÊNCIA: ${profile.postsPerDay} post(s) POR DIA para CADA plataforma.
    - DIAS DA SEMANA ATIVOS: ${profile.selectedDaysOfWeek.join(', ')}.
    Comece do dia ${lastDay + 1}. Gere exatamente a quantidade solicitada baseada na frequência e dias ativos para cada rede.
    Retorne apenas o array JSON de PostItem.
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
