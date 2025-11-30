// OpenAI Configuration
// Add your OpenAI API key from https://platform.openai.com/api-keys

const openaiConfig = {
  apiKey: "YOUR_OPENAI_API_KEY",
  model: "whisper-1", // Whisper model for audio transcription
  temperature: 0.2,
  maxTokens: 1000,
};

// Note: To enable real AI subtitle generation:
// 1. Get API key from: https://platform.openai.com/api-keys
// 2. Replace YOUR_OPENAI_API_KEY above
// 3. Uncomment the real implementation in AISubtitleService.js

export default openaiConfig;
