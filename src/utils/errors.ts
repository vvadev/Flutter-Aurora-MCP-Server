/**
 * Error response utilities for MCP tools
 */

import { ErrorResponse } from '../types.js';

/**
 * Create a structured error response for MCP tools
 */
export function createErrorResponse(message: string): ErrorResponse {
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: message,
      },
    ],
  };
}

export const ErrorMessages = {
  documentNotFound: (category: string, name: string) =>
    `Error: Document '${name}' not found in category '${category}'. Use aurora_list_documents to see available documents.`,

  invalidCategory: (category: string) =>
    `Error: Invalid category '${category}'. Valid categories are: development, porting, plugins.`,

  invalidQuery: (query: string) =>
    `Error: Search query must be at least 2 characters long. Received: '${query}'.`,

  invalidDocumentName: (name: string) =>
    `Error: Invalid document name '${name}'. Document names must not contain path traversal characters (../, /, \\).`,

  fileReadError: (category: string, name: string, error: string) =>
    `Error: Failed to read document '${name}' in category '${category}'. ${error}`,

  indexingError: (error: string) =>
    `Error: Failed to build document index. ${error}`,
};
