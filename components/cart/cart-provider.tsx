"use client"

import * as React from "react"
import type { CartItem, Product } from "@/lib/types"
import { trackEvent } from "@/lib/track"

const STORAGE_KEY = "aleshop-cart-v1"

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  ready: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

function snapshot(product: Product, quantity: number): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
    quantity,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw) as CartItem[])
    } catch {
      // ignore corrupted storage
    }
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage may be unavailable (private mode); cart still works in-memory
    }
  }, [items, ready])

  const addItem = React.useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      const capped = Math.min(
        product.stock,
        (existing?.quantity ?? 0) + quantity,
      )
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.max(1, capped), stock: product.stock } : i,
        )
      }
      return [...prev, snapshot(product, Math.max(1, Math.min(product.stock, quantity)))]
    })
    trackEvent("add_to_cart", { productId: product.id, name: product.name })
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    trackEvent("remove_from_cart", { productId: id })
  }, [])

  const setQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i,
      ),
    )
  }, [])

  const clear = React.useCallback(() => setItems([]), [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    ready,
    addItem,
    removeItem,
    setQuantity,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
