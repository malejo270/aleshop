import Link from "next/link"
import { desc, eq } from "drizzle-orm"
import { PackagePlus, Pencil, Power, Store, ExternalLink } from "lucide-react"
import { db } from "@/lib/db"
import { categories, products } from "@/lib/db/schema"
import { ensureSeeded } from "@/lib/data/seed"
import { ProductForm } from "@/components/admin/product-form"
import { ProductActions } from "@/components/admin/product-actions"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  await ensureSeeded()
  const [categoryRows, productRows] = await Promise.all([
    db.select().from(categories).where(eq(categories.active, true)).orderBy(categories.order, categories.name),
    db.select().from(products).orderBy(desc(products.createdAt)),
  ])

  const productData = productRows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    features: p.features ?? [],
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
    gallery: p.gallery ?? [],
  }))

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-background p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-foreground text-background">
              <PackagePlus className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand">AleShop Technology</p>
              <h1 className="text-2xl font-semibold tracking-tight">Administrador de productos</h1>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <Store className="size-4" />
                Ver tienda
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <section className="rounded-2xl bg-background p-5 ring-1 ring-foreground/10 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Subir producto</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Completa los datos y publica el producto directamente en la tienda.
              </p>
            </div>
            <ProductForm categories={categoryRows.map((c) => ({ slug: c.slug, name: c.name }))} />
          </section>

          <section className="rounded-2xl bg-background p-5 ring-1 ring-foreground/10 sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Catálogo</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {productRows.length} producto{productRows.length === 1 ? "" : "s"} registrados.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {productData.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Todavía no hay productos.
                </div>
              ) : (
                productData.map((product) => (
                  <article key={product.id} className="rounded-xl border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image} alt="" className="size-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{product.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${product.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                            {product.active ? "Publicado" : "Oculto"}
                          </span>
                          {product.featured && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">Destacado</span>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {product.sku || "Sin SKU"} · {product.stock} en stock
                        </p>
                        <p className="mt-1 font-semibold">${product.price.toLocaleString("es-CO")}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:self-start">
                        <ProductActions product={product} categories={categoryRows.map((c) => ({ slug: c.slug, name: c.name }))} />
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
