/**
 * AI Utility Functions
 * Provides AI-powered features for the project management tool
 * Uses Google Gemini API
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";

/**
 * Check if AI is enabled
 */
export function isAIEnabled() {
  return !!GEMINI_API_KEY;
}

/**
 * Convert OpenAI messages format to Gemini format
 */
function convertMessagesToGeminiFormat(messages) {
  // Gemini uses a simple text format or parts array
  // Combine system and user messages
  let text = "";
  for (const msg of messages) {
    if (msg.role === "system") {
      text += `System: ${msg.content}\n\n`;
    } else if (msg.role === "user") {
      text += `User: ${msg.content}\n\n`;
    } else if (msg.role === "assistant") {
      text += `Assistant: ${msg.content}\n\n`;
    }
  }
  return text.trim();
}

/**
 * Call Gemini API
 */
async function callGemini(messages, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set");
  }

  try {
    // Convert messages to text format for Gemini
    const prompt = convertMessagesToGeminiFormat(messages);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model || GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
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
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.max_tokens || 1000,
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("[AI] Error calling Gemini:", error);
    throw error;
  }
}


/**
 * Unified AI call function - uses Gemini API
 */
async function callAI(messages, options = {}) {
  if (!isAIEnabled()) {
    throw new Error("AI is not enabled. Please set GEMINI_API_KEY in environment variables.");
  }

  return await callGemini(messages, options);
}

/**
 * Parse natural language task description into structured data
 * Example: "Create login page with email and password fields, high priority, due tomorrow"
 */
export async function parseTaskFromNaturalLanguage(input, context = {}) {
  if (!isAIEnabled()) {
    return null;
  }

  const systemPrompt = `You are a task management assistant. Parse the user's natural language input into structured task data.

Return ONLY a valid JSON object with these fields:
{
  "title": "string (required, concise task title)",
  "description": "string (optional, detailed description)",
  "priority": "low" | "medium" | "high" | "urgent" (default: "medium"),
  "dueDate": "YYYY-MM-DD" | null (extract dates like "tomorrow", "next week", "in 3 days"),
  "labels": ["string"] (extract relevant tags/categories),
  "estimatedHours": number | null (if mentioned)
}

Context:
- Available lists: ${context.availableLists?.map(l => l.title).join(", ") || "none"}
- Board: ${context.boardTitle || "unknown"}

Examples:
Input: "Fix bug in login page, urgent, due tomorrow"
Output: {"title": "Fix bug in login page", "priority": "urgent", "dueDate": "2024-12-19", "labels": ["bug"]}

Input: "Create user dashboard with charts and stats"
Output: {"title": "Create user dashboard", "description": "Include charts and statistics", "priority": "medium", "labels": ["feature", "dashboard"]}

Now parse this input:`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      { temperature: 0.3, max_tokens: 500 }
    );

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and clean
    if (!parsed.title) {
      parsed.title = input.substring(0, 100); // Fallback to input
    }

    // Convert date strings to proper format
    if (parsed.dueDate) {
      const date = new Date(parsed.dueDate);
      if (isNaN(date.getTime())) {
        parsed.dueDate = null;
      } else {
        parsed.dueDate = date.toISOString().split("T")[0];
      }
    }

    return parsed;
  } catch (error) {
    console.error("[AI] Error parsing task:", error);
    // Fallback: return basic structure
    return {
      title: input.substring(0, 100),
      description: input.length > 100 ? input.substring(100) : "",
      priority: "medium",
      dueDate: null,
      labels: [],
    };
  }
}

/**
 * Suggest best assignee for a task based on workload and history
 */
export async function suggestTaskAssignee(task, boardMembers, recentTasks = []) {
  if (!isAIEnabled() || !boardMembers?.length) {
    return null;
  }

  const systemPrompt = `You are a task assignment assistant. Analyze the task and team members to suggest the best assignee.

Task: ${task.title}
Description: ${task.description || "none"}
Priority: ${task.priority}
Due Date: ${task.dueDate || "none"}

Team Members:
${boardMembers.map((m, i) => `${i + 1}. ${m.name || m.email} (ID: ${m._id || m.id})`).join("\n")}

Recent Task Assignments (for context):
${recentTasks.slice(0, 10).map(t => `- ${t.title} → ${t.assigneeName || "unassigned"}`).join("\n") || "none"}

Return ONLY a JSON object:
{
  "suggestedAssigneeId": "string (member ID)",
  "reason": "string (brief explanation)"
}

If you cannot determine a good match, return null for suggestedAssigneeId.`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Suggest the best assignee for this task." },
      ],
      { temperature: 0.5, max_tokens: 300 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the suggested ID exists in board members
    const isValid = boardMembers.some(
      m => (m._id || m.id)?.toString() === parsed.suggestedAssigneeId
    );

    if (!isValid) return null;

    return parsed;
  } catch (error) {
    console.error("[AI] Error suggesting assignee:", error);
    return null;
  }
}

