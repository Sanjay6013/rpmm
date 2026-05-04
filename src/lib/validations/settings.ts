import { z } from "zod";

export const settingsSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolFullName: z.string().min(1, "Full name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  officeHours: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
