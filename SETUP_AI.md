# How to Get AI API Key

## Overview

Tasklyx supports **two AI providers**:
1. **Google Gemini** - Free tier available (may require billing enabled)
2. **Hugging Face** - **FREE - No billing required!** ⭐ Recommended if you don't want to enable billing

## Option 1: Hugging Face (FREE - No Billing Required) ⭐ RECOMMENDED

### Step 1: Get Your Hugging Face API Key

1. **Go to Hugging Face**: https://huggingface.co/
2. **Sign up** for a free account (or sign in)
3. **Go to Settings** → **Access Tokens**: https://huggingface.co/settings/tokens
4. **Create a new token** (read permission is enough)
5. **Copy your token** - it looks like: `hf_...`

### Step 2: Add to `.env.local`

**Important**: Do NOT use quotes around values in `.env.local` files!

```env
HUGGINGFACE_API_KEY=hf_your-actual-token-here
HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct
```

**That's it!** No billing required, completely free! 🎉

**Note**: 
- ✅ Correct: `HUGGINGFACE_API_KEY=hf_abc123`
- ❌ Wrong: `HUGGINGFACE_API_KEY="hf_abc123"` (quotes will be included in the value)

### Free Models Available (Chat Completions API - 2024-2025):
These models work with the **Chat Completions API** (`https://api.huggingface.co/v1/chat/completions`):

- `meta-llama/Llama-3.1-8B-Instruct` - **Recommended** ✅ - Fast and capable, works free
- `mistralai/Mistral-7B-Instruct` - ✅ Works free, excellent quality
- `Qwen/Qwen2.5-7B-Instruct` - ✅ Works free, great performance
- `HuggingFaceH4/zephyr-7b-beta` - ✅ Works free, optimized for chat

**⚠️ Important**: The old Inference API endpoint (`api-inference.huggingface.co`) is deprecated for chat models. We now use the **Chat Completions API** which works properly with modern chat models.

**Free Tier Limits**: Varies by model, typically generous for free accounts

---

## Option 2: Google Gemini (May Require Billing)

### Step 1: Get Your Gemini API Key

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API key"** in the left sidebar
4. **Create API key** in new project (or select existing)
5. **Copy your API key** - it looks like: `AIzaSy...`
6. **⚠️ Note**: You may need to enable billing (free tier still works with billing enabled)

### Step 2: Add to `.env.local`

**Important**: Do NOT use quotes around values in `.env.local` files!

```env
GEMINI_API_KEY=AIzaSy-your-actual-key-here
GEMINI_MODEL=gemini-2.0-flash-001
```

**Note**: 
- ✅ Correct: `GEMINI_API_KEY=AIzaSy_abc123`
- ❌ Wrong: `GEMINI_API_KEY="AIzaSy_abc123"` (quotes will be included in the value)

### Gemini Models Available (Free Tier):
- `gemini-2.0-flash-001` - **Recommended** - Stable version, free tier ✅
- `gemini-2.5-flash` - Newer stable version, free tier ✅
- `gemini-2.5-pro` - Pro model, free tier ✅
- `gemini-2.0-flash-exp` - Experimental, free tier ✅
- `gemini-flash-latest` - Always latest flash, free tier ✅
- `gemini-pro-latest` - Always latest pro, free tier ✅

**Note:** Visit `/ai-models` in your app to see all available models for your API key.

### Gemini Pricing:
- **Free Tier**: 15 requests per minute, 1,500 requests per day (may require billing enabled)
- **Paid**: Very affordable, check current pricing at https://ai.google.dev/pricing


---

## Complete `.env.local` Example

```env
# Database
MONGODB_URI=your-mongodb-uri

# Email
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Tasklyx <your-email@domain.com>

# AI - Choose ONE option:
# IMPORTANT: Do NOT use quotes around values!

# Option 1: Hugging Face (FREE - No billing required) ⭐ RECOMMENDED
HUGGINGFACE_API_KEY=hf_your-token-here
HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct

# Option 2: Google Gemini (may require billing enabled)
GEMINI_API_KEY=AIzaSy-your-key-here
GEMINI_MODEL=gemini-2.0-flash-001
```

---

## Why Hugging Face? ⭐

| Feature | Hugging Face |
|---------|--------------|
| **Free Tier** | ✅ Yes (50-100 req/day) |
| **Billing Required** | ❌ **NO!** Completely free |
| **Cost** | **100% Free** |
| **Speed** | ⚡⚡⚡ Very Fast |
| **Quality** | ⭐⭐⭐⭐ Excellent |
| **Setup** | Easy (just sign up) |
| **Best For** | Task management, productivity tools |

**💡 Perfect for**: Users who want free AI without enabling billing!

## Why Gemini?

| Feature | Gemini |
|---------|--------|
| **Free Tier** | ✅ Yes (15 req/min, 1,500/day) |
| **Billing Required** | ⚠️ May be required for free tier |
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
- ✅ Verify `HUGGINGFACE_API_KEY` or `GEMINI_API_KEY` is set
- ✅ Restart dev server
- ✅ Check key format:
  - Hugging Face: should start with `hf_...`
  - Gemini: should start with `AIzaSy...`

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

