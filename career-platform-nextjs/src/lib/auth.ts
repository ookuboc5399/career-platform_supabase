import { getServerSession } from "next-auth";
import { authConfig } from "@/app/auth";

export async function isAdmin() {
  const session = await getServerSession(authConfig);
  return session?.user?.role === 'admin';
}

export async function getCurrentUser() {
  const session = await getServerSession(authConfig);
  return session?.user;
}
