import { z } from "zod";

export const albumSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  category: z.enum(["EVENTS", "CAMPUS", "SPORTS", "ACADEMICS", "CULTURAL", "GENERAL"]),
  isPublished: z.boolean().default(false),
});

export type AlbumFormData = z.infer<typeof albumSchema>;
