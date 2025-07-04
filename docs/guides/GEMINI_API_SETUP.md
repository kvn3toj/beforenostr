# 🔑 Gemini API Setup Guide - CoomÜnity Modular Review Dashboard

## 📋 Overview

This guide provides step-by-step instructions for configuring the Gemini API key and setting up integrations for the CoomÜnity Modular Code Reviewer Dashboard.

## 🚀 Quick Setup

### 1. Obtain Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Sign in** with your Google account
3. **Create API Key**: Click "Create API Key" button
4. **Copy the key**: Save it securely (you won't be able to see it again)

### 2. Configure API Key

#### For Local Development:

```bash
# Option 1: Environment variable (recommended)
export GEMINI_API_KEY='your_api_key_here'

# Option 2: Create .env file in project root
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

#### For GitHub Actions (CI/CD):

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **"New repository secret"**
4. Name: `GEMINI_API_KEY`
5. Value: Your API key
6. Click **"Add secret"**

#### For Dashboard Development:

```bash
# Create .env in dashboard directory
cd tools/modular-review-dashboard
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

## 🧪 Testing the API Key

### 1. Test API Connection

```bash
# Test with curl
curl -H "x-goog-api-key: YOUR_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Should return a list of available models
```

### 2. Test Modular Review Script

```bash
# List available modules
node scripts/utilities/gemini-modular-review.js --list

# Review a single module
node scripts/utilities/gemini-modular-review.js HOME --delay 1000

# Review all modules
node scripts/utilities/gemini-modular-review.js --all --delay 2000
```

### 3. Test Dashboard Integration

```bash
# Start the dashboard
cd tools/modular-review-dashboard
npm run dev

# Dashboard should be available at http://localhost:5173
```

## 🔔 Slack Integration Setup

### 1. Create Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** > **"From scratch"**
3. Name your app (e.g., "CoomÜnity Code Review")
4. Select your workspace

### 2. Configure Incoming Webhooks

1. In your app settings, go to **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to On
3. Click **"Add New Webhook to Workspace"**
4. Select the channel for notifications
5. Copy the webhook URL

### 3. Configure in Dashboard

```bash
# Add to .env file
echo "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL" >> .env
```

### 4. Test Slack Integration

```bash
# Test webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🤖 CoomÜnity Code Review Dashboard is online!"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## 🎮 Discord Integration Setup

### 1. Create Discord Webhook

1. Open Discord and go to your server
2. Right-click on the channel for notifications
3. Select **"Edit Channel"** > **"Integrations"** > **"Webhooks"**
4. Click **"New Webhook"**
5. Customize name and avatar
6. Copy the webhook URL

### 2. Configure in Dashboard

```bash
# Add to .env file
echo "DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL" >> .env
```

### 3. Test Discord Integration

```bash
# Test webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"content":"🤖 CoomÜnity Code Review Dashboard is online!"}' \
  YOUR_DISCORD_WEBHOOK_URL
```

## ⚙️ Advanced Configuration

### Environment Variables Reference

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional - Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Optional - Performance Tuning
REVIEW_DELAY=1000          # Delay between API calls (ms)
MAX_RETRIES=3              # Retry attempts for failed requests
MAX_FILE_SIZE=50000        # Maximum file size to analyze (bytes)

# Optional - Dashboard
DASHBOARD_PORT=5173        # Dashboard development port
REFRESH_INTERVAL=60000     # Data refresh interval (ms)
```

### Custom Alert Thresholds

Edit the dashboard settings or create a config file:

```json
{
  "alertThresholds": {
    "critical": {
      "totalIssues": 5,
      "errorsPerModule": 2
    },
    "warning": {
      "totalIssues": 3,
      "errorsPerModule": 1
    }
  },
  "notifications": {
    "slack": {
      "enabled": true,
      "channel": "#code-review"
    },
    "discord": {
      "enabled": true,
      "channel": "code-review"
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error

```bash
# Check if key is set
echo $GEMINI_API_KEY

# Verify key format (should start with "AIza")
# Re-generate key if necessary
```

#### 2. Rate Limiting

```bash
# Increase delay between requests
node scripts/utilities/gemini-modular-review.js HOME --delay 2000

# Use smaller batch sizes
node scripts/utilities/gemini-modular-review.js --module HOME
```

#### 3. Dashboard Not Loading Data

```bash
# Check if reports exist
ls -la reports/

# Generate test data
cd tools/modular-review-dashboard
node generate-trends.js

# Verify API endpoints
curl http://localhost:5173/test-data/latest-report.json
```

#### 4. Webhook Failures

```bash
# Test webhook URLs manually
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' $SLACK_WEBHOOK_URL

# Check webhook permissions in Slack/Discord
```

## 📊 Usage Examples

### Generate Complete Report

```bash
# Full analysis with all modules
export GEMINI_API_KEY='your_key'
node scripts/utilities/gemini-modular-review.js --all --delay 1500

# Generate trends and insights
node scripts/utilities/generate-trends.js
node scripts/utilities/send-alerts.js
```

### CI/CD Integration

```yaml
# .github/workflows/code-review.yml
name: Gemini Code Review
on: [push, pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Run code review
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          node scripts/utilities/gemini-modular-review.js --all
          node scripts/utilities/send-alerts.js
```

### Dashboard Development

```bash
# Start full development environment
npm run dev                    # Start all services
npm run dev:dashboard         # Dashboard only

# Generate test data
npm run review:all            # Full review
npm run generate:trends       # Historical data
```

## 🔒 Security Best Practices

### API Key Security

1. **Never commit API keys** to version control
2. **Use environment variables** for all deployments
3. **Rotate keys regularly** (every 90 days)
4. **Restrict key usage** to specific IPs if possible
5. **Monitor usage** in Google Cloud Console

### Webhook Security

1. **Use HTTPS webhooks** only
2. **Validate webhook signatures** when possible
3. **Limit webhook permissions** to minimum required
4. **Monitor webhook usage** for unusual activity

## 📞 Support

### Getting Help

1. **Check logs** for specific error messages
2. **Verify configuration** using test commands
3. **Review documentation** for latest updates
4. **Contact support** with detailed error information

### Useful Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Slack API Documentation](https://api.slack.com/)
- [Discord Webhooks Guide](https://support.discord.com/hc/en-us/articles/228383668)

---

**Last Updated**: July 2025 | **Version**: 1.0.0 | **Status**: ✅ Production Ready
