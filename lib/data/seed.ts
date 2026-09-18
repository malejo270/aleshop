import "server-only"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { ensureDatabase } from "@/lib/db/init"
import { categories, products, storeConfig } from "@/lib/db/schema"
import { sampleCategories, sampleProducts } from "./sample-data"

let seedPromise: Promise<void> | null = null

/**
 * Idempotently seeds the database on first access so the storefront has content
 * out of the box. Inserts sample categories/products only when the tables are
 * empty, and ensures the single store_config row exists. Runs at most once per
 * server instance.
 */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      // Reset so a transient failure can be retried on the next request.
      seedPromise = null
      throw error
    })
  }
  return seedPromise
}

async function runSeed(): Promise<void> {
  await ensureDatabase()
  const [categoryCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories)

  if ((categoryCount?.count ?? 0) === 0) {
    await db.insert(categories).values(
      sampleCategories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        emoji: c.emoji,
        description: c.description,
        image: c.image,
        active: c.active,
        order: c.order,
      })),
    )
  }

  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)

  if ((productCount?.count ?? 0) === 0) {
    await db.insert(products).values(
      sampleProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        features: p.features,
        price: p.price,
        previousPrice: p.previousPrice,
        categorySlug: p.categorySlug,
        brand: p.brand,
        stock: p.stock,
        sku: p.sku,
        active: p.active,
        featured: p.featured,
        isNew: p.isNew,
        image: p.image,
        gallery: p.gallery,
        createdAt: new Date(p.createdAt),
      })),
    )
  }

  await db
    .insert(storeConfig)
    .values({
      id: 1,
      name: "AleShop Technology",
      tagline: "Tecnología premium al alcance de un mensaje",
      whatsappNumber: "573176046454",
    })
    .onConflictDoNothing({ target: storeConfig.id })
}
