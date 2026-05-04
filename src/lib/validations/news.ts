import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  author: z.string().optional(),
  publishedAt: z.string().min(1, "Published date is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type NewsFormData = z.infer<typeof newsSchema>;
