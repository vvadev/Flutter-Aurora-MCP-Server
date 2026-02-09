import { config } from '../constants.js';
import { logger } from '../utils/logger.js';

/**
 * Embeddings client using OpenAI-compatible API.
 * Simple HTTP-based implementation without LangChain dependency.
 */
class EmbeddingsClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    if (!config.enableRag || !config.openaiApiKey) {
      logger.info('RAG disabled or API key not set, skipping embeddings client');
      this.apiKey = '';
      this.baseUrl = '';
      this.model = '';
      return;
    }

    this.apiKey = config.openaiApiKey;
    this.baseUrl = config.openaiBaseUrl;
    this.model = config.openaiEmbeddingModel;
    
    logger.info('Embeddings client initialized', {
      model: this.model,
    });
  }

  /**
   * Generate embeddings for multiple texts in batches
   * Retries on failure with exponential backoff
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      throw new Error('Embeddings client not initialized');
    }

    const maxRetries = 3;
    const batchSize = 100;

    const embeddings: number[][] = [];
    let totalTexts = texts.length;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      let currentAttempt = 0;
      let success = false;

      while (currentAttempt < maxRetries && !success) {
        try {
          const batchEmbeddings = await this.callEmbeddingsAPI(batch);
          embeddings.push(...batchEmbeddings);
          success = true;
        } catch (error) {
          currentAttempt++;

          if (currentAttempt === maxRetries) {
            logger.error(`Failed to generate embeddings for batch ${i / batchSize + 1}`, {
              error: error instanceof Error ? error.message : String(error),
              batchSize: batch.length,
              attempts: maxRetries,
            });
            throw error;
          }

          // Exponential backoff
          const delay = Math.pow(2, currentAttempt) * 1000;
          logger.warn(`Embedding generation failed, retrying in ${delay}ms`, {
            attempt: currentAttempt,
            maxRetries,
            error: error instanceof Error ? error.message : String(error),
          });
          await this.sleep(delay);
        }
      }

      logger.debug(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalTexts / batchSize)}`, {
        batchSize: batch.length,
        processed: Math.min(i + batchSize, totalTexts),
        total: totalTexts,
      });
    }

    logger.info(`Generated embeddings for ${totalTexts} texts`, {
      dimension: embeddings[0]?.length || 0,
    });

    return embeddings;
  }

  /**
   * Generate single embedding for a query text
   */
  async generateQueryEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('Embeddings client not initialized');
    }

    const maxRetries = 3;
    let currentAttempt = 0;
    let success = false;

    while (currentAttempt < maxRetries && !success) {
      try {
        const embedding = await this.callEmbeddingsAPI([text]);
        success = true;
        return embedding[0];
      } catch (error) {
        currentAttempt++;

        if (currentAttempt === maxRetries) {
          logger.error('Failed to generate query embedding', {
            error: error instanceof Error ? error.message : String(error),
            attempts: maxRetries,
          });
          throw error;
        }

        const delay = Math.pow(2, currentAttempt) * 1000;
        logger.warn('Query embedding generation failed, retrying', {
          attempt: currentAttempt,
          maxRetries,
          error: error instanceof Error ? error.message : String(error),
        });
        await this.sleep(delay);
      }
    }

    throw new Error('Failed to generate query embedding');
  }

  /**
   * Call OpenAI-compatible API for embeddings
   */
  private async callEmbeddingsAPI(texts: string[]): Promise<number[][]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embeddings API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as {
      data?: Array<{ embedding?: number[] } | number[]>;
    };

    if (!data.data || data.data.length === 0) {
      throw new Error('Embeddings response is empty');
    }

    const embeddings = data.data.map((item) => {
      if (Array.isArray(item)) {
        return item;
      }
      return item.embedding ?? [];
    });

    if (embeddings.some((e) => e.length === 0)) {
      throw new Error('Embeddings response missing embedding vectors');
    }

    return embeddings;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.apiKey !== '';
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let embeddingsClient: EmbeddingsClient | null = null;

export function getEmbeddingsClient(): EmbeddingsClient {
  if (!embeddingsClient) {
    embeddingsClient = new EmbeddingsClient();
  }
  return embeddingsClient;
}

export { EmbeddingsClient };
