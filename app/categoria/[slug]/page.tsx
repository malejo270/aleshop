import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Catalog } from "@/components/catalog"
import {
  getBrands,
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/data/store"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [category, categories, products, brands] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProducts(),
    getBrands(),
  ])

  if (!category) notFound()

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-muted text-2xl" aria-hidden>
            {category.emoji}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{category.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <Catalog
          products={products}
          categories={categories}
          brands={brands}
          lockCategory={category.slug}
        />
      </main>
      <SiteFooter categories={categories} />
      <WhatsAppFloat />
    </>
  )
}
