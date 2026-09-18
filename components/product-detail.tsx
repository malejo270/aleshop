"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Minus, MessageCircle, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { type Category, type Product, discountPercent, stockStatus } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/components/cart/cart-provider"
import { productWhatsappLink } from "@/lib/whatsapp"
import { trackEvent } from "@/lib/track"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stockLabel: Record<string, string> = {
  available: "Producto disponible",
  low: "Últimas unidades",
  out: "Agotado",
}

export function ProductDetail({
  product,
  category,
}: {
  product: Product
  category: Category | null
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = React.useState(1)
  const [activeImage, setActiveImage] = React.useState(product.image)

  const discount = discountPercent(product)
  const status = stockStatus(product.stock)
  const soldOut = status === "out"
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image]

  function changeQty(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)))
  }

  function handleAdd() {
    addItem(product, quantity)
    toast.success("Agregado al carrito", {
      description: `${quantity} × ${product.name}`,
    })
  }

  function handleBuyNow() {
    trackEvent("whatsapp_product", { productId: product.id, quantity })
    window.open(productWhatsappLink(product, quantity), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-foreground/10">
          <Image
            src={activeImage || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute left-3 top-3 bg-destructive text-white">-{discount}%</Badge>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex gap-3">
            {gallery.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={
                  "relative size-20 overflow-hidden rounded-lg bg-muted/40 ring-2 transition-colors " +
                  (activeImage === img ? "ring-brand" : "ring-transparent hover:ring-border")
                }
                aria-label="Ver imagen"
              >
                <Image src={img || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {category && (
            <Link href={`/categoria/${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          )}
          <span>•</span>
          <span>{product.brand}</span>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
          {product.previousPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        <p
          className={
            "mt-2 text-sm font-medium " +
            (status === "available"
              ? "text-whatsapp"
              : status === "low"
                ? "text-amber-600"
                : "text-muted-foreground")
          }
        >
          {stockLabel[status]}
          {!soldOut && ` · ${product.stock} en stock`}
        </p>

        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {product.features.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Características</h2>
            <ul className="mt-3 grid gap-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-lg ring-1 ring-foreground/15">
            <button
              type="button"
              onClick={() => changeQty(-1)}
              disabled={soldOut || quantity <= 1}
              className="grid size-10 place-items-center rounded-l-lg text-foreground disabled:opacity-40"
              aria-label="Disminuir cantidad"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => changeQty(1)}
              disabled={soldOut || quantity >= product.stock}
              className="grid size-10 place-items-center rounded-r-lg text-foreground disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {soldOut ? "Sin unidades disponibles" : `Máximo ${product.stock}`}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" onClick={handleAdd} disabled={soldOut}>
            <ShoppingCart className="size-5" />
            Agregar al carrito
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-whatsapp text-white hover:bg-whatsapp/90"
            onClick={handleBuyNow}
            disabled={soldOut}
          >
            <MessageCircle className="size-5" />
            Comprar ahora por WhatsApp
          </Button>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-sm">
          <div>
            <dt className="text-muted-foreground">SKU</dt>
            <dd className="font-medium">{product.sku}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Marca</dt>
            <dd className="font-medium">{product.brand}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
