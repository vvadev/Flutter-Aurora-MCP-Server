/**
 * Main entry point for Flutter Aurora MCP Server
 */

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { config } from './constants.js';
import { buildIndex } from './indexer/index.js';
import { createMcpServer } from './server/index.js';
import { createMcpTransport } from './server/transport.js';
import { sessionManager } from './server/session.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { originValidator } from './middleware/originValidator.js';
import { sessionValidator } from './middleware/sessionValidator.js';
import { logger } from './utils/logger.js';
import { RedisCache } from './rag/redisCache.js';
import { VectorStore } from './rag/vectorStore.js';

// Track server start time
const startTime = Date.now();

/**
 * Main application initialization
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting Flutter Aurora MCP Server', {
      port: config.port,
      host: config.host,
      docsPath: config.docsPath,
      ragEnabled: config.enableRag,
    });

    // Initialize RAG components if enabled
    let redisCache: RedisCache | undefined;
    let vectorStore: VectorStore | undefined;

    if (config.enableRag) {
      redisCache = new RedisCache(config.redisUrl, config.enableRagCache);
      vectorStore = new VectorStore();
    }

    logger.info('Building document index...');
    const documentsIndex = await buildIndex(config.docsPath, redisCache, vectorStore);

    const mcpServer = createMcpServer(documentsIndex, vectorStore);

    const app = express();

    app.set('trust proxy', 1);

    app.use(express.json());
    app.use(originValidator);
    app.use(rateLimiter);
    app.use(sessionValidator);

    const mcpRouter = createMcpTransport(mcpServer);
    app.use('/mcp', mcpRouter);

    app.get('/', (_req, res) => {
      res.json({
        name: 'Flutter Aurora MCP Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          mcp: '/mcp',
          health: '/health'
        }
      });
    });

    app.get('/health', (_req, res) => {
      const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

      const stats = {
        development: 0,
        porting: 0,
        plugins: 0,
      };

      for (const [, doc] of documentsIndex) {
        stats[doc.category as keyof typeof stats]++;
      }

      const healthResponse: any = {
        status: 'healthy',
        indexed_documents: stats,
        uptime_seconds: uptimeSeconds,
        active_sessions: sessionManager.getActiveSessionCount(),
      };

      if (config.enableRag && vectorStore) {
        const ragStats = vectorStore.getStats();
        healthResponse.rag = {
          enabled: true,
          total_chunks: ragStats.totalChunks,
          total_documents: ragStats.totalDocuments,
          cache_enabled: redisCache?.isEnabled() ?? false,
        };
      } else {
        healthResponse.rag = {
          enabled: false,
        };
      }

      res.json(healthResponse);
    });

    sessionManager.startCleanup();

    const server = app.listen(config.port, config.host, () => {
      const stats = {
        development: 0,
        porting: 0,
        plugins: 0,
      };

      for (const [, doc] of documentsIndex) {
        stats[doc.category as keyof typeof stats]++;
      }

      logger.info('Server started successfully', {
        url: `http://${config.host}:${config.port}`,
        mcp_endpoint: `http://${config.host}:${config.port}/mcp`,
        health_endpoint: `http://${config.host}:${config.port}/health`,
        indexed_documents: {
          development: stats.development,
          porting: stats.porting,
          plugins: stats.plugins,
          total: stats.development + stats.porting + stats.plugins,
        },
      });
    });

    server.on('error', (error: any) => {
      logger.error('Server error', {
        error: error.message,
        code: error.code,
      });
      process.exit(1);
    });

    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      sessionManager.stopCleanup();

      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Start the application
main();
