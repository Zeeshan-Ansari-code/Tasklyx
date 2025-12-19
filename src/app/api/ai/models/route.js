import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          message: "GEMINI_API_KEY is not set",
          available: false,
        },
        { status: 503 }
      );
    }

    // Fetch available models from Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message: "Failed to fetch models",
          error: errorData.error?.message || "Unknown error",
          available: false,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter and format models
    const models = (data.models || [])
      .filter((model) => {
        // Only show models that support generateContent
        return (
          model.supportedGenerationMethods?.includes("generateContent") ||
          model.supportedGenerationMethods?.includes("generateContentStream")
        );
      })
      .map((model) => {
        // Extract model name (remove "models/" prefix if present)
        const modelName = model.name?.replace("models/", "") || model.name;
        
        return {
          name: modelName,
          displayName: model.displayName || modelName,
          description: model.description || "",
          supportedMethods: model.supportedGenerationMethods || [],
          // Check if it's likely a free tier model
          isFreeTier: modelName.includes("flash") || modelName.includes("pro") || modelName.includes("gemini-1.0"),
          inputTokenLimit: model.inputTokenLimit || null,
          outputTokenLimit: model.outputTokenLimit || null,
        };
      })
      .sort((a, b) => {
        // Sort: free tier first, then by name
        if (a.isFreeTier && !b.isFreeTier) return -1;
        if (!a.isFreeTier && b.isFreeTier) return 1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json(
      {
        success: true,
        models,
        total: models.length,
        message: `Found ${models.length} available models`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Models] Error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch models",
        error: error.message,
        available: false,
      },
      { status: 500 }
    );
  }
}

