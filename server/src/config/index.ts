import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  jwtSecret: process.env.JWT_SECRET || 'stadium_iq_access_secret_2026_super_secure',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'stadium_iq_refresh_secret_2026_super_secure',
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  // Use mock AI responses if set to true or if no API keys are present
  useMockAI: process.env.USE_MOCK_AI === 'true' || (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY)
};
