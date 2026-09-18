import { pgTable, text, timestamp, boolean, integer, serial, jsonb } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------
// The store is admin-managed (single owner), so these tables are not scoped
// per user. Admin-only mutations are enforced by requiring a valid session in
// every server action / API route that writes to them.

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image"),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  price: integer("price").notNull().default(0),
  previousPrice: integer("previousPrice"),
  categorySlug: text("categorySlug").notNull(),
  brand: text("brand").notNull().default(""),
  stock: integer("stock").notNull().default(0),
  sku: text("sku").notNull().default(""),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("isNew").notNull().default(false),
  image: text("image").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Single-row table (id is always 1) holding editable store-wide settings.
export const storeConfig = pgTable("store_config", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull().default("AleShop Technology"),
  tagline: text("tagline").notNull().default(""),
  whatsappNumber: text("whatsappNumber").notNull().default(""),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Interaction tracking: add/remove from cart, WhatsApp checkout clicks, etc.
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  productId: text("productId"),
  productName: text("productName"),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
