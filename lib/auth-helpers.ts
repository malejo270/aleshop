import "server-only"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ensureDatabase } from "@/lib/db/init"

/** Returns the current session or null. Safe to call from any server context. */
export async function getSession() {
  await ensureDatabase()
  return auth.api.getSession({ headers: await headers() })
}

/**
 * Guard for admin-only server contexts (pages, actions, route handlers).
 * The store has a single admin owner, so any authenticated user is the admin.
 * Redirects to sign-in when there is no session.
 */
export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    redirect("/")
  }
  return session.user
}

/** Like requireAdmin but throws instead of redirecting — for API routes / actions. */
export async function assertAdmin() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    throw new Error("No tienes permisos de administrador.")
  }
  return session.user
}
