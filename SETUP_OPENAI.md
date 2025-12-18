# How to Get OpenAI API Key and Model

## Step-by-Step Guide

### 1. Get Your OpenAI API Key

#### Step 1: Sign Up / Log In
- Go to: **https://platform.openai.com/signup**
- If you already have an account, log in at: **https://platform.openai.com/login**

#### Step 2: Navigate to API Keys
- Once logged in, click on your profile icon (top right)
- Select **"API Keys"** from the dropdown menu
- Or go directly to: **https://platform.openai.com/api-keys**

#### Step 3: Create New Secret Key
- Click the **"+ Create new secret key"** button
- Give it a name (e.g., "Tasklyx Project")
- Click **"Create secret key"**
- **⚠️ IMPORTANT**: Copy the key immediately! It starts with `sk-` and looks like:
  ```
  sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
- You won't be able to see it again after closing the dialog

#### Step 4: Add Credits (If Needed)
- Go to: **https://platform.openai.com/account/billing**
- Add payment method and credits
- New accounts often get $5 free credit to start

---

## 2. Choose Your Model

### Available Models (as of 2024)

#### Recommended: `gpt-4o-mini` ⭐ (Default)
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Best for**: Most use cases, cost-effective
- **Speed**: Fast
- **Quality**: Good for task management features

#### Alternative: `gpt-4o`
- **Cost**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens
- **Best for**: Better quality when needed
- **Speed**: Fast
- **Quality**: Excellent

#### Alternative: `gpt-4-turbo`
- **Cost**: ~$10 per 1M input tokens, ~$30 per 1M output tokens
- **Best for**: Complex reasoning tasks
- **Speed**: Medium
- **Quality**: Very high

#### Alternative: `gpt-3.5-turbo` (Legacy)
- **Cost**: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens
- **Best for**: Simple tasks, budget-conscious
- **Speed**: Very fast
- **Quality**: Good for basic tasks

### Model Comparison

| Model | Cost (per 1M tokens) | Speed | Quality | Best For |
|-------|---------------------|-------|---------|----------|
| `gpt-4o-mini` | $0.15 / $0.60 | ⚡⚡⚡ | ⭐⭐⭐⭐ | **Recommended** |
| `gpt-4o` | $2.50 / $10 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | High quality |
| `gpt-4-turbo` | $10 / $30 | ⚡⚡ | ⭐⭐⭐⭐⭐ | Complex tasks |
| `gpt-3.5-turbo` | $0.50 / $1.50 | ⚡⚡⚡ | ⭐⭐⭐ | Budget option |

**💡 Recommendation**: Start with `gpt-4o-mini` - it's fast, cheap, and works great for task management!

---

## 3. Configure in Your Project

### Add to `.env.local` file

Create or edit `.env.local` in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Important Notes**:
- Replace `sk-proj-your-actual-key-here` with your actual API key
- The model is optional - defaults to `gpt-4o-mini` if not specified
- Never commit `.env.local` to git (it's already in `.gitignore`)

### Example `.env.local`:

```env
# Database
MONGODB_URI=your-mongodb-uri

# Email
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Tasklyx <your-email@domain.com>

# OpenAI (NEW)
OPENAI_API_KEY=sk-proj-abc123xyz789...
OPENAI_MODEL=gpt-4o-mini
```

---

## 4. Verify Setup

### Restart Your Server
```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### Test the Setup
1. Go to any board in your app
2. Click "AI Create" button in a list
3. Type: "Test task, high priority"
4. Click "Parse Task"
5. If it works, you're all set! ✅

---

## 5. Cost Management

### Set Usage Limits (Recommended)

1. Go to: **https://platform.openai.com/account/limits**
2. Set **Hard limit** (e.g., $10/month)
3. Set **Soft limit** (e.g., $5/month) - you'll get notified

### Monitor Usage

- Dashboard: **https://platform.openai.com/usage**
- Check your spending regularly
- Review API usage by feature

### Estimated Costs

With `gpt-4o-mini`:
- **100 AI operations** ≈ $0.10 - $0.20
- **1,000 AI operations** ≈ $1 - $2
- **10,000 AI operations** ≈ $10 - $20

---

## 6. Troubleshooting

### "AI is not enabled" Error
- ✅ Check `.env.local` exists
- ✅ Verify `OPENAI_API_KEY` is set correctly
- ✅ Restart your dev server
- ✅ Check the key starts with `sk-`

### "Invalid API Key" Error
- ✅ Verify you copied the full key
- ✅ Check for extra spaces
- ✅ Make sure key hasn't been revoked
- ✅ Try creating a new key

### "Insufficient Credits" Error
- ✅ Go to billing: https://platform.openai.com/account/billing
- ✅ Add payment method
- ✅ Add credits

### API Rate Limits
- ✅ Check: https://platform.openai.com/account/rate-limits
- ✅ Free tier has lower limits
- ✅ Paid accounts have higher limits

---

## 7. Security Best Practices

### ✅ DO:
- Store API key in `.env.local` (never commit to git)
- Use environment variables only
- Set usage limits
- Monitor your usage regularly
- Rotate keys periodically

### ❌ DON'T:
- Commit API keys to git
- Share keys publicly
- Hardcode keys in source code
- Use the same key for multiple projects (create separate keys)

---

## Quick Links

- **Sign Up**: https://platform.openai.com/signup
- **API Keys**: https://platform.openai.com/api-keys
- **Billing**: https://platform.openai.com/account/billing
- **Usage**: https://platform.openai.com/usage
- **Documentation**: https://platform.openai.com/docs
- **Models**: https://platform.openai.com/docs/models
- **Pricing**: https://openai.com/pricing

---

## Need Help?

1. Check OpenAI Status: https://status.openai.com/
2. OpenAI Support: https://help.openai.com/
3. Review your project's `README_AI_FEATURES.md` for feature details

