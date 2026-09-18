import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartView } from "@/components/cart/cart-view"
import { getCategories } from "@/lib/data/store"

export const metadata = {
  title: "Carrito | AleShop Technology",
}

export default async function CartPage() {
  const categories = await getCategories()

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CartView />
      </main>
      <SiteFooter categories={categories} />
    </>
  )
}
