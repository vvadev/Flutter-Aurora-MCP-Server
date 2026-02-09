import { Category } from '../types.js';
import { DocumentChunk, EmbeddedChunk } from '../types-rag.js';
import { RedisCache } from './redisCache.js';
import { logger } from '../utils/logger.js';
import * as crypto from 'crypto';

interface StoredChunk {
  chunk: DocumentChunk;
  embedding: number[];
}

/**
 * In-memory vector store for embeddings
 * Loads from Redis at startup, supports incremental updates
 */
export class VectorStore {
  private chunks: Map<string, StoredChunk>;
  private documentIndex: Map<string, string[]>; // documentKey -> chunkIds

  constructor() {
    this.chunks = new Map();
    this.documentIndex = new Map();
  }

  /**
   * Add or update chunks for a document
   * Removes old chunks for this document first
   */
  addOrUpdateChunks(documentKey: string, chunks: EmbeddedChunk[]): void {
    // Remove old chunks for this document
    this.removeDocument(documentKey);

    // Add new chunks
    const chunkIds: string[] = [];
    for (const chunk of chunks) {
      const stored: StoredChunk = {
        chunk: {
          id: chunk.id,
          content: chunk.content,
          documentId: chunk.documentId,
          category: chunk.category,
          position: chunk.position,
          header: chunk.header,
        },
        embedding: chunk.embedding,
      };
      this.chunks.set(chunk.id, stored);
      chunkIds.push(chunk.id);
    }

    // Update document index
    if (chunkIds.length > 0) {
      this.documentIndex.set(documentKey, chunkIds);
    }
  }

  /**
   * Remove all chunks for a document
   */
  removeDocument(documentKey: string): void {
    const chunkIds = this.documentIndex.get(documentKey);
    if (chunkIds) {
      for (const chunkId of chunkIds) {
        this.chunks.delete(chunkId);
      }
      this.documentIndex.delete(documentKey);
    }
  }

  /**
   * Semantic search using cosine similarity
   * Returns top K chunks with scores
   */
  similaritySearch(
    queryEmbedding: number[],
    topK: number,
    category?: Category
  ): Array<{ chunk: DocumentChunk; score: number }> {
    const results: Array<{ chunk: DocumentChunk; score: number }> = [];

    for (const [, stored] of this.chunks.entries()) {
      // Filter by category if specified
      if (category && stored.chunk.category !== category) {
        continue;
      }

      // Calculate cosine similarity
      const score = this.cosineSimilarity(queryEmbedding, stored.embedding);

      results.push({
        chunk: stored.chunk,
        score,
      });
    }

    // Sort by score (descending) and take top K
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  /**
   * Get all chunks for a specific document
   */
  getChunksByDocument(documentKey: string): DocumentChunk[] {
    const chunkIds = this.documentIndex.get(documentKey);
    if (!chunkIds) {
      return [];
    }

    const chunks: DocumentChunk[] = [];
    for (const chunkId of chunkIds) {
      const stored = this.chunks.get(chunkId);
      if (stored) {
        chunks.push(stored.chunk);
      }
    }

    // Sort by position
    chunks.sort((a, b) => a.position - b.position);
    return chunks;
  }

  /**
   * Load embeddings from Redis at startup
   */
  async loadFromRedis(redisCache: RedisCache, documentKeys: string[]): Promise<void> {
    if (!redisCache.isEnabled()) {
      logger.info('Redis not enabled, skipping cache load');
      return;
    }

    let loaded = 0;
    for (const documentKey of documentKeys) {
      const cache = await redisCache.getCache(`embeddings:${documentKey}`);
      if (cache) {
        this.addOrUpdateChunks(documentKey, cache.chunks);
        loaded++;
      }
    }

    logger.info(`Loaded ${loaded}/${documentKeys.length} documents from cache`, {
      loaded,
      total: documentKeys.length,
    });
  }

  /**
   * Save all chunks to Redis
   */
  async saveToRedis(redisCache: RedisCache): Promise<void> {
    if (!redisCache.isEnabled()) {
      return;
    }

    const entries = new Map<string, { hash: string; timestamp: number; chunks: EmbeddedChunk[] }>();

    // Group chunks by document
    for (const [documentKey, chunkIds] of this.documentIndex.entries()) {
      const embeddedChunks: EmbeddedChunk[] = [];
      for (const chunkId of chunkIds) {
        const stored = this.chunks.get(chunkId);
        if (stored) {
          embeddedChunks.push({
            ...stored.chunk,
            embedding: stored.embedding,
          });
        }
      }

      if (embeddedChunks.length > 0) {
        entries.set(`embeddings:${documentKey}`, {
          hash: this.computeDocumentHash(embeddedChunks),
          timestamp: Date.now(),
          chunks: embeddedChunks,
        });
      }
    }

    if (entries.size > 0) {
      await redisCache.batchSave(entries);
    }
  }

  /**
   * Compute a simple hash from chunks for cache validation
   */
  private computeDocumentHash(chunks: EmbeddedChunk[]): string {
    const content = chunks.map(c => c.content).join('\n');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get statistics
   */
  getStats(): { totalChunks: number; totalDocuments: number } {
    return {
      totalChunks: this.chunks.size,
      totalDocuments: this.documentIndex.size,
    };
  }
}
