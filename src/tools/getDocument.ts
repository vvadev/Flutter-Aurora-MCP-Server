/**
 * aurora_get_document tool
 * Get full content of a specific document
 */

import * as fs from 'fs/promises';
import {
  DocumentIndex,
  GetDocumentInput,
  GetDocumentResponse,
  ToolResult,
} from '../types.js';
import { GetDocumentInputSchema } from '../schemas/index.js';
import { createErrorResponse, ErrorMessages } from '../utils/errors.js';
import { sanitizeDocumentName } from '../utils/security.js';

/**
 * Get full content of a document
 */
export async function getDocument(
  input: unknown,
  documentsIndex: Map<string, DocumentIndex>
): Promise<ToolResult<GetDocumentResponse>> {
  const parseResult = GetDocumentInputSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.errors[0];
    return createErrorResponse(`Validation error: ${error.message}`);
  }

  const { category, name } = parseResult.data as GetDocumentInput;

  const sanitizedName = sanitizeDocumentName(name);
  if (!sanitizedName) {
    return createErrorResponse(ErrorMessages.invalidDocumentName(name));
  }

  const key = `${category}:${sanitizedName}`;
  const doc = documentsIndex.get(key);

  if (!doc) {
    return createErrorResponse(ErrorMessages.documentNotFound(category, sanitizedName));
  }

  try {
    const content = await fs.readFile(doc.filePath, 'utf-8');

    return {
      category: doc.category,
      name: doc.name,
      description: doc.description,
      content,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return createErrorResponse(ErrorMessages.fileReadError(category, sanitizedName, errorMsg));
  }
}
