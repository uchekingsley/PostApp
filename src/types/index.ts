import { z } from 'zod';

export const CategorySchema = z.enum(['Engineering', 'Design', 'Product', 'General']);
export type Category = z.infer<typeof CategorySchema>;

export const CategoryFilterSchema = z.enum(['All', 'Engineering', 'Design', 'Product', 'Pinned']);
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>;

export const PostSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title cannot be empty'),
  body: z.string().min(1, 'Body cannot be empty'),
  category: CategorySchema.optional(),
  readTime: z.string().optional(),
  likesCount: z.number().int().nonnegative().optional(),
});
export type Post = z.infer<typeof PostSchema>;

export const CreatePostInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  body: z
    .string()
    .trim()
    .min(15, 'Body must be at least 15 characters')
    .max(2000, 'Body cannot exceed 2000 characters'),
  category: CategorySchema,
});
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const CommentSchema = z.object({
  postId: z.number().int().positive(),
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
});
export type Comment = z.infer<typeof CommentSchema>;
