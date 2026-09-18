"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"
import { type Category, type Product, discountPercent } from "@/lib/types"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type SortKey = "recent" | "price-asc" | "price-desc" | "featured" | "offers"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "featured", label: "Destacados" },
  { value: "offers", label: "Ofertas" },
]

export function Catalog({
  products,
  categories,
  brands,
  initialQuery = "",
  lockCategory,
}: {
  products: Product[]
  categories: Category[]
  brands: string[]
  initialQuery?: string
  lockCategory?: string
}) {
  const [query, setQuery] = React.useState(initialQuery)
  const [category, setCategory] = React.useState<string>(lockCategory ?? "all")
  const [brand, setBrand] = React.useState<string>("all")
  const [onlyAvailable, setOnlyAvailable] = React.useState(false)
  const [maxPrice, setMaxPrice] = React.useState<number>(0)
  const [sort, setSort] = React.useState<SortKey>("recent")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  React.useEffect(() => setQuery(initialQuery), [initialQuery])

  const priceCeiling = React.useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products],
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = products.filter((p) => {
      if (lockCategory && p.categorySlug !== lockCategory) return false
      if (category !== "all" && p.categorySlug !== category) return false
      if (brand !== "all" && p.brand !== brand) return false
      if (onlyAvailable && p.stock <= 0) return false
      if (maxPrice > 0 && p.price > maxPrice) return false
      if (q) {
        const haystack = `${p.name} ${p.brand} ${p.sku} ${p.categorySlug}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    const sorted = [...result]
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "featured":
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
      case "offers":
        sorted.sort((a, b) => discountPercent(b) - discountPercent(a))
        break
      default:
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
    return sorted
  }, [products, query, category, brand, onlyAvailable, maxPrice, sort, lockCategory])

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside
        className={cn(
          "space-y-6 lg:block",
          filtersOpen ? "block" : "hidden",
        )}
      >
        <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <h2 className="text-sm font-semibold">Filtros</h2>

          {!lockCategory && (
            <div className="mt-4 space-y-2">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <Label>Marca</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="max-price">
              Precio máximo{maxPrice > 0 ? `: ${maxPrice.toLocaleString("es-CO")}` : ""}
            </Label>
            <input
              id="max-price"
              type="range"
              min={0}
              max={priceCeiling}
              step={Math.max(1000, Math.round(priceCeiling / 100))}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <Checkbox
              checked={onlyAvailable}
              onCheckedChange={(v) => setOnlyAvailable(Boolean(v))}
            />
            Solo disponibles
          </label>
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </Button>
          <p className="text-sm text-muted-foreground">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="ml-auto w-full sm:w-56">
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductGrid products={filtered} />
      </div>
    </div>
  )
}
