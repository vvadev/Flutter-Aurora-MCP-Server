import { Config } from './types.js';

function getEnvVar(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function getEnvVarAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = Number.parseFloat(value);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

function getEnvVarAsBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true' || value === '1';
}

function normalizeAlpha(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1 && value <= 100) {
    return value / 100;
  }
  if (value > 100) {
    return 1;
  }
  return value;
}

export const config: Config = {
  port: getEnvVarAsNumber('PORT', 3000),
  host: getEnvVar('HOST', '0.0.0.0'),
  docsPath: getEnvVar('DOCS_PATH', './docs'),
  rateLimitWindowMs: getEnvVarAsNumber('RATE_LIMIT_WINDOW_MS', 60000),
  rateLimitMax: getEnvVarAsNumber('RATE_LIMIT_MAX', 60),
  sessionTtlMs: getEnvVarAsNumber('SESSION_TTL_MS', 3600000),
  allowedOrigins: getEnvVar('ALLOWED_ORIGINS', '*'),
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
  enableRag: getEnvVarAsBoolean('ENABLE_RAG', false),
  openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
  openaiBaseUrl: getEnvVar('OPENAI_BASE_URL', 'https://openrouter.ai/api/v1'),
  openaiEmbeddingModel: getEnvVar('OPENAI_EMBEDDING_MODEL', 'openai/text-embedding-3-small'),
  embeddingChunkSize: getEnvVarAsNumber('EMBEDDING_CHUNK_SIZE', 500),
  embeddingChunkOverlap: getEnvVarAsNumber('EMBEDDING_CHUNK_OVERLAP', 50),
  ragTopKResults: getEnvVarAsNumber('RAG_TOP_K_RESULTS', 10),
  ragHybridAlpha: normalizeAlpha(getEnvVarAsNumber('RAG_HYBRID_ALPHA', 50)),
  redisUrl: getEnvVar('REDIS_URL', 'redis://redis:6379'),
  enableRagCache: getEnvVarAsBoolean('ENABLE_RAG_CACHE', true),
};

export const VALID_CATEGORIES = ['development', 'porting', 'plugins'] as const;
export const SESSION_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
export const MAX_DOCUMENT_SIZE = 1024 * 1024;
