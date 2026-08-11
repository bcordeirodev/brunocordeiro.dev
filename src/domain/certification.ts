import { z } from "zod";

export const certificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  issued: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  expires: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .nullable(),
  credentialUrl: z.string().url().nullable(),
});

export type Certification = z.infer<typeof certificationSchema>;
