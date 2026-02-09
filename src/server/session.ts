/**
 * Session management for MCP connections
 */

import { randomUUID } from 'crypto';
import { Session } from '../types.js';
import { config, SESSION_CLEANUP_INTERVAL_MS } from '../constants.js';
import { logger } from '../utils/logger.js';

/**
 * Session Manager class
 * Manages in-memory sessions with TTL
 */
class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  createSession(): string {
    const id = randomUUID();
    const now = new Date();

    this.sessions.set(id, {
      id,
      createdAt: now,
      lastAccessedAt: now,
    });

    logger.debug('Session created', { sessionId: id });

    return id;
  }

  getSession(id: string): Session | null {
    const session = this.sessions.get(id);

    if (!session) {
      return null;
    }

    const now = Date.now();
    const lastAccessed = session.lastAccessedAt.getTime();
    const age = now - lastAccessed;

    if (age > config.sessionTtlMs) {
      this.sessions.delete(id);
      logger.debug('Session expired', { sessionId: id, age_ms: age });
      return null;
    }

    session.lastAccessedAt = new Date();

    return session;
  }

  deleteSession(id: string): void {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      logger.debug('Session deleted', { sessionId: id });
    }
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [id, session] of this.sessions) {
      const age = now - session.lastAccessedAt.getTime();
      if (age > config.sessionTtlMs) {
        this.sessions.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug('Expired sessions cleaned up', {
        cleaned: cleanedCount,
        remaining: this.sessions.size,
      });
    }
  }

  startCleanup(): void {
    if (this.cleanupInterval) {
      return;
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, SESSION_CLEANUP_INTERVAL_MS);

    logger.info('Session cleanup started', {
      interval_ms: SESSION_CLEANUP_INTERVAL_MS,
    });
  }

  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      logger.info('Session cleanup stopped');
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
