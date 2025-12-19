# AI Features Documentation

## Overview

Tasklyx now includes AI-powered features to enhance productivity and automate common tasks. These features support **two AI providers**:
1. **Google Gemini API** - Free tier available (may require billing enabled)
2. **Hugging Face Chat Completions API** - **FREE - No billing required!** ⭐ Recommended

**💡 Benefits**: Free tier available, cost-effective, fast responses, excellent quality.

## Setup

### Get Your Gemini API Key

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API key"** in the left sidebar
4. **Create API key** in new project (or select existing)
5. **Copy your API key** - it looks like: `AIzaSy...`

### Configure Environment Variables

Add to your `.env.local` file:

**Important**: Do NOT use quotes around values in `.env.local` files!

```env
# Option 1: Hugging Face (FREE - No billing required) ⭐ RECOMMENDED
# Uses Chat Completions API: https://api.huggingface.co/v1/chat/completions
HUGGINGFACE_API_KEY=hf_your-actual-token-here
HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct

# Option 2: Google Gemini (may require billing enabled)
GEMINI_API_KEY=AIzaSy-your-actual-key-here
GEMINI_MODEL=gemini-2.0-flash-001
```

**Recommended Hugging Face Models** (all work free with Chat Completions API):
- `meta-llama/Llama-3.1-8B-Instruct` - ⭐ Recommended
- `mistralai/Mistral-7B-Instruct` - Excellent quality
- `Qwen/Qwen2.5-7B-Instruct` - Great performance
- `HuggingFaceH4/zephyr-7b-beta` - Optimized for chat

**Note**: 
- ✅ Correct: `HUGGINGFACE_API_KEY=hf_abc123`
- ❌ Wrong: `HUGGINGFACE_API_KEY="hf_abc123"` (quotes will be included in the value)

**See `SETUP_AI.md` for detailed setup instructions.**

### 3. Restart Development Server

After adding the environment variable, restart your Next.js development server.

## Available AI Features

### 1. Natural Language Task Creation ✨

**Location**: "AI Create" button in each list column

**What it does**: 
- Parses natural language input into structured task data
- Extracts title, description, priority, due date, labels, and estimated hours
- Automatically categorizes tasks

**Example inputs**:
- `"Create login page with email and password fields, high priority, due tomorrow"`
- `"Fix bug in dashboard, urgent, assign to John"`
- `"Design user profile page, medium priority, due next week, estimated 8 hours"`

**How to use**:
1. Click "AI Create" button in any list column
2. Describe your task in natural language
3. Click "Parse Task" or press Cmd/Ctrl + Enter
4. Review the parsed data
5. Click "Create Task" to add it

### 2. Smart Task Assignment 🤖

**Location**: Task Edit Modal → Assignees section

**What it does**:
- Analyzes task details (title, description, priority, due date)
- Considers team member workload and history
- Suggests the best assignee with reasoning

**How to use**:
1. Open a task for editing
2. In the "Assignees" section, click the sparkles (✨) button next to "Add Assignee"
3. AI will suggest the best team member
4. Review and accept or manually select

### 3. Description Enhancement ✍️

**Location**: Task Edit Modal → Description field

**What it does**:
- Enhances basic task descriptions
- Adds clarity, structure, and acceptance criteria
- Makes descriptions more actionable

**How to use**:
1. Open a task for editing
2. Enter a basic description
3. Click "Enhance with AI" button that appears
4. Review the enhanced description
5. Save if satisfied

### 4. Auto-Categorization (API Available)

**Location**: Available via API endpoint `/api/ai/auto-categorize`

**What it does**:
- Suggests appropriate labels/tags
- Recommends priority level
- Suggests best list/column placement

**Status**: API is ready, UI integration coming soon

### 5. Smart Summaries (API Available)

**Location**: Available via API endpoint (for future use)

**What it does**:
- Generates board activity summaries
- Highlights key accomplishments
- Identifies potential blockers

**Status**: API is ready, UI integration coming soon

### 6. Semantic Search (API Available)

**Location**: Available via API (can be integrated into search)

**What it does**:
- Finds tasks by meaning, not just keywords
- Understands user intent
- More intelligent than keyword matching

**Status**: API is ready, can be integrated into existing search

## API Endpoints

### POST `/api/ai/parse-task`

Parse natural language into structured task data.

