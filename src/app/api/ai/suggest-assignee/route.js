import { NextResponse } from "next/server";
import { suggestTaskAssignee, isAIEnabled } from "@/lib/ai";

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
    const { task, boardMembers = [], recentTasks = [] } = body;

    if (!task) {
      return NextResponse.json(
        { message: "Task data is required" },
        { status: 400 }
      );
    }

    const suggestion = await suggestTaskAssignee(task, boardMembers, recentTasks);

    return NextResponse.json(
      {
        success: true,
        suggestion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Suggest Assignee] Error:", error);
    
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
        message: "Failed to suggest assignee",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

