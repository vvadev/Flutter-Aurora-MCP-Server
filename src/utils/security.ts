/**
 * Security utilities for path traversal protection
 */

/**
 * Sanitize document name to prevent path traversal attacks
 * Rejects names containing '../' or similar patterns
 */
export function sanitizeDocumentName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return null;
  }

  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return null;
  }

  if (name.startsWith('/') || /^[a-zA-Z]:/.test(name)) {
    return null;
  }

  if (name.includes('\0')) {
    return null;
  }

  return name.trim();
}

export function isOriginAllowed(origin: string | undefined, allowedOrigins: string): boolean {
  if (allowedOrigins === '*') {
    return true;
  }

  if (!origin) {
    return false;
  }

  const allowed = allowedOrigins.split(',').map(o => o.trim());
  return allowed.includes(origin);
}
