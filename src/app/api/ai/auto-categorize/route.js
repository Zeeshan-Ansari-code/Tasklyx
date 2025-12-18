import { NextResponse } from "next/server";
import { autoCategorizeTask, isAIEnabled } from "@/lib/ai";

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
    const { task, availableLists = [], existingLabels = [] } = body;

    if (!task) {
      return NextResponse.json(
        { message: "Task data is required" },
        { status: 400 }
      );
    }

    const categorization = await autoCategorizeTask(task, availableLists, existingLabels);

    return NextResponse.json(
      {
        success: true,
        categorization,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Auto-Categorize] Error:", error);
    
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
        message: "Failed to categorize task",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

