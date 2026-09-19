"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { cartWhatsappLink } from "@/lib/whatsapp"
import { trackEvent } from "@/lib/track"
import type { CustomerInfo } from "@/lib/types"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const emptyCustomer: CustomerInfo = {
  name: "",
  city: "",
  address: "",
  phone: "",
  notes: "",
}

export function CartView() {
  const { items, subtotal, totalItems, setQuantity, removeItem, clear, ready } = useCart()
  const [customer, setCustomer] = React.useState<CustomerInfo>(emptyCustomer)

  function updateField(field: keyof CustomerInfo, value: string) {
    setCustomer((c) => ({ ...c, [field]: value }))
  }

  function handleCheckout() {
    const hasData = Object.values(customer).some((v) => v.trim() !== "")
    trackEvent("whatsapp_checkout", {
      items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
      total: subtotal,
    })
    const link = cartWhatsappLink(items, hasData ? customer : undefined)
    window.open(link, "_blank", "noopener,noreferrer")
  }

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Agrega productos para continuar con tu compra por WhatsApp.
        </p>
        <Link href="/productos" className={cn(buttonVariants(), "mt-6")}>
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Carrito{" "}
            <span className="text-base font-normal text-muted-foreground">
              ({totalItems} {totalItems === 1 ? "producto" : "productos"})
            </span>
          </h1>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
              <Trash2 className="size-4" />
              Vaciar
            </Button>
          )}
        </div>

        <ul className="divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4">
              <Link
                href={`/producto/${item.slug}`}
                className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted/40"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="line-clamp-2 text-sm font-medium hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)} c/u</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg ring-1 ring-foreground/15">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="grid size-8 place-items-center rounded-l-lg disabled:opacity-40"
                      aria-label="Disminuir"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="grid size-8 place-items-center rounded-r-lg disabled:opacity-40"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/productos"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          <ArrowLeft className="size-4" />
          Seguir comprando
        </Link>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <h2 className="text-sm font-semibold">Datos del cliente (opcional)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Se agregarán a tu mensaje de WhatsApp. No es necesario crear una cuenta.
          </p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Nombre</Label>
              <Input
                id="c-name"
                value={customer.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-city">Ciudad</Label>
                <Input
                  id="c-city"
                  value={customer.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Ciudad"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-phone">Teléfono</Label>
                <Input
                  id="c-phone"
                  value={customer.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Teléfono"
                  inputMode="tel"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-address">Dirección / barrio</Label>
              <Input
                id="c-address"
                value={customer.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Dirección de entrega"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-notes">Observaciones</Label>
              <Textarea
                id="c-notes"
                value={customer.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Ej: entregar después de las 5 PM"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Precio</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold">Total + domicilio</span>
            <span className="text-xl font-semibold">{formatPrice(subtotal)}</span>
          </div>

          <Button
            size="lg"
            className="mt-4 w-full bg-whatsapp text-white hover:bg-whatsapp/90"
            onClick={handleCheckout}
          >
            <MessageCircle className="size-5" />
            Comprar por WhatsApp
          </Button>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            El domicilio se consulta y se confirma por WhatsApp.
          </p>
        </div>
      </aside>
    </div>
  )
}
