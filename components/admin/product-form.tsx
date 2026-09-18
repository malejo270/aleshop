 "use client"

import * as React from "react"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { createProduct } from "@/app/admin/productos/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CategoryOption = { slug: string; name: string }

export function ProductForm({ categories }: { categories: CategoryOption[] }) {
  const [pending, setPending] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState("")
  const formRef = React.useRef<HTMLFormElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    try {
      const result = await createProduct(new FormData(e.currentTarget))
      toast.success(result.message)
      formRef.current?.reset()
      setImagePreview("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" placeholder="Ej. Audífonos Bluetooth Pro" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input id="price" name="price" type="number" min="0" step="100" placeholder="80000" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="previousPrice">Precio anterior</Label>
          <Input id="previousPrice" name="previousPrice" type="number" min="0" step="100" placeholder="100000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input id="stock" name="stock" type="number" min="0" step="1" defaultValue="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" placeholder="ALE-001" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" name="brand" placeholder="Ej. JBL" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categorySlug">Categoría *</Label>
          <select id="categorySlug" name="categorySlug" required className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            <option value="">Seleccionar...</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={4} placeholder="Describe el producto, beneficios y contenido." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Características</Label>
        <Textarea id="features" name="features" rows={4} placeholder={"Una característica por línea\nBluetooth 5.3\nBatería de larga duración"} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageFile">Imagen principal</Label>
        <Input
          id="imageFile"
          name="imageFile"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setImagePreview(URL.createObjectURL(file))
          }}
        />
        <p className="text-xs text-muted-foreground">Máximo 5 MB. Requiere BLOB_READ_WRITE_TOKEN.</p>
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagePreview} alt="Vista previa" className="mt-2 aspect-video max-h-48 w-full rounded-xl object-contain bg-muted" />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">O URL de imagen</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gallery">Galería (URLs, una por línea)</Label>
        <Textarea id="gallery" name="gallery" rows={3} placeholder="https://imagen-2.jpg&#10;https://imagen-3.jpg" />
      </div>

      <div className="grid gap-3 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-3">
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked /> Publicado</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" /> Destacado</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isNew" defaultChecked /> Nuevo ingreso</label>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {pending ? "Publicando..." : "Publicar producto"}
      </Button>
    </form>
  )
}
