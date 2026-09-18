

## Panel de administración

La tienda incluye `/admin/productos` para crear, editar, publicar/ocultar y eliminar productos.

1. Configura `DATABASE_URL` con tu PostgreSQL/Neon.
2. Configura `BLOB_READ_WRITE_TOKEN` si quieres subir imágenes directamente desde el panel. También puedes pegar URLs de imágenes sin Blob.
3. Recomendado: configura `ADMIN_EMAIL` con el correo del administrador para restringir el panel a esa cuenta.
4. Entra a `/sign-in` y crea/inicia la cuenta que administrará la tienda.
5. Luego abre `/admin/productos`.

El panel usa la sesión de Better Auth y las mutaciones se ejecutan en el servidor.


## Vercel + Neon (configuración rápida)

El proyecto acepta `DATABASE_URL` y, como respaldo, las variables `POSTGRES_PRISMA_URL`, `POSTGRES_URL` o `POSTGRES_URL_NON_POOLING` creadas por la integración de Neon en Vercel. En una instalación nueva, el esquema PostgreSQL se crea automáticamente en la primera petición.

Variables recomendadas en Production, Preview y Development:
- `DATABASE_URL`: URL pooled de Neon.
- `BETTER_AUTH_SECRET`: secreto aleatorio largo.
- `ADMIN_EMAIL`: correo que tendrá acceso al panel.
- `BLOB_READ_WRITE_TOKEN`: token de Vercel Blob si vas a subir imágenes desde el panel.
- `BETTER_AUTH_URL`: opcional; Vercel puede resolver automáticamente el dominio de producción.

Si Neon ya está conectado y Vercel muestra `POSTGRES_URL`, no es obligatorio duplicar la variable: la aplicación usa automáticamente esa conexión como respaldo.
