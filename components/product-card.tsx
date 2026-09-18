"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { type Product, discountPercent, stockStatus } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/components/cart/cart-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const stockLabel: Record<string, string> = {
  available: "Disponible",
  low: "Últimas unidades",
  out: "Agotado",
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const discount = discountPercent(product)
  const status = stockStatus(product.stock)
  const soldOut = status === "out"

  function handleAdd() {
    addItem(product, 1)
    toast.success("Agregado al carrito", { description: product.name })
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-black/5">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted/40">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-brand text-brand-foreground">Nuevo</Badge>}
          {discount > 0 && <Badge className="bg-destructive text-white">-{discount}%</Badge>}
        </div>
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[1px]">
            <span className="rounded-md bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background">
              Agotado
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link
          href={`/producto/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-brand"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          {product.previousPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        <p
          className={
            "mt-1 text-xs font-medium " +
            (status === "available"
              ? "text-whatsapp"
              : status === "low"
                ? "text-amber-600"
                : "text-muted-foreground")
          }
        >
          {stockLabel[status]}
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/producto/${product.slug}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
          >
            Ver producto
          </Link>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <ShoppingCart className="size-4" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  )
}
