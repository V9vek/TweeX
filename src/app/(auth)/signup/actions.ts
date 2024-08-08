"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signupSchema, SignupValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server Action for Signing up the user

export async function signUp(
  credentials: SignupValues
): Promise<{ error: string }> {
  try {
    const { email, username, password } = signupSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return { error: "Username already taken" };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email already taken" };
    }

    // new user created and added in DB
    const userId = generateIdFromEntropySize(10);

    await prisma.user.create({
      data: {
        id: userId,
        username: username,
        displayName: username,
        email: email,
        passwordHash: passwordHash,
      },
    });

    // session for the new user created and added in DB
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return {
      error: "Something went wrong. Please Try Again",
    };
  }
}
