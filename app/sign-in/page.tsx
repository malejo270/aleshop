 "use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"
import { toast } from "sonner"
import { signIn, signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = React.useState<"login" | "signup">("login")
  const [pending, setPending] = React.useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const data = new FormData(e.currentTarget)
    const email = String(data.get("email") ?? "")
    const password = String(data.get("password") ?? "")
    const name = String(data.get("name") ?? "")

    try {
      if (mode === "login") {
        const result = await signIn.email({ email, password })
        if (result.error) throw new Error(result.error.message || "No se pudo iniciar sesión.")
      } else {
        const result = await signUp.email({ email, password, name: name || email.split("@")[0] })
        if (result.error) throw new Error(result.error.message || "No se pudo crear la cuenta.")
      }
      toast.success(mode === "login" ? "Sesión iniciada." : "Cuenta creada.")
      router.push("/admin/productos")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocurrió un error.")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Volver a la tienda</Link>
          <div className="mt-6 grid size-12 place-items-center rounded-xl bg-foreground text-background"><LogIn className="size-5" /></div>
          <h1 className="mt-4 text-2xl font-semibold">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Entra para administrar los productos de AleShop." : "Crea la cuenta que usarás para administrar la tienda."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" name="name" autoComplete="name" required /></div>}
          <div className="space-y-2"><Label htmlFor="email">Correo</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required /></div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {pending ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </Button>
        </form>

        <button type="button" className="mt-5 w-full text-sm text-muted-foreground underline underline-offset-4" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "¿Todavía no tienes cuenta? Crear cuenta" : "Ya tengo una cuenta. Iniciar sesión"}
        </button>
      </div>
    </main>
  )
}
