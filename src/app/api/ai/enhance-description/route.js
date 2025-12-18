import { NextResponse } from "next/server";
import { enhanceTaskDescription, isAIEnabled } from "@/lib/ai";

export async function POST(request) {
  try {
    if (!isAIEnabled()) {
      return NextResponse.json(
        { 
          message: "AI is not enabled. Please set GEMINI_API_KEY.",
          enabled: false 
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { description } = body;

    if (!description || !description.trim()) {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 }
      );
    }

    const enhanced = await enhanceTaskDescription(description);

    return NextResponse.json(
      {
        success: true,
        enhancedDescription: enhanced,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Enhance Description] Error:", error);
    
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
        message: "Failed to enhance description",
        error: error.message,
        originalDescription: body.description, // Return original on error
      },
      { status: 500 }
    );
  }
}

