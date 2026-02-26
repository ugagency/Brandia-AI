
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, MarketingPlan, PostItem } from "../types";

// Função auxiliar para inicialização lazy do SDK
let aiInstance: any = null;
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING: Verifique se a variável está no .env.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const extractColorsFromLogo = async (base64Image: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: "Analyze this logo and identify the primary and secondary brand colors. Return ONLY an array of hex color codes in JSON format like this: ['#HEX1', '#HEX2']. Do not include any other text.",
        }
      ]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
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
    funnelStage: { type: Type.STRING, description: "Must be 'ToFu', 'MoFu', or 'BoFu'" },
    reelsMetadata: REELS_METADATA_SCHEMA
  },
  required: ["id", "type", "topic", "hook", "caption", "hashtags", "bestTime", "platform", "status", "dayOfMonth", "funnelStage"]
};

export const generateMarketingPlan = async (profile: BusinessProfile): Promise<MarketingPlan> => {
  console.log("🚀 Iniciando generateMarketingPlan no Gemini...");
  const prompt = `
    Aja como Diretor de Marketing Digital Sênior da STRATYX. Gere um plano completo e altamente detalhado para: ${profile.name}.
    TIPO DE NEGÓCIO: ${profile.businessType}.
    DESCRIÇÃO DETALHADA DO PRODUTO: ${profile.productDescription}.
    PÚBLICO-ALVO: ${profile.targetAudience} em ${profile.region}.
    MOMENTO ATUAL: ${profile.businessStage}.
    OBJETIVO: ${profile.objective}. ESTILO: ${profile.style}. 
    PLATAFORMAS SELECIONADAS: ${profile.selectedPlatforms.join(', ')}.
    FREQUÊNCIA: ${profile.postsPerDay} post(s) por dia PARA CADA plataforma selecionada nos dias: ${profile.selectedDaysOfWeek.join(', ')}.

    REQUISITOS OBRIGATÓRIOS:
    1. CALENDÁRIO: Gere um calendário robusto de posts. A regra de frequência é INDIVIDUAL por plataforma. 
       EXEMPLO: Se selecionou 3 plataformas e 2 posts/dia, você deve gerar 6 posts NO TOTAL para cada dia válido (2 p/ cada rede).
       Respeite RIGOROSAMENTE a frequência de ${profile.postsPerDay} posts em CADA plataforma selecionada (${profile.selectedPlatforms.join(', ')}) para os dias escolhidos.
    2. GANCHOS E CTAS: Use ganchos de 3s e CTAs agressivos para conversão.
    3. TENDÊNCIAS: Use sua ferramenta de busca para pesquisar tendências REAIS de 2025 para ${profile.businessType} e ${profile.region}.
    4. ESTRATÉGIA (strategy): Detalhe os formatos ideais, frequência e um racional robusto do porquê desta abordagem.
    5. COMPETIDORES: Use a busca para identificar 3 rivais REAIS em ${profile.region} para ${profile.businessType} e preencha a seção competitors com detalhes de seus pontos fracos.
    6. FUNIL DE VENDAS (A CORAÇÃO DO PLANO): Aplique a metodologia ToFu, MoFu e BoFu. CADA post do calendário deve ser obrigatoriamente classificado para uma destas etapas.
       - ToFu (40% dos posts): Atração e Descoberta. Foco em educar e atrair novos olhos.
       - MoFu (40% dos posts): Consideração e Autoridade. Foco em resolver problemas e criar conexão.
       - BoFu (20% dos posts): Decisão e Venda. Foco em ofertas, depoimentos e chamadas diretas para ação.
    7. DETALHAMENTO: As legendas devem ser ricas, estratégicas e prontas para uso, refletindo o tom de voz ${profile.style}.
    8. RESUMO ESTRATÉGICO (summary): Um parágrafo denso e técnico explicando como o funil de vendas será executado para atingir o objetivo: ${profile.objective}.

    IMPORTANT: Return EXACTLY a valid JSON object matching the requested schema. No conversational text.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{ parts: [{ text: prompt }] }],
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
              rationale: { type: Type.STRING },
              funnel: {
                type: Type.OBJECT,
                properties: {
                  tofu: {
                    type: Type.OBJECT,
                    properties: {
                      stage: { type: Type.STRING },
                      goal: { type: Type.STRING },
                      contentStrategy: { type: Type.STRING }
                    },
                    required: ["stage", "goal", "contentStrategy"]
                  },
                  mofu: {
                    type: Type.OBJECT,
                    properties: {
                      stage: { type: Type.STRING },
                      goal: { type: Type.STRING },
                      contentStrategy: { type: Type.STRING }
                    },
                    required: ["stage", "goal", "contentStrategy"]
                  },
                  bofu: {
                    type: Type.OBJECT,
                    properties: {
                      stage: { type: Type.STRING },
                      goal: { type: Type.STRING },
                      contentStrategy: { type: Type.STRING }
                    },
                    required: ["stage", "goal", "contentStrategy"]
                  }
                },
                required: ["tofu", "mofu", "bofu"]
              }
            },
            required: ["idealTypes", "frequency", "formats", "hotTopics", "rationale", "funnel"]
          },
          summary: { type: Type.STRING, description: "Strategic summary of the plan's effectiveness." },
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
  if (!text) throw new Error("Empty response from AI");

  // Extract grounding chunks for compliance with Search transparency requirements
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

  try {
    const plan = JSON.parse(text);
    return { ...plan, groundingSources };
  } catch (err) {
    console.error("JSON Parse Error. Raw response:", text);
    throw new Error("Falha ao processar os dados da IA. O formato retornado é inválido.");
  }
};

export const extendCalendar = async (profile: BusinessProfile, existingPosts: PostItem[]): Promise<PostItem[]> => {
  const lastDay = Math.max(...existingPosts.map(p => p.dayOfMonth), 0);
  const existingTopics = existingPosts.map(p => p.topic).slice(-10).join(', ');

  const prompt = `
    Aja como Estrategista de Conteúdo Sênior da STRATYX. Gere mais posts novos para ${profile.name} do dia ${lastDay + 1} em diante.
    REGRA DE OURO: A frequência de ${profile.postsPerDay} posts é POR plataforma individualmente. 
    Se o usuário escolher 3 canais e 3 posts/dia, você deve gerar 9 itens para este dia.
    Plataformas: ${profile.selectedPlatforms.join(', ')}.
    Dias: ${profile.selectedDaysOfWeek.join(', ')}.
    Contexto: ${profile.productDescription}. Público: ${profile.targetAudience} em ${profile.region}.
    NÃO REPITA ESTES TEMAS: ${existingTopics}.
    Retorne apenas um array JSON de PostItem.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{ parts: [{ text: prompt }] }],
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

export const regenerateSinglePost = async (profile: BusinessProfile, post: PostItem): Promise<PostItem> => {
  const prompt = `
    Aja como Estrategista de Conteúdo Sênior da STRATYX. 
    O usuário não gostou deste post: "${post.topic}".
    Crie um NOVO post substituto para a mesma plataforma (${post.platform}) e mesmo dia (${post.dayOfMonth}).
    CONTEXTO DO NEGÓCIO: ${profile.productDescription}.
    OBJETIVO: ${profile.objective}.
    O novo post deve ser MAIS criativo, ter um gancho MAIS forte e ser completamente diferente do anterior.
    Retorne apenas o objeto JSON conforme o schema PostItem.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: POST_SCHEMA
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI regeneration");
  return JSON.parse(text);
};
