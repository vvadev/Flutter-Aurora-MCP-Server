/**
 * aurora_list_documents tool
 * List all documents in a category with descriptions
 */

import {
  DocumentIndex,
  ListDocumentsInput,
  ListDocumentsResponse,
  ToolResult,
} from '../types.js';
import { ListDocumentsInputSchema } from '../schemas/index.js';
import { createErrorResponse } from '../utils/errors.js';

/**
 * List all documents in a category
 */
export function listDocuments(
  input: unknown,
  documentsIndex: Map<string, DocumentIndex>
): ToolResult<ListDocumentsResponse> {
  // Validate input
  const parseResult = ListDocumentsInputSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.errors[0];
    return createErrorResponse(`Validation error: ${error.message}`);
  }

  const { category } = parseResult.data as ListDocumentsInput;

  // Filter index by category
  const documents: Array<{ name: string; description: string }> = [];

  for (const [, doc] of documentsIndex) {
    if (doc.category === category) {
      documents.push({
        name: doc.name,
        description: doc.description,
      });
    }
  }

  return {
    category,
    count: documents.length,
    documents,
  };
}
