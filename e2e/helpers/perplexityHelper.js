const axios = require('axios');

/**
 * AI Provider Configuration
 * Supports: Ollama (free, local), Perplexity (paid), Groq (free tier), Gemini (free tier)
 */
const AI_PROVIDERS = {
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434/api/generate',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
  },
  perplexity: {
    url: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3.1-sonar-small-128k-online',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
  },
};

// Default to Ollama (free, local)
const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

/**
 * Analyze test data using Ollama (local, free)
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - AI response
 */
async function analyzeWithOllama(prompt) {
  const config = AI_PROVIDERS.ollama;
  
  try {
    const response = await axios.post(config.url, {
      model: config.model,
      prompt: prompt,
      stream: false,
    }, {
      timeout: 60000, // 60 second timeout for local inference
    });
    
    return response.data.response;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.warn('Ollama not running. Start with: ollama serve');
      return 'AI analysis skipped - Ollama not running. Start with: ollama serve';
    }
    throw error;
  }
}

/**
 * Analyze test data using Perplexity API (paid)
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - AI response
 */
async function analyzeWithPerplexityAPI(prompt) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return 'Perplexity API key not configured';
  }
  
  const config = AI_PROVIDERS.perplexity;
  const response = await axios.post(config.url, {
    model: config.model,
    messages: [
      { role: 'system', content: 'You are a QA engineer analyzing test results. Provide concise, actionable insights.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.2,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.data.choices[0].message.content;
}

/**
 * Analyze test data using Groq API (free tier available)
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - AI response
 */
async function analyzeWithGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return 'Groq API key not configured';
  }
  
  const config = AI_PROVIDERS.groq;
  const response = await axios.post(config.url, {
    model: config.model,
    messages: [
      { role: 'system', content: 'You are a QA engineer analyzing test results. Provide concise, actionable insights.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.2,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.data.choices[0].message.content;
}

/**
 * Analyze test data or results using configured AI provider
 * Default: Ollama (free, local)
 * @param {string|object} data - Data to analyze
 * @param {string} context - Additional context for analysis
 * @returns {Promise<string>} - AI analysis result
 */
async function analyzeWithPerplexity(data, context = 'test result analysis') {
  const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
  const prompt = `Analyze this ${context}:\n\n${dataStr}\n\nProvide a brief summary of findings and any issues detected.`;
  
  try {
    switch (AI_PROVIDER.toLowerCase()) {
      case 'ollama':
        return await analyzeWithOllama(prompt);
      case 'perplexity':
        return await analyzeWithPerplexityAPI(prompt);
      case 'groq':
        return await analyzeWithGroq(prompt);
      default:
        return await analyzeWithOllama(prompt);
    }
  } catch (error) {
    console.error(`AI analysis error (${AI_PROVIDER}):`, error.message);
    return `AI analysis failed: ${error.message}`;
  }
}

/**
 * Generate test suggestions using configured AI provider
 * @param {string} featureDescription - Description of feature to test
 * @returns {Promise<string>} - Suggested test scenarios
 */
async function generateTestSuggestions(featureDescription) {
  const prompt = `You are a QA engineer. Generate BDD test scenarios in Gherkin format for: ${featureDescription}\n\nProvide scenarios with Given/When/Then steps.`;
  
  try {
    switch (AI_PROVIDER.toLowerCase()) {
      case 'ollama':
        return await analyzeWithOllama(prompt);
      case 'perplexity':
        return await analyzeWithPerplexityAPI(prompt);
      case 'groq':
        return await analyzeWithGroq(prompt);
      default:
        return await analyzeWithOllama(prompt);
    }
  } catch (error) {
    console.error(`Test generation error (${AI_PROVIDER}):`, error.message);
    return `Test generation failed: ${error.message}`;
  }
}

/**
 * Analyze test failure and suggest fixes using configured AI provider
 * @param {object} failureData - Test failure information
 * @returns {Promise<string>} - Suggested fixes
 */
async function analyzeTestFailure(failureData) {
  const prompt = `You are a QA automation expert. Analyze this test failure:\n\nTest: ${failureData.testName}\nError: ${failureData.error}\nStack: ${failureData.stack}\n\nProvide:\n1. Root cause analysis\n2. Suggested fix\n3. Prevention tips`;
  
  try {
    switch (AI_PROVIDER.toLowerCase()) {
      case 'ollama':
        return await analyzeWithOllama(prompt);
      case 'perplexity':
        return await analyzeWithPerplexityAPI(prompt);
      case 'groq':
        return await analyzeWithGroq(prompt);
      default:
        return await analyzeWithOllama(prompt);
    }
  } catch (error) {
    console.error(`Failure analysis error (${AI_PROVIDER}):`, error.message);
    return `Failure analysis failed: ${error.message}`;
  }
}

module.exports = {
  analyzeWithPerplexity,
  generateTestSuggestions,
  analyzeTestFailure,
};
