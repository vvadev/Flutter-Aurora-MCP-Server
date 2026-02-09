import * as crypto from 'crypto';

/**
 * Compute SHA-256 hash of file content
 * Used for detecting file changes to avoid regenerating embeddings
 */
export function computeFileHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}
