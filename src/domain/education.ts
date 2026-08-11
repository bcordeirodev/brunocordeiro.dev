import { z } from "zod";

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
});

export type Education = z.infer<typeof educationSchema>;
