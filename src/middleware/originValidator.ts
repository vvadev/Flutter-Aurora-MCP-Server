/**
 * Origin validation middleware for DNS rebinding protection
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../constants.js';
import { isOriginAllowed } from '../utils/security.js';
import { logger } from '../utils/logger.js';

/**
 * Validate Origin header to prevent DNS rebinding attacks
 */
export function originValidator(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get('Origin');

  if (
    req.hostname === 'localhost' ||
    req.hostname === '127.0.0.1' ||
    req.hostname === '0.0.0.0' ||
    req.hostname === '::1'
  ) {
    next();
    return;
  }

  if (!isOriginAllowed(origin, config.allowedOrigins)) {
    logger.warn('Origin validation failed', {
      origin: origin || 'missing',
      allowedOrigins: config.allowedOrigins,
      hostname: req.hostname,
      ip: req.ip,
    });

    res.status(403).json({
      error: 'Forbidden',
      message: 'Origin not allowed',
    });
    return;
  }

  next();
}
