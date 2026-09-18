import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No se encontraron productos.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
