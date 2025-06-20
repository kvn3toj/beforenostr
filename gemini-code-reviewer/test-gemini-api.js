#!/usr/bin/env node

/**
 * GEMINI API CONNECTION TEST
 * Tests the Gemini API integration with the configured API key
 */

import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

async function testGeminiAPI() {
  log('🧪 GEMINI API CONNECTION TEST', 'magenta');
  log('=============================\n', 'magenta');

  // Check if API key is configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    logError('No API key found. Please check your .env file.');
    logInfo('Expected: GEMINI_API_KEY=your_api_key');
    process.exit(1);
  }

  logInfo(`API Key configured: ${apiKey.substring(0, 20)}...`);

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });
    logSuccess('Gemini AI client initialized');

    // Test with a simple code review request
    const testCode = `function calculateSum(a, b) {
  if (a == null || b == null) {
    return 0;
  }
  return a + b;
}`;

    const systemInstruction = `You are an expert code reviewer. Analyze the provided code and return a JSON response with the following structure:
{
  "review_feedback": [
    {
      "line_number": 2,
      "severity": "Warning",
      "message": "Use strict equality (===) instead of loose equality (==)",
      "recommendation": "Change 'a == null' to 'a === null'"
    }
  ]
}`;

    logInfo('Sending test code review request...');

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ 
        role: "user", 
        parts: [{ text: `Language: javascript\n\nCode:\n\`\`\`javascript\n${testCode}\n\`\`\`` }] 
      }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    if (response && response.text) {
      logSuccess('Received response from Gemini API');
      
      try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.review_feedback && Array.isArray(jsonResponse.review_feedback)) {
          logSuccess(`✨ API Integration Working! Found ${jsonResponse.review_feedback.length} feedback items`);
          
          if (jsonResponse.review_feedback.length > 0) {
            logInfo('Sample feedback:');
            const firstFeedback = jsonResponse.review_feedback[0];
            log(`   • Line ${firstFeedback.line_number}: ${firstFeedback.severity}`, 'yellow');
            log(`   • ${firstFeedback.message}`, 'cyan');
          }
        } else {
          logError('Response format is unexpected');
          log(`Response: ${response.text.substring(0, 200)}...`, 'yellow');
        }
      } catch (parseError) {
        logError('Failed to parse JSON response');
        log(`Raw response: ${response.text.substring(0, 200)}...`, 'yellow');
      }
    } else {
      logError('No response received from API');
    }

  } catch (error) {
    logError(`API Test Failed: ${error.message}`);
    
    if (error.message.includes('API key not valid')) {
      logError('❌ Invalid API Key');
      logInfo('Please check your API key at: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      logError('❌ API Quota Exceeded');
      logInfo('You may have reached your API usage limit');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      logError('❌ Network Error');
      logInfo('Please check your internet connection');
    }
    
    process.exit(1);
  }

  log('\n🎉 GEMINI API TEST COMPLETED SUCCESSFULLY!', 'green');
  log('✅ Your Gemini Code Reviewer is ready to use!', 'green');
  log('\nNext steps:', 'cyan');
  log('1. Run: npm run dev', 'cyan');
  log('2. Open: http://localhost:5173', 'cyan');
  log('3. Paste some code and click "Review Code"', 'cyan');
}

// Run the test
testGeminiAPI().catch(console.error);