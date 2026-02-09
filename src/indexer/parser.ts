/**
 * Parser for extracting description from markdown files
 */

/**
 * Extract description from <description> tags in markdown content
 * Returns null if no description tag found
 */
export function extractDescription(content: string): string | null {
  const descriptionRegex = /<description>\s*([\s\S]*?)\s*<\/description>/;
  const match = content.match(descriptionRegex);

  if (!match || !match[1]) {
    return null;
  }

  return match[1].trim();
}
