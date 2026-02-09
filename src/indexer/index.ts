/**
 * Document indexing system
 * Scans docs folders and builds in-memory index
 * Supports optional RAG with embeddings caching in Redis
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Category, DocumentIndex } from '../types.js';
import { VALID_CATEGORIES, config } from '../constants.js';
import { extractDescription } from './parser.js';
import { logger } from '../utils/logger.js';
import { computeFileHash } from '../rag/hasher.js';
import { chunkDocument } from '../rag/chunker.js';
import { getEmbeddingsClient } from '../rag/embeddings.js';
import { RedisCache } from '../rag/redisCache.js';
import { VectorStore } from '../rag/vectorStore.js';
import { EmbeddedChunk } from '../types-rag.js';

/**
 * Build document index by scanning all .md files in docs/ directories
 * Returns Map with key format: "category:name"
 * Optionally builds RAG embeddings if ENABLE_RAG=true
 */
export async function buildIndex(
  docsPath: string,
  redisCache?: RedisCache,
  vectorStore?: VectorStore
): Promise<Map<string, DocumentIndex>> {
  const startTime = Date.now();
  const index = new Map<string, DocumentIndex>();
  const stats: Record<Category, number> = {
    development: 0,
    porting: 0,
    plugins: 0,
  };
  
  let ragStats = {
    fromCache: 0,
    regenerated: 0,
    totalChunks: 0,
    embeddingTime: 0,
  };

  logger.info('Starting document indexing', { docsPath, ragEnabled: config.enableRag });

  if (config.enableRag && vectorStore && redisCache) {
    logger.info('RAG enabled: connecting to Redis and loading cache...');
    await redisCache.connect();
  }

  for (const category of VALID_CATEGORIES) {
    const categoryPath = path.join(docsPath, category);

    try {
      await fs.access(categoryPath);
    } catch {
      logger.warn(`Category directory not found: ${categoryPath}`);
      continue;
    }

    let files: string[];
    try {
      files = await fs.readdir(categoryPath);
    } catch (error) {
      logger.error(`Failed to read category directory: ${categoryPath}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    for (const file of files) {
      if (!file.endsWith('.md')) {
        continue;
      }

      const filePath = path.join(categoryPath, file);
      const name = file.replace(/\.md$/, '');

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const description = extractDescription(content) ?? 'No description available';

        const key = `${category}:${name}`;
        index.set(key, {
          category,
          name,
          description,
          filePath,
        });

        // RAG: generate or load embeddings
        if (config.enableRag && vectorStore && redisCache) {
          const documentKey = key;
          const hash = computeFileHash(content);
          const cache = await redisCache.getCache(`embeddings:${documentKey}`);

          if (cache && cache.hash === hash) {
            // Load from cache
            vectorStore.addOrUpdateChunks(documentKey, cache.chunks);
            ragStats.fromCache++;
            ragStats.totalChunks += cache.chunks.length;
          } else {
            // Generate new embeddings
            const chunkStartTime = Date.now();
            const chunks = chunkDocument(
              content,
              name,
              category,
              config.embeddingChunkSize,
              config.embeddingChunkOverlap
            );

            const embeddingsClient = getEmbeddingsClient();
            if (embeddingsClient.isInitialized()) {
              const embeddings = await embeddingsClient.generateEmbeddings(
                chunks.map(c => c.content)
              );

              const embeddedChunks: EmbeddedChunk[] = chunks.map((chunk, i) => ({
                ...chunk,
                embedding: embeddings[i],
              }));

              // Save to Redis
              await redisCache.saveCache(`embeddings:${documentKey}`, {
                hash,
                timestamp: Date.now(),
                chunks: embeddedChunks,
              });

              // Add to vector store
              vectorStore.addOrUpdateChunks(documentKey, embeddedChunks);

              const chunkDuration = Date.now() - chunkStartTime;
              ragStats.regenerated++;
              ragStats.totalChunks += embeddedChunks.length;
              ragStats.embeddingTime += chunkDuration;

              logger.debug(`Generated embeddings for ${name}`, {
                chunks: embeddedChunks.length,
                duration_ms: chunkDuration,
              });
            }
          }
        }

        stats[category]++;
      } catch (error) {
        logger.error(`Failed to index document: ${filePath}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const duration = Date.now() - startTime;
  const total = stats.development + stats.porting + stats.plugins;

  logger.info('Document indexing completed', {
    total,
    development: stats.development,
    porting: stats.porting,
    plugins: stats.plugins,
    duration_ms: duration,
    rag: config.enableRag ? {
      enabled: true,
      fromCache: ragStats.fromCache,
      regenerated: ragStats.regenerated,
      totalChunks: ragStats.totalChunks,
      embeddingTime: ragStats.embeddingTime,
    } : { enabled: false },
  });

  if (!config.enableRag) {
    logger.info('RAG disabled, using keyword-only search');
  }

  return index;
}
