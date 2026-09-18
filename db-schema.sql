-- AleShop Technology - PostgreSQL/Neon schema
-- The application also creates this schema automatically on first request.
-- Run this file in Neon SQL Editor if you prefer to initialize manually.

CREATE TABLE IF NOT EXISTS "user" ("id" text PRIMARY KEY,"name" text NOT NULL,"email" text NOT NULL UNIQUE,"emailVerified" boolean NOT NULL DEFAULT false,"image" text,"createdAt" timestamp NOT NULL DEFAULT now(),"updatedAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "session" ("id" text PRIMARY KEY,"expiresAt" timestamp NOT NULL,"token" text NOT NULL UNIQUE,"createdAt" timestamp NOT NULL DEFAULT now(),"updatedAt" timestamp NOT NULL DEFAULT now(),"ipAddress" text,"userAgent" text,"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS "account" ("id" text PRIMARY KEY,"accountId" text NOT NULL,"providerId" text NOT NULL,"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,"accessToken" text,"refreshToken" text,"idToken" text,"accessTokenExpiresAt" timestamp,"refreshTokenExpiresAt" timestamp,"scope" text,"password" text,"createdAt" timestamp NOT NULL DEFAULT now(),"updatedAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "verification" ("id" text PRIMARY KEY,"identifier" text NOT NULL,"value" text NOT NULL,"expiresAt" timestamp NOT NULL,"createdAt" timestamp DEFAULT now(),"updatedAt" timestamp DEFAULT now());
CREATE TABLE IF NOT EXISTS "categories" ("id" text PRIMARY KEY,"slug" text NOT NULL UNIQUE,"name" text NOT NULL,"emoji" text NOT NULL DEFAULT '',"description" text NOT NULL DEFAULT '',"image" text,"active" boolean NOT NULL DEFAULT true,"order" integer NOT NULL DEFAULT 0,"createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "products" ("id" text PRIMARY KEY,"slug" text NOT NULL UNIQUE,"name" text NOT NULL,"description" text NOT NULL DEFAULT '',"features" jsonb NOT NULL DEFAULT '[]'::jsonb,"price" integer NOT NULL DEFAULT 0,"previousPrice" integer,"categorySlug" text NOT NULL,"brand" text NOT NULL DEFAULT '',"stock" integer NOT NULL DEFAULT 0,"sku" text NOT NULL DEFAULT '',"active" boolean NOT NULL DEFAULT true,"featured" boolean NOT NULL DEFAULT false,"isNew" boolean NOT NULL DEFAULT false,"image" text NOT NULL DEFAULT '',"gallery" jsonb NOT NULL DEFAULT '[]'::jsonb,"createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "store_config" ("id" integer PRIMARY KEY DEFAULT 1,"name" text NOT NULL DEFAULT 'AleShop Technology',"tagline" text NOT NULL DEFAULT '',"whatsappNumber" text NOT NULL DEFAULT '',"updatedAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "events" ("id" serial PRIMARY KEY,"event" text NOT NULL,"productId" text,"productName" text,"payload" jsonb,"createdAt" timestamp NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "products_categorySlug_idx" ON "products"("categorySlug");
CREATE INDEX IF NOT EXISTS "products_active_idx" ON "products"("active");
