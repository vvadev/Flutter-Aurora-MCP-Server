/**
 * Streamable HTTP transport setup for MCP server
 */

import { Router } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { sessionManager } from './session.js';
import { logger } from '../utils/logger.js';

/**
 * Create MCP transport router
 */
export function createMcpTransport(server: Server): Router {
  const router = Router();
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  router.post('/', async (req, res) => {
    try {
      const sessionId = req.get('Mcp-Session-Id');
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
        logger.debug('Reusing existing transport', { sessionId });
      } else {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => {
            const newSessionId = sessionManager.createSession();
            logger.info('New MCP session created', { sessionId: newSessionId });
            return newSessionId;
          },
          onsessioninitialized: (initializedSessionId: string) => {
            transports[initializedSessionId] = transport;
            logger.debug('Transport stored for session', { sessionId: initializedSessionId });
          },
        });

        await server.connect(transport);

        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) {
            delete transports[sid];
            sessionManager.deleteSession(sid);
            logger.info('Transport closed and cleaned up', { sessionId: sid });
          }
        };

        logger.debug('Created new transport for initialization');
      }

      // IMPORTANT: Pass req.body as third parameter when using express.json() middleware
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      logger.error('Error handling MCP POST request', {
        error: error instanceof Error ? error.message : String(error),
      });

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to process MCP request',
        });
      }
    }
  });

  router.get('/', async (req, res) => {
    try {
      const sessionId = req.get('Mcp-Session-Id');

      if (!sessionId || !transports[sessionId]) {
        logger.warn('GET request without valid session', { sessionId });
        res.status(400).json({
          error: 'Bad Request',
          message: 'Session ID required for SSE stream. Initialize session first with POST.',
        });
        return;
      }

      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    } catch (error) {
      logger.error('Error handling MCP GET request', {
        error: error instanceof Error ? error.message : String(error),
      });

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to open SSE stream',
        });
      }
    }
  });

  router.delete('/', async (req, res) => {
    try {
      const sessionId = req.get('Mcp-Session-Id');

      if (sessionId) {
        if (transports[sessionId]) {
          await transports[sessionId].close();
          delete transports[sessionId];
        }

        sessionManager.deleteSession(sessionId);
        logger.info('MCP session terminated', { sessionId });
      }

      res.status(200).json({
        message: 'Session terminated',
      });
    } catch (error) {
      logger.error('Error handling MCP DELETE request', {
        error: error instanceof Error ? error.message : String(error),
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to terminate session',
      });
    }
  });

  return router;
}
