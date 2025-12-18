import { NextResponse } from "next/server";
import { isAIEnabled } from "@/lib/ai";

// Call Gemini API directly for chat
async function callGeminiChat(message, conversationHistory = []) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set");
  }

  // Build conversation context
  let prompt = `You are a helpful AI assistant for a project management application called Tasklyx. You help users with:
- Creating and managing tasks
- Project planning and organization
- Productivity tips and best practices
- Answering questions about the application
- Providing guidance on task management

Be concise, helpful, and friendly. If asked about creating tasks, you can guide users to use the "AI Create" feature in the boards.

Conversation history:\n`;
  
  // Add conversation history (last 10 messages)
  conversationHistory.slice(-10).forEach((msg) => {
    if (msg.role === "user") {
      prompt += `User: ${msg.content}\n`;
    } else if (msg.role === "assistant") {
      prompt += `Assistant: ${msg.content}\n`;
    }
  });

  prompt += `\nUser: ${message}\nAssistant:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      const errorMessage = errorData.error?.message || "Gemini API error";
      
      // Check for quota/rate limit errors
      if (errorMessage.includes("quota") || errorMessage.includes("Quota exceeded") || errorMessage.includes("rate limit")) {
        // Extract retry time if available
        const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? parseFloat(retryMatch[1]) : null;
        
        const quotaError = new Error(errorMessage);
        quotaError.isQuotaError = true;
        quotaError.retryAfter = retrySeconds;
        throw quotaError;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("[AI Chat] Error calling Gemini:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    if (!isAIEnabled()) {
      return NextResponse.json(
        {
          message: "AI is not enabled. Please set GEMINI_API_KEY in environment variables.",
          enabled: false,
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }

    const response = await callGeminiChat(message, conversationHistory);

    return NextResponse.json(
      {
        success: true,
        response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    
    // Handle quota/rate limit errors
    if (error.isQuotaError) {
      return NextResponse.json(
        {
          message: "API quota exceeded",
          error: error.message,
          enabled: isAIEnabled(),
          isQuotaError: true,
          retryAfter: error.retryAfter,
        },
        { status: 429 } // 429 Too Many Requests
      );
    }
    
    return NextResponse.json(
      {
        message: "Failed to get AI response",
        error: error.message,
        enabled: isAIEnabled(),
      },
      { status: 500 }
    );
  }
}

