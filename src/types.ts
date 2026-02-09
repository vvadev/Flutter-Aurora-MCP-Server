export type Category = 'development' | 'porting' | 'plugins';

export interface DocumentIndex {
  category: Category;
  name: string;
  description: string;
  filePath: string;
}

export interface Session {
  id: string;
  createdAt: Date;
  lastAccessedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface ListDocumentsInput {
  category: Category;
}

export interface GetDocumentInput {
  category: Category;
  name: string;
}

export interface SearchDocumentsInput {
  query: string;
  category?: Category;
}

export interface ListDocumentsResponse {
  category: Category;
  count: number;
  documents: Array<{
    name: string;
    description: string;
  }>;
}

export interface GetDocumentResponse {
  category: Category;
  name: string;
  description: string;
  content: string;
}

export interface SearchDocumentsResponse {
  query: string;
  count: number;
  results: Array<{
    category: Category;
    name: string;
    description: string;
    match_type: 'name' | 'description' | 'semantic' | ('name' | 'description' | 'semantic')[];
    relevance_score?: number;
  }>;
}

export interface GetAllPluginsResponse {
  count: number;
  plugins: Array<{
    name: string;
    description: string;
  }>;
}

export interface ErrorResponse {
  isError: true;
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export type ToolResult<T> = T | ErrorResponse;

export interface Config {
  port: number;
  host: string;
  docsPath: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  sessionTtlMs: number;
  allowedOrigins: string;
  logLevel: string;
  enableRag: boolean;
  openaiApiKey: string;
  openaiBaseUrl: string;
  openaiEmbeddingModel: string;
  embeddingChunkSize: number;
  embeddingChunkOverlap: number;
  ragTopKResults: number;
  ragHybridAlpha: number;
  redisUrl: string;
  enableRagCache: boolean;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  indexed_documents: {
    development: number;
    porting: number;
    plugins: number;
  };
  uptime_seconds: number;
  active_sessions: number;
}