/**
 * Auto-categorize task: suggest labels, priority, and list placement
 */
export async function autoCategorizeTask(task, availableLists = [], existingLabels = []) {
  if (!isAIEnabled()) {
    return null;
  }

  const systemPrompt = `You are a task categorization assistant. Analyze the task and suggest:
1. Appropriate labels/tags
2. Priority level
3. Best list/column placement

Task: ${task.title}
Description: ${task.description || "none"}

Available Lists: ${availableLists.map(l => l.title).join(", ") || "none"}
Existing Labels: ${existingLabels.map(l => l.name).join(", ") || "none"}

Return ONLY a JSON object:
{
  "suggestedPriority": "low" | "medium" | "high" | "urgent",
  "suggestedLabels": ["string"] (2-5 relevant labels),
  "suggestedListTitle": "string" (best matching list title or null),
  "reasoning": "string (brief explanation)"
}`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Categorize this task." },
      ],
      { temperature: 0.6, max_tokens: 400 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AI] Error auto-categorizing:", error);
    return null;
  }
}

/**
 * Generate smart summary of board activity
 */
export async function generateBoardSummary(activities, tasks, timeRange = "week") {
  if (!isAIEnabled()) {
    return null;
  }

  const systemPrompt = `You are a project management assistant. Generate a concise, actionable summary of board activity.

Activities (last ${timeRange}):
${activities.slice(0, 50).map(a => `- ${a.description} (${a.createdAt})`).join("\n") || "none"}

Tasks Status:
- Total: ${tasks.total || 0}
- Completed: ${tasks.completed || 0}
- In Progress: ${tasks.inProgress || 0}
- Overdue: ${tasks.overdue || 0}

Generate a summary (2-3 paragraphs) highlighting:
1. Key accomplishments
2. Current focus areas
3. Potential blockers or risks
4. Recommendations

Return ONLY the summary text, no JSON.`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the summary." },
      ],
      { temperature: 0.7, max_tokens: 500 }
    );

    return response.trim();
  } catch (error) {
    console.error("[AI] Error generating summary:", error);
    return null;
  }
}

/**
 * Enhance task description with AI
 */
export async function enhanceTaskDescription(basicDescription) {
  if (!isAIEnabled() || !basicDescription) {
    return basicDescription;
  }

  const systemPrompt = `You are a technical writing assistant. Enhance the task description to be more detailed, clear, and actionable.

Keep the same meaning but add:
- Clear acceptance criteria
- Technical details if mentioned
- Better structure

Return ONLY the enhanced description, no JSON or extra text.`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: basicDescription },
      ],
      { temperature: 0.5, max_tokens: 300 }
    );

    return response.trim();
  } catch (error) {
    console.error("[AI] Error enhancing description:", error);
    return basicDescription; // Return original on error
  }
}

/**
 * Semantic search - find tasks by meaning, not just keywords
 */
export async function semanticSearch(query, tasks, limit = 10) {
  if (!isAIEnabled()) {
    return tasks; // Fallback to regular search
  }

  const systemPrompt = `You are a search assistant. Find tasks that match the user's intent, not just keywords.

User Query: "${query}"

Tasks:
${tasks.map((t, i) => `${i + 1}. Title: "${t.title}" | Description: "${t.description || "none"}" | ID: ${t._id || t.id}`).join("\n")}

Return ONLY a JSON array of task IDs (as strings) that match the query, ordered by relevance:
["id1", "id2", "id3", ...]

If no tasks match, return an empty array [].`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Find matching tasks." },
      ],
      { temperature: 0.3, max_tokens: 200 }
    );

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const taskIds = JSON.parse(jsonMatch[0]);
    return tasks.filter(t => taskIds.includes((t._id || t.id)?.toString()));
  } catch (error) {
    console.error("[AI] Error in semantic search:", error);
    return tasks; // Fallback to all tasks
  }
}