**Request**:
```json
{
  "input": "Create login page, high priority, due tomorrow",
  "context": {
    "boardTitle": "Web App",
    "availableLists": [{"title": "To Do"}]
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "title": "Create login page",
    "priority": "high",
    "dueDate": "2024-12-19",
    "labels": ["feature"],
    "description": "..."
  }
}
```

### POST `/api/ai/suggest-assignee`

Get AI-suggested assignee for a task.

**Request**:
```json
{
  "task": {
    "title": "Fix bug",
    "description": "...",
    "priority": "high"
  },
  "boardMembers": [...],
  "recentTasks": [...]
}
```

**Response**:
```json
{
  "success": true,
  "suggestion": {
    "suggestedAssigneeId": "user_id",
    "reason": "Best match based on expertise"
  }
}
```

### POST `/api/ai/auto-categorize`

Get AI suggestions for task categorization.

**Request**:
```json
{
  "task": {
    "title": "Fix bug",
    "description": "..."
  },
  "availableLists": [...],
  "existingLabels": [...]
}
```

**Response**:
```json
{
  "success": true,
  "categorization": {
    "suggestedPriority": "high",
    "suggestedLabels": ["bug", "urgent"],
    "suggestedListTitle": "In Progress",
    "reasoning": "..."
  }
}
```

### POST `/api/ai/enhance-description`

Enhance a task description with AI.

**Request**:
```json
{
  "description": "Fix login bug"
}
```

**Response**:
```json
{
  "success": true,
  "enhancedDescription": "Fix login bug: Investigate and resolve authentication issues preventing users from logging in. Acceptance criteria: Users can successfully log in with valid credentials, error messages are clear, and security is maintained."
}
```

## Cost Considerations

### Gemini Pricing (as of 2024)

- **Free Tier**: 15 requests per minute, 1,500 requests per day
- **Paid Tier**: Very affordable, check current pricing at https://ai.google.dev/pricing
- **Models**: Most models are free tier eligible (see `/ai-models` page)

### Estimated Costs per Feature

- **Free Tier**: All features available within free tier limits
- **Parse Task**: Free (within limits) or ~$0.0001-0.0005 per task (if over free tier)
- **Suggest Assignee**: Free (within limits) or ~$0.0001 per suggestion
- **Enhance Description**: Free (within limits) or ~$0.0001-0.0002 per enhancement
- **Auto-Categorize**: Free (within limits) or ~$0.0001 per categorization

**Example**: For 1000 tasks created with AI parsing, expect $0 (free tier) or ~$0.10-0.50 (if over free tier).

## Best Practices

1. **Use free tier models** like `gemini-2.0-flash-001` or `gemini-2.5-flash` (stable and free)
2. **Monitor API usage** in Google AI Studio dashboard
3. **Check available models** at `/ai-models` page to see free tier options
4. **Cache results** when possible (future enhancement)
5. **Make AI optional** - features gracefully degrade if API key is not set
6. **Respect rate limits** - Free tier: 15 req/min, 1,500/day

## Troubleshooting

### "AI is not enabled" Error

- Check that `GEMINI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key
- Verify the API key is valid in Google AI Studio

### API Errors

- Check Gemini API status: https://status.cloud.google.com/
- Verify your API key has sufficient quota
- Check rate limits (Free tier: 15 req/min, 1,500/day)
- If quota exceeded, wait for the retry time shown in error message

### Slow Responses

- AI features may take 1-3 seconds to respond
- Consider using `gemini-2.0-flash-001` or `gemini-2.5-flash` for faster responses
- Check your internet connection

## Future Enhancements

- [ ] Auto-categorization UI integration
- [ ] Smart summaries in board view
- [ ] Semantic search in global search
- [ ] Deadline prediction based on similar tasks
- [ ] Risk detection and alerts
- [ ] Comment analysis for action items
- [ ] Caching of AI responses
- [ ] Batch processing for multiple tasks

## Privacy & Security

- All AI requests are sent to Google's Gemini API servers
- Task data is included in API requests
- Review Google's privacy policy: https://ai.google.dev/terms
- Consider data sensitivity before using AI features
- For sensitive data, consider self-hosted AI solutions

## Support

For issues or questions:
1. Check this documentation
2. Review Gemini API documentation: https://ai.google.dev/docs
3. Check application logs for error messages
4. Verify environment variables are set correctly
5. Visit `/ai-models` page to see available models for your API key

