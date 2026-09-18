import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Hero } from "@/components/home/hero"
import { CategoryStrip } from "@/components/home/category-strip"
import { ProductSection } from "@/components/home/product-section"
import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
  getOfferProducts,
  getProducts,
} from "@/lib/data/store"

export default async function HomePage() {
  const [categories, featured, newest, offers, all] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewProducts(),
    getOfferProducts(),
    getProducts(),
  ])

  return (
    <>
      <SiteHeader categories={categories} />
      <main>
        <Hero />
        <CategoryStrip categories={categories} />
        <ProductSection
          title="Productos destacados"
          subtitle="Lo mejor de nuestra selección"
          products={featured}
          href="/productos"
        />
        <ProductSection
          title="Ofertas"
          subtitle="Aprovecha antes de que se agoten"
          products={offers}
          href="/productos"
          accent
        />
        <ProductSection
          title="Nuevos ingresos"
          subtitle="Lo último en tecnología"
          products={newest}
          href="/productos"
        />
        <ProductSection
          title="Disponibles ahora"
          subtitle="Todo nuestro catálogo"
          products={all}
          href="/productos"
          accent
        />
      </main>
      <SiteFooter categories={categories} />
      <WhatsAppFloat />
    </>
  )
}
