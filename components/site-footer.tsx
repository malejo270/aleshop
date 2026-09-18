import Link from "next/link"
import { Cpu } from "lucide-react"
import type { Category } from "@/lib/types"
import { storeConfig } from "@/lib/store-config"

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-foreground text-background">
              <Cpu className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">AleShop</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
                Technology
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {storeConfig.tagline}. Explora, arma tu carrito y finaliza tu compra por WhatsApp,
            rápido y sin complicaciones.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Categorías</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.slug}`} className="transition-colors hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Tienda</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/productos" className="transition-colors hover:text-foreground">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="transition-colors hover:text-foreground">
                Mi carrito
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {storeConfig.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
