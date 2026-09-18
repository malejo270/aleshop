import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/components/cart/cart-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'AleShop Technology | Tecnología premium al alcance de un mensaje',
  description:
    'Tienda de productos tecnológicos: lámparas, Apple, cámaras y accesorios. Explora, arma tu carrito y compra fácilmente por WhatsApp.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
