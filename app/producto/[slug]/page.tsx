import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductDetail } from "@/components/product-detail"
import { ProductSection } from "@/components/home/product-section"
import {
  getCategories,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/data/store"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Producto no encontrado" }
  return {
    title: `${product.name} | AleShop Technology`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [categories, category, related] = await Promise.all([
    getCategories(),
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
  ])

  const relatedProducts = related.filter((p) => p.id !== product.id)

  return (
    <>
      <SiteHeader categories={categories} />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <ProductDetail product={product} category={category} />
        </div>
        <ProductSection
          title="También te puede interesar"
          products={relatedProducts}
          accent
        />
      </main>
      <SiteFooter categories={categories} />
      <WhatsAppFloat />
    </>
  )
}
