import { z } from "zod";
import { emailSchema, otpSchema } from "@/schemas/LoginSchema";

// This schema validates an email address.
export type EmailSchemaType = z.infer<typeof emailSchema>;
export type OtpSchemaType = z.infer<typeof otpSchema>;
