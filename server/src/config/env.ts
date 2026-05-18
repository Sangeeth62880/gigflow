import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CLIENT_URL'] as const;

function validateEnv(): EnvConfig {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n❌ FATAL: Missing required environment variables:\n${missing.map((v) => `   - ${v}`).join('\n')}\n\nCreate a .env file based on .env.example and provide all required values.\n`
    );
    process.exit(1);
  }

  return {
    PORT: parseInt(process.env.PORT || '5050', 10),
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
    CLIENT_URL: process.env.CLIENT_URL!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  };
}

export const env = validateEnv();
