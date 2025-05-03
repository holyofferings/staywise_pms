import { OpenAI } from "openai";
import { config } from "dotenv";

config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateMarketingContent = async (
  type: string,
  targetAudience: string,
  keywords: string[],
  tone: string
) => {
  try {
    const prompt = `Create a ${type} for a hotel targeting ${targetAudience}. 
    Include these keywords: ${keywords.join(", ")}.
    Use a ${tone} tone.`;

    const response = await openai.completions.create({
      model: "gpt-4o",
      prompt,
      max_tokens: 500
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating marketing content:", error);
    throw new Error("Failed to generate marketing content");
  }
};

export const handleSalesConversation = async (
  userInput: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>
) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful sales agent for a hotel. Provide information about rooms, amenities, and help with bookings."
      },
      ...conversationHistory,
      { role: "user", content: userInput }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in sales conversation:", error);
    throw new Error("Failed to generate response");
  }
}; 