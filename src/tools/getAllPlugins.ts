/**
 * aurora_get_all_plugins tool
 * Shortcut for listing all plugin documents
 */

import { DocumentIndex, GetAllPluginsResponse, ToolResult } from '../types.js';

/**
 * Get all plugin documents
 * No parameters required
 */
export function getAllPlugins(
  documentsIndex: Map<string, DocumentIndex>
): ToolResult<GetAllPluginsResponse> {
  const plugins: Array<{ name: string; description: string }> = [];

  for (const [, doc] of documentsIndex) {
    if (doc.category === 'plugins') {
      plugins.push({
        name: doc.name,
        description: doc.description,
      });
    }
  }

  return {
    count: plugins.length,
    plugins,
  };
}
