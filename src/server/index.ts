/**
 * MCP server initialization and configuration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { DocumentIndex } from '../types.js';
import { registerTools } from '../tools/index.js';
import { logger } from '../utils/logger.js';
import { VectorStore } from '../rag/vectorStore.js';

/**
 * Create and configure MCP server
 */
export function createMcpServer(
  documentsIndex: Map<string, DocumentIndex>,
  vectorStore?: VectorStore
): Server {
  const server = new Server(
    {
      name: 'flutter-aurora-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  registerTools(server, documentsIndex, vectorStore);

  logger.info('MCP server initialized', {
    name: 'flutter-aurora-mcp-server',
    version: '1.0.0',
    tools: ['aurora_list_documents', 'aurora_get_document', 'aurora_search_documents', 'aurora_get_all_plugins'],
    ragEnabled: vectorStore !== undefined,
  });

  return server;
}
