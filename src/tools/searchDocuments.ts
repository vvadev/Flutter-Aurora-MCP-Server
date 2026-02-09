/**
 * aurora_search_documents tool
 * Search by keywords in document names and descriptions
 * Optionally uses semantic search with embeddings if RAG is enabled
 */

import {
  DocumentIndex,
  SearchDocumentsInput,
  SearchDocumentsResponse,
  ToolResult,
} from '../types.js';
import { SearchDocumentsInputSchema } from '../schemas/index.js';
import { createErrorResponse } from '../utils/errors.js';
import { config } from '../constants.js';
import { VectorStore } from '../rag/vectorStore.js';
import { getEmbeddingsClient } from '../rag/embeddings.js';

/**
 * Search documents by query in names and descriptions
 * If RAG is enabled, performs hybrid keyword + semantic search
 */
export async function searchDocuments(
  input: unknown,
  documentsIndex: Map<string, DocumentIndex>,
  vectorStore?: VectorStore
): Promise<ToolResult<SearchDocumentsResponse>> {
  const parseResult = SearchDocumentsInputSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.errors[0];
    return createErrorResponse(`Validation error: ${error.message}`);
  }

  const { query, category, use_semantic_search, min_relevance_score } =
    parseResult.data as SearchDocumentsInput & {
      use_semantic_search?: boolean;
      min_relevance_score?: number;
    };

  const lowerQuery = query.toLowerCase();
  const shouldUseSemantic =
    config.enableRag &&
    use_semantic_search !== false &&
    vectorStore !== undefined;

  // Keyword search (always performed)
  const keywordResults = new Map<
    string,
    {
      category: DocumentIndex['category'];
      name: string;
      description: string;
      match_type: 'name' | 'description';
      keyword_score: number;
    }
  >();

  for (const [, doc] of documentsIndex) {
    if (category && doc.category !== category) {
      continue;
    }

    const lowerName = doc.name.toLowerCase();
    const lowerDescription = doc.description.toLowerCase();

    const matchesName = lowerName.includes(lowerQuery);
    const matchesDescription = lowerDescription.includes(lowerQuery);

    if (matchesName || matchesDescription) {
      const key = `${doc.category}:${doc.name}`;
      keywordResults.set(key, {
        category: doc.category,
        name: doc.name,
        description: doc.description,
        match_type: matchesName ? 'name' : 'description',
        keyword_score: 1,
      });
    }
  }

  // Semantic search (only if RAG enabled and requested)
  const semanticResults = new Map<
    string,
    {
      category: DocumentIndex['category'];
      name: string;
      description: string;
      semantic_score: number;
    }
  >();

  if (shouldUseSemantic) {
    try {
      const embeddingsClient = getEmbeddingsClient();
      if (embeddingsClient.isInitialized()) {
        const queryEmbedding = await embeddingsClient.generateQueryEmbedding(query);
        const topK = config.ragTopKResults;
        const searchResults = vectorStore.similaritySearch(
          queryEmbedding,
          topK,
          category
        );

        for (const { chunk, score } of searchResults) {
          const key = `${chunk.category}:${chunk.documentId}`;
          const doc = documentsIndex.get(key);
          if (doc && score >= (min_relevance_score || 0)) {
            semanticResults.set(key, {
              category: chunk.category,
              name: chunk.documentId,
              description: doc.description,
              semantic_score: score,
            });
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the entire search
      console.error('Semantic search failed:', error);
    }
  }

  // Hybrid ranking
  const finalResults = new Map<
    string,
    {
      category: DocumentIndex['category'];
      name: string;
      description: string;
      relevance_score: number;
      match_types: ('name' | 'description' | 'semantic')[];
    }
  >();

  // Process keyword results
  for (const [key, result] of keywordResults.entries()) {
    const existing = finalResults.get(key);
    const keywordWeight = 1 - config.ragHybridAlpha;
    const score = result.keyword_score * keywordWeight;

    if (existing) {
      existing.relevance_score += score;
      existing.match_types.push(result.match_type);
    } else {
      finalResults.set(key, {
        category: result.category,
        name: result.name,
        description: result.description,
        relevance_score: score,
        match_types: [result.match_type],
      });
    }
  }

  // Process semantic results
  for (const [key, result] of semanticResults.entries()) {
    const existing = finalResults.get(key);
    const semanticWeight = config.ragHybridAlpha;
    const score = result.semantic_score * semanticWeight;

    if (existing) {
      existing.relevance_score += score;
      existing.match_types.push('semantic');
    } else {
      finalResults.set(key, {
        category: result.category,
        name: result.name,
        description: result.description,
        relevance_score: score,
        match_types: ['semantic'],
      });
    }
  }

  // Filter by min relevance score
  const filteredResults = Array.from(finalResults.values()).filter(
    (r) => r.relevance_score >= (min_relevance_score || 0)
  );

  // Sort by relevance score (descending)
  filteredResults.sort((a, b) => b.relevance_score - a.relevance_score);

  // Convert to response format
  const results = filteredResults.map((r) => {
    let match_type: 'name' | 'description' | ('name' | 'description' | 'semantic')[];
    
    if (r.match_types.length === 1) {
      const single = r.match_types[0];
      if (single === 'semantic') {
        match_type = 'description';
      } else {
        match_type = single;
      }
    } else if (r.match_types.includes('semantic')) {
      match_type = r.match_types.filter(m => m !== 'semantic') as ('name' | 'description')[];
    } else {
      match_type = r.match_types;
    }

    return {
      category: r.category,
      name: r.name,
      description: r.description,
      match_type: match_type,
      relevance_score: r.relevance_score,
    };
  });

  return {
    query,
    count: results.length,
    results,
  };
}
