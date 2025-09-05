import * as z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
