# How to Get Gemini API Key

## Overview

Tasklyx uses **Google Gemini** AI for all AI-powered features. Gemini offers a free tier and is cost-effective for task management.

## Get Your Gemini API Key ⭐

### Step 1: Get Your Gemini API Key

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API key"** in the left sidebar
4. **Create API key** in new project (or select existing)
5. **Copy your API key** - it looks like: `AIzaSy...`

### Step 2: Add to `.env.local`

```env
GEMINI_API_KEY=AIzaSy-your-actual-key-here
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional, defaults to gemini-2.0-flash-exp
```

### Gemini Models Available:
- `gemini-2.0-flash-exp` - **Recommended** - Fast and free tier available
- `gemini-1.5-pro` - Higher quality, more expensive
- `gemini-1.5-flash` - Fast and cost-effective

### Gemini Pricing:
- **Free Tier**: 15 requests per minute, 1,500 requests per day
- **Paid**: Very affordable, check current pricing at https://ai.google.dev/pricing


---

## Complete `.env.local` Example

```env
# Database
MONGODB_URI=your-mongodb-uri

# Email
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Tasklyx <your-email@domain.com>

# AI - Gemini
GEMINI_API_KEY=AIzaSy-your-key-here
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional
```

---

## Why Gemini?

| Feature | Gemini |
|---------|--------|
| **Free Tier** | ✅ Yes (15 req/min, 1,500/day) |
| **Cost** | Very affordable |
| **Speed** | ⚡⚡⚡ Very Fast |
| **Quality** | ⭐⭐⭐⭐ Excellent |
| **Setup** | Easy (Google account) |
| **Best For** | Task management, productivity tools |

**💡 Perfect for**: Task management apps with natural language processing needs.

---

## Verify Setup

### 1. Restart Your Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Test AI Features
1. Go to any board
2. Click "AI Create" button
3. Type: "Test task, high priority"
4. Click "Parse Task"
5. If it works, you're all set! ✅

---

## Cost Estimates

### With Gemini:
- **Free Tier**: 15 requests/minute, 1,500/day
- **Paid**: Very affordable, check https://ai.google.dev/pricing
- **100 AI operations** ≈ $0.01 - $0.05 (if over free tier)
- **1,000 AI operations** ≈ $0.10 - $0.50 (if over free tier)

---

## Troubleshooting

### "AI is not enabled" Error
- ✅ Check `.env.local` exists
- ✅ Verify `GEMINI_API_KEY` is set
- ✅ Restart dev server
- ✅ Check key format (should start with `AIzaSy...`)

### "Invalid API Key" Error
- ✅ Verify you copied the full key
- ✅ Check for extra spaces
- ✅ Make sure key hasn't been revoked
- ✅ Try creating a new key at https://aistudio.google.com/

### "Rate Limit Exceeded"
- ✅ Free tier: 15 requests/minute, 1,500/day
- ✅ Wait a minute and try again
- ✅ Consider upgrading to paid tier if needed

---

## Quick Links

- **Get API Key**: https://aistudio.google.com/
- **Documentation**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Models**: https://ai.google.dev/models
- **Status**: https://status.cloud.google.com/

---

## Security Best Practices

### ✅ DO:
- Store API keys in `.env.local` (never commit to git)
- Use environment variables only
- Set usage limits where available
- Monitor your usage regularly
- Rotate keys periodically

### ❌ DON'T:
- Commit API keys to git
- Share keys publicly
- Hardcode keys in source code
- Use the same key for multiple projects

---

## Need Help?

1. Check Gemini status: https://status.cloud.google.com/
2. Review Gemini documentation: https://ai.google.dev/docs
3. Check your project's `README_AI_FEATURES.md` for feature details

