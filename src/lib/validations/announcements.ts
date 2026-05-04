import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  type: z.enum(["INFO", "WARNING", "URGENT", "ADMISSION"]),
  isActive: z.boolean().default(true),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
