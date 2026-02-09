import { Category } from '../types.js';
import { DocumentChunk } from '../types-rag.js';

/**
 * Split document into chunks with overlap
 * Considers markdown structure (## headers)
 */
export function chunkDocument(
  content: string,
  documentId: string,
  category: Category,
  chunkSize: number,
  overlap: number
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const lines = content.split('\n');

  let currentChunk: string[] = [];
  let currentHeader = documentId;
  let position = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect markdown headers (## Header)
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      currentHeader = headerMatch[1].trim();
    }

    currentChunk.push(line);

    // Check if chunk size reached
    const currentSize = currentChunk.join('\n').length;
    if (currentSize >= chunkSize) {
      chunks.push({
        id: `${documentId}_chunk_${position}`,
        content: currentChunk.join('\n'),
        documentId,
        category,
        position,
        header: currentHeader,
      });

      position++;

      // Create overlap for next chunk
      const overlapSize = Math.min(
        overlap,
        Math.floor(currentChunk.length / 2)
      );
      currentChunk = currentChunk.slice(-overlapSize);
    }
  }

  // Add remaining content as last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      id: `${documentId}_chunk_${position}`,
      content: currentChunk.join('\n'),
      documentId,
      category,
      position,
      header: currentHeader,
    });
  }

  return chunks;
}
