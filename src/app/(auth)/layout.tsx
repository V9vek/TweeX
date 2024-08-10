import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

// if I open auth pages "/login" or "/signup", it will check if the user is already logged in, then redirect it

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
}
