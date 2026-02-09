/**
 * Session validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { sessionManager } from '../server/session.js';
import { logger } from '../utils/logger.js';

/**
 * Validate session ID from Mcp-Session-Id header
 */
export function sessionValidator(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.get('Mcp-Session-Id');

  if (req.path === '/mcp') {
    if (req.method === 'POST' && !sessionId) {
      next();
      return;
    }

    if (sessionId) {
      const session = sessionManager.getSession(sessionId);

      if (!session) {
        logger.warn('Invalid or expired session', { sessionId, ip: req.ip });
        res.status(404).json({
          error: 'Session Not Found',
          message: 'Session expired or invalid. Please re-initialize the connection.',
        });
        return;
      }
    }
  }

  next();
}
