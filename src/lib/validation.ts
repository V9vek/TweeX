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

export const createPostSchema = z.object({
  content: requiredString,
});

export const udpateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be atmost 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof udpateUserProfileSchema>;
