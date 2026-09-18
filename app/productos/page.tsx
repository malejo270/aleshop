import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Catalog } from "@/components/catalog"
import { getBrands, getCategories, getProducts } from "@/lib/data/store"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ])

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Todos los productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {q ? `Resultados para "${q}"` : "Explora nuestro catálogo completo"}
          </p>
        </div>
        <Catalog
          products={products}
          categories={categories}
          brands={brands}
          initialQuery={q ?? ""}
        />
      </main>
      <SiteFooter categories={categories} />
      <WhatsAppFloat />
    </>
  )
}
