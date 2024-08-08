import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signupSchema = z.object({
  email: requiredString.email("Invalid email"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, _ and - allowed"
  ),
  password: requiredString.min(8, "Must be atleast 8 characters"),
});

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
