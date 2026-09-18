"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cpu, Menu, Search, ShoppingCart, X, Settings } from "lucide-react"
import type { Category } from "@/lib/types"
import { useCart } from "@/components/cart/cart-provider"
import { storeConfig } from "@/lib/store-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SiteHeader({ categories }: { categories: Category[] }) {
  const { totalItems, ready } = useCart()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos")
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg text-foreground lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid size-9 place-items-center rounded-lg bg-foreground text-background">
            <Cpu className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight sm:text-base">AleShop</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
              Technology
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link
            href="/productos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos, marcas..."
              className="pl-9"
              aria-label="Buscar"
            />
          </div>
        </form>

        <Link href="/admin/productos" className="hidden md:inline-flex" aria-label="Administrar tienda">
          <Button variant="ghost" size="icon" title="Administrar tienda">
            <Settings className="size-4" />
          </Button>
        </Link>

        <Link href="/carrito" className="relative ml-auto md:ml-2" aria-label="Ver carrito">
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="size-5" />
            {ready && totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>

      <div
        className={cn(
          "border-t border-border/60 lg:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <div className="space-y-3 px-4 py-4 sm:px-6">
          <form onSubmit={onSearch}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos, marcas..."
                className="pl-9"
                aria-label="Buscar"
              />
            </div>
          </form>
          <nav className="grid gap-1">
            <Link
              href="/productos"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Todos los productos
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categoria/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <span aria-hidden>{c.emoji}</span>
                {c.name}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin/productos"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-sm text-muted-foreground"
          >
            Administrar tienda
          </Link>
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-muted-foreground"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
