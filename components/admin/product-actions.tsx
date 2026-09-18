 "use client"

import * as React from "react"
import { Check, Loader2, Pencil, Power, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { deleteProduct, toggleProduct, updateProduct } from "@/app/admin/productos/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CategoryOption = { slug: string; name: string }
type Product = {
  id: string; slug: string; name: string; description: string; features: string[]
  price: number; previousPrice: number | null; categorySlug: string; brand: string
  stock: number; sku: string; active: boolean; featured: boolean; isNew: boolean
  image: string; gallery: string[]
}

export function ProductActions({ product, categories }: { product: Product; categories: CategoryOption[] }) {
  const [editing, setEditing] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function run(action: () => Promise<{ ok: boolean }>, success: string) {
    setPending(true)
    try {
      await action()
      toast.success(success)
      setEditing(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo completar la acción.")
    } finally {
      setPending(false)
    }
  }

  if (editing) {
    return (
      <form
        className="w-full space-y-4 rounded-xl bg-muted/50 p-4"
        onSubmit={(e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          run(() => updateProduct(form), "Producto actualizado.")
        }}
      >
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2"><Label>Nombre</Label><Input name="name" defaultValue={product.name} required /></div>
          <div className="space-y-1.5"><Label>Precio</Label><Input name="price" type="number" min="0" defaultValue={product.price} required /></div>
          <div className="space-y-1.5"><Label>Precio anterior</Label><Input name="previousPrice" type="number" min="0" defaultValue={product.previousPrice ?? ""} /></div>
          <div className="space-y-1.5"><Label>Stock</Label><Input name="stock" type="number" min="0" defaultValue={product.stock} required /></div>
          <div className="space-y-1.5"><Label>SKU</Label><Input name="sku" defaultValue={product.sku} /></div>
          <div className="space-y-1.5"><Label>Marca</Label><Input name="brand" defaultValue={product.brand} /></div>
          <div className="space-y-1.5"><Label>Categoría</Label><select name="categorySlug" defaultValue={product.categorySlug} className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm" required>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Descripción</Label><Textarea name="description" rows={3} defaultValue={product.description} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Características</Label><Textarea name="features" rows={3} defaultValue={product.features.join("\n")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Imagen / URL nueva</Label><Input name="imageUrl" type="url" defaultValue={product.image} placeholder="https://..." /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Subir imagen nueva</Label><Input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Galería</Label><Textarea name="gallery" rows={2} defaultValue={product.gallery.filter(u => u !== product.image).join("\n")} /></div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={product.active} /> Publicado</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={product.featured} /> Destacado</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isNew" defaultChecked={product.isNew} /> Nuevo</label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}Guardar</Button>
          <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={pending}><X className="size-4" />Cancelar</Button>
        </div>
      </form>
    )
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setEditing(true)} title="Editar"><Pencil className="size-4" /></Button>
      <Button size="sm" variant="outline" onClick={() => run(() => toggleProduct(product.id, !product.active), product.active ? "Producto ocultado." : "Producto publicado.")} disabled={pending} title={product.active ? "Ocultar" : "Publicar"}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Power className="size-4" />}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => { if (window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) run(() => deleteProduct(product.id), "Producto eliminado.") }} disabled={pending} title="Eliminar">
        <Trash2 className="size-4" />
      </Button>
    </>
  )
}
