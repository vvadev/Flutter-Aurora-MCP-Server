/**
 * Tool registration and handlers for MCP server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DocumentIndex } from '../types.js';
import { config } from '../constants.js';
import { getAllPlugins } from './getAllPlugins.js';
import { listDocuments } from './listDocuments.js';
import { getDocument } from './getDocument.js';
import { searchDocuments } from './searchDocuments.js';
import { VectorStore } from '../rag/vectorStore.js';

/**
 * Register all tools with the MCP server
 */
export function registerTools(
  server: Server,
  documentsIndex: Map<string, DocumentIndex>,
  vectorStore?: VectorStore
): void {
  const toolDescriptions = [
    {
      name: 'aurora_list_documents',
      description:
        'List all documents in a category (development, porting, or plugins) with their descriptions. Use this to discover available documentation.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['development', 'porting', 'plugins'],
            description: 'The category of documents to list',
          },
        },
        required: ['category'],
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: 'aurora_get_document',
      description:
        'Get the full content of a specific document by category and name. Returns the complete markdown content of the document.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['development', 'porting', 'plugins'],
            description: 'The category of the document',
          },
          name: {
            type: 'string',
            description: 'The name of the document (without .md extension)',
          },
        },
        required: ['category', 'name'],
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: 'aurora_search_documents',
      description: config.enableRag
        ? 'Search for documents using hybrid keyword + semantic search. Keyword search matches names and descriptions. Semantic search uses embeddings for content-based matching. Use category to filter results. Set use_semantic_search=false to disable semantic search.'
        : 'Search for documents by keywords in names and descriptions. Optionally filter by category. Returns matching documents with match type indicated.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (minimum 2 characters)',
          },
          category: {
            type: 'string',
            enum: ['development', 'porting', 'plugins'],
            description: 'Optional: limit search to specific category',
          },
        },
        required: ['query'],
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: 'aurora_get_all_plugins',
      description:
        'Get a list of all available Flutter Aurora plugins with their descriptions. This is a convenience shortcut for listing all plugin documents.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
  ];

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDescriptions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'aurora_list_documents': {
          const result = listDocuments(args, documentsIndex);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'aurora_get_document': {
          const result = await getDocument(args, documentsIndex);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'aurora_search_documents': {
          const result = await searchDocuments(args, documentsIndex, vectorStore);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'aurora_get_all_plugins': {
          const result = getAllPlugins(documentsIndex);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                isError: true,
                content: [
                  {
                    type: 'text',
                    text: `Error executing tool: ${errorMsg}`,
                  },
                ],
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  });
}
