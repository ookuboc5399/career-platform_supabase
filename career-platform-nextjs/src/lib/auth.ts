import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
