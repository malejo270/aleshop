import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/lib/types"

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Categorías</h2>
          <p className="mt-1 text-sm text-muted-foreground">Encuentra justo lo que buscas</p>
        </div>
        <Link
          href="/productos"
          className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
        >
          Ver todo <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categoria/${c.slug}`}
            className="group flex flex-col items-start gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
          >
            <span className="grid size-12 place-items-center rounded-lg bg-muted text-2xl transition-colors group-hover:bg-brand/10">
              {c.emoji}
            </span>
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
