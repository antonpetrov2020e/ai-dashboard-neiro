
import { GoogleGenAI } from "@google/genai";
import { Tool, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY || '';

export const createChatSession = (tools: Tool[]) => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Context injection: Create a string representation of the tools
  const toolsContext = tools.map(t => 
    `- Name: ${t.name}
  Category: ${t.category}
  Description: ${t.description}
  Pricing: ${t.pricing || 'Unknown'}
  Score: ${t.score || 'N/A'}/10
  Status: ${t.status || 'Inactive'}
  Link: ${t.link}`
  ).join('\n\n');

  const systemInstruction = `
    Ты — дружелюбный и детальный AI-эксперт по технологическому стеку (Tech Stack).
    
    ТЕКУЩАЯ ДАТА: Ноябрь 2025 года.
    
    Твоя цель: Максимально помочь пользователю выбрать инструмент, объяснив нюансы.
    
    ПРАВИЛА ОФОРМЛЕНИЯ И ТИПОГРАФИКИ (СТРОГО):
    1. ВИЗУАЛ: Запрещено выдавать сплошной текст ("простыню"). Обязательно разделяй смысловые блоки и абзацы ДВОЙНЫМ переносом строки.
    2. MARKDOWN: ЗАПРЕЩЕНО использовать Markdown (звездочки **, курсив *, решетки #). Текст должен быть чистым.
    3. КАВЫЧКИ: используй только типографские «елочки». Пример: инструмент «Midjourney».
    4. ТИРЕ: используй только длинное тире (—) с пробелами. Не используй дефис (-) вместо тире.
    5. ДВОЕТОЧИЕ: после двоеточия всегда пиши с маленькой буквы (кроме имен собственных). Пример: «функции: генерация, поиск, анализ».
    6. СПИСКИ: оформляй каждый пункт с новой строки, используя эмодзи или дефис.
    
    Структура идеального ответа:
    1. Прямой ответ или вступление.
    (Пустая строка)
    2. Детальный разбор или список.
    (Пустая строка)
    3. Вывод или совет.
    
    Контекст (список инструментов пользователя):
    ${toolsContext}
    
    Правила логики:
    1. Отвечай ТОЛЬКО на основе информации из списка.
    2. Если инструмент помечен как Status: active — это означает, что пользователь его использует.
    3. Отвечай развернуто, экспертно, на русском языке.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return chat;
};

export const sendMessageToGemini = async (chat: any, message: string): Promise<string> => {
  if (!chat) return "Ошибка: API ключ не настроен.";
  
  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Извините, произошла ошибка при обращении к AI. Попробуйте позже.";
  }
};
