import { NextResponse } from "next/server";
import { parseTaskFromNaturalLanguage, isAIEnabled } from "@/lib/ai";

export async function POST(request) {
  try {
    if (!isAIEnabled()) {
      return NextResponse.json(
        { 
          message: "AI is not enabled. Please set GEMINI_API_KEY in environment variables.",
          enabled: false 
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { input, context = {} } = body;

    if (!input || !input.trim()) {
      return NextResponse.json(
        { message: "Input text is required" },
        { status: 400 }
      );
    }

    const parsed = await parseTaskFromNaturalLanguage(input, context);

    return NextResponse.json(
      {
        success: true,
        data: parsed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Parse Task] Error:", error);
    
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
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Failed to parse task",
        error: error.message,
        enabled: isAIEnabled(),
      },
      { status: 500 }
    );
  }
}

