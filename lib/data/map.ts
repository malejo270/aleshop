import type { Category, Product } from "@/lib/types"
import type { categories, products } from "@/lib/db/schema"

type CategoryRow = typeof categories.$inferSelect
type ProductRow = typeof products.$inferSelect

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    emoji: row.emoji,
    description: row.description,
    image: row.image,
    active: row.active,
    order: row.order,
  }
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    features: row.features ?? [],
    price: row.price,
    previousPrice: row.previousPrice,
    categorySlug: row.categorySlug,
    brand: row.brand,
    stock: row.stock,
    sku: row.sku,
    active: row.active,
    featured: row.featured,
    isNew: row.isNew,
    image: row.image,
    gallery: row.gallery ?? [],
    createdAt:
      row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  }
}
