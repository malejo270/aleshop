import Link from "next/link"
import { ArrowRight, MessageCircle, ShieldCheck, Truck } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { storeConfig } from "@/lib/store-config"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-foreground text-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--color-brand) 0, transparent 45%), radial-gradient(circle at 80% 60%, var(--color-brand) 0, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand">
            <span className="size-1.5 rounded-full bg-brand" /> Nuevos ingresos cada semana
          </span>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Tecnología premium al alcance de un mensaje
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base text-background/70">
            Explora lámparas, dispositivos Apple, cámaras de seguridad y accesorios. Arma tu
            carrito y finaliza tu compra por WhatsApp, sin registros ni complicaciones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/productos"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
            >
              Explorar productos <ArrowRight className="size-4" />
            </Link>
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background",
              )}
            >
              <MessageCircle className="size-4" /> Escríbenos
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-background/70">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" /> Compra segura
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-brand" /> Envíos a todo el país
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4 text-brand" /> Atención por WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
