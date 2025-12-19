import { NextResponse } from "next/server";
import { isAIEnabled, callAI } from "@/lib/ai";

// Call AI for chat (supports both Gemini and Hugging Face)
async function callAIChat(message, conversationHistory = []) {
  // Build conversation context
  const systemMessage = `You are a helpful AI assistant for a project management application called Tasklyx. You help users with:
- Creating and managing tasks
- Project planning and organization
- Productivity tips and best practices
- Answering questions about the application
- Providing guidance on task management

Be concise, helpful, and friendly. If asked about creating tasks, you can guide users to use the "AI Create" feature in the boards.`;

  // Build messages array
  const messages = [
    { role: "system", content: systemMessage },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    { role: "user", content: message },
  ];

  try {
    const response = await callAI(messages, {
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("[AI Chat] Error calling AI:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    if (!isAIEnabled()) {
      return NextResponse.json(
        {
          message: "AI is not enabled. Please set GEMINI_API_KEY or HUGGINGFACE_API_KEY in environment variables.",
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

    const response = await callAIChat(message, conversationHistory);

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

