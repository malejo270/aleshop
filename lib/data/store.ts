import "server-only"
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, products } from "@/lib/db/schema"
import type { Category, Product } from "@/lib/types"
import { ensureSeeded } from "./seed"
import { mapCategory, mapProduct } from "./map"

/**
 * Public data-access layer. Reads from Neon via Drizzle and only ever returns
 * ACTIVE catalog entries — the storefront never shows inactive products or
 * categories. Admin queries (which include inactive rows) live in ./admin.
 */

export async function getCategories(): Promise<Category[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(asc(categories.order), asc(categories.name))
  return rows.map(mapCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await ensureSeeded()
  const [row] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.active, true)))
    .limit(1)
  return row ? mapCategory(row) : null
}

export async function getProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureSeeded()
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1)
  return row ? mapProduct(row) : null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.categorySlug, categorySlug)))
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.featured, true)))
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export async function getNewProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.isNew, true)))
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export async function getOfferProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.active, true),
        isNotNull(products.previousPrice),
        sql`${products.previousPrice} > ${products.price}`,
      ),
    )
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export async function getBrands(): Promise<string[]> {
  await ensureSeeded()
  const rows = await db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .where(eq(products.active, true))
    .orderBy(asc(products.brand))
  return rows.map((r) => r.brand).filter((b) => b.trim() !== "")
}
