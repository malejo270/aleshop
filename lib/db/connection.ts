import "server-only"

/**
 * Vercel/Neon may expose the connection under POSTGRES_* when the integration
 * is installed. DATABASE_URL remains the preferred explicit variable.
 */
export function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING

  if (!url) {
    throw new Error(
      "No se encontró una conexión PostgreSQL. Configura DATABASE_URL en Vercel o conecta Neon para crear POSTGRES_URL.",
    )
  }

  return url
}
