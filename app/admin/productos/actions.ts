 "use server"

import { randomUUID } from "crypto"
import { put } from "@vercel/blob"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { assertAdmin } from "@/lib/auth-helpers"

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function integer(formData: FormData, key: string, fallback = 0) {
  const value = Number.parseInt(text(formData, key), 10)
  return Number.isFinite(value) ? value : fallback
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function featuresFrom(formData: FormData) {
  return text(formData, "features")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function galleryFrom(formData: FormData, image: string) {
  const urls = text(formData, "gallery")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
  return Array.from(new Set([image, ...urls].filter(Boolean)))
}

async function uploadImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return ""
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.")
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no puede superar 5 MB.")
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN para subir imágenes. También puedes usar una URL de imagen.")
  }
  const blob = await put(`products/${Date.now()}-${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`, file, {
    access: "public",
  })
  return blob.url
}

function validate(formData: FormData) {
  const name = text(formData, "name")
  const price = integer(formData, "price")
  const categorySlug = text(formData, "categorySlug")
  if (!name) throw new Error("Escribe el nombre del producto.")
  if (price < 0) throw new Error("El precio no puede ser negativo.")
  if (!categorySlug) throw new Error("Selecciona una categoría.")
  return { name, price, categorySlug }
}

export async function createProduct(formData: FormData) {
  await assertAdmin()
  const { name, price, categorySlug } = validate(formData)
  const imageUrl = (await uploadImage(formData.get("imageFile"))) || text(formData, "imageUrl")
  if (!imageUrl) throw new Error("Agrega una imagen o una URL de imagen.")

  const baseSlug = slugify(text(formData, "slug") || name) || `producto-${Date.now()}`
  let slug = baseSlug
  let suffix = 2
  while ((await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1)).length) {
    slug = `${baseSlug}-${suffix++}`
  }

  await db.insert(products).values({
    id: randomUUID(),
    slug,
    name,
    description: text(formData, "description"),
    features: featuresFrom(formData),
    price,
    previousPrice: integer(formData, "previousPrice", 0) || null,
    categorySlug,
    brand: text(formData, "brand"),
    stock: Math.max(0, integer(formData, "stock")),
    sku: text(formData, "sku"),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    isNew: formData.get("isNew") === "on",
    image: imageUrl,
    gallery: galleryFrom(formData, imageUrl),
  })

  revalidatePath("/", "layout")
  return { ok: true, message: "Producto publicado correctamente." }
}

export async function updateProduct(formData: FormData) {
  await assertAdmin()
  const id = text(formData, "id")
  if (!id) throw new Error("Producto inválido.")
  const { name, price, categorySlug } = validate(formData)
  const current = await db.select().from(products).where(eq(products.id, id)).limit(1)
  if (!current[0]) throw new Error("No se encontró el producto.")

  const uploaded = await uploadImage(formData.get("imageFile"))
  const imageUrl = uploaded || text(formData, "imageUrl") || current[0].image
  const baseSlug = slugify(text(formData, "slug") || name) || current[0].slug
  let slug = baseSlug
  let suffix = 2
  while (true) {
    const conflict = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1)
    if (!conflict[0] || conflict[0].id === id) break
    slug = `${baseSlug}-${suffix++}`
  }

  await db.update(products).set({
    slug,
    name,
    description: text(formData, "description"),
    features: featuresFrom(formData),
    price,
    previousPrice: integer(formData, "previousPrice", 0) || null,
    categorySlug,
    brand: text(formData, "brand"),
    stock: Math.max(0, integer(formData, "stock")),
    sku: text(formData, "sku"),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    isNew: formData.get("isNew") === "on",
    image: imageUrl,
    gallery: galleryFrom(formData, imageUrl),
  }).where(eq(products.id, id))

  revalidatePath("/", "layout")
  return { ok: true, message: "Producto actualizado correctamente." }
}

export async function toggleProduct(id: string, active: boolean) {
  await assertAdmin()
  await db.update(products).set({ active }).where(eq(products.id, id))
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function deleteProduct(id: string) {
  await assertAdmin()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/", "layout")
  return { ok: true }
}
