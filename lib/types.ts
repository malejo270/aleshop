export type Category = {
  id: string
  slug: string
  name: string
  emoji: string
  description: string
  image: string | null
  active: boolean
  order: number
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  features: string[]
  price: number
  previousPrice: number | null
  categorySlug: string
  brand: string
  stock: number
  sku: string
  active: boolean
  featured: boolean
  isNew: boolean
  image: string
  gallery: string[]
  createdAt: string
}

/** Snapshot stored in the guest cart so it works without any backend. */
export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

export type CustomerInfo = {
  name: string
  city: string
  address: string
  phone: string
  notes: string
}

export function discountPercent(product: Pick<Product, "price" | "previousPrice">): number {
  if (!product.previousPrice || product.previousPrice <= product.price) return 0
  return Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
}

export type StockStatus = "available" | "low" | "out"

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out"
  if (stock <= 5) return "low"
  return "available"
}
