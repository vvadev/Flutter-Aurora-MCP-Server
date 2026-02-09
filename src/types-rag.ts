import { Category } from './types.js';

export interface DocumentChunk {
  id: string;
  content: string;
  documentId: string;
  category: Category;
  position: number;
  header: string;
}

export interface EmbeddedChunk {
  id: string;
  content: string;
  documentId: string;
  category: Category;
  position: number;
  header: string;
  embedding: number[];
}

export interface EmbeddingCache {
  hash: string;
  timestamp: number;
  chunks: EmbeddedChunk[];
}

export interface RAGSearchResult {
  category: Category;
  name: string;
  description: string;
  relevance_score: number;
  match_type: 'semantic' | ('name' | 'description')[];
}
