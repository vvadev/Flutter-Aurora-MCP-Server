import { z } from 'zod';

export const CategorySchema = z.enum(['development', 'porting', 'plugins'], {
  errorMap: () => ({ message: 'Category must be one of: development, porting, plugins' }),
});

export const ListDocumentsInputSchema = z
  .object({
    category: CategorySchema,
  })
  .strict();

export const GetDocumentInputSchema = z
  .object({
    category: CategorySchema,
    name: z
      .string()
      .min(1, 'Document name is required')
      .max(100, 'Document name must be 100 characters or less')
      .regex(
        /^[a-z0-9_-]+$/i,
        'Document name can only contain letters, numbers, hyphens, and underscores'
      ),
  })
  .strict();

export const SearchDocumentsInputSchema = z
  .object({
    query: z
      .string()
      .min(2, 'Search query must be at least 2 characters')
      .max(100, 'Search query must be 100 characters or less'),
    category: CategorySchema.optional(),
    use_semantic_search: z.boolean().optional(),
    min_relevance_score: z.number().min(0).max(1).optional(),
  })
  .strict();

export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;
export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;
export type SearchDocumentsInput = z.infer<typeof SearchDocumentsInputSchema>;
