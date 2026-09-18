import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"

export function ProductSection({
  title,
  subtitle,
  products,
  href,
  accent,
}: {
  title: string
  subtitle?: string
  products: Product[]
  href?: string
  accent?: boolean
}) {
  if (products.length === 0) return null

  return (
    <section className={accent ? "border-y border-border/60 bg-muted/30" : ""}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {href && (
            <Link
              href={href}
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              Ver todo <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
