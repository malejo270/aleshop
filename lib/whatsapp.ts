import type { CartItem, CustomerInfo, Product } from "./types"
import { formatPrice } from "./format"
import { storeConfig } from "./store-config"

type LineItem = {
  name: string
  quantity: number
  price: number
}

function buildLines(items: LineItem[]): string {
  return items
    .map((item) => {
      const subtotal = item.price * item.quantity
      return [
        `• ${item.name}`,
        `   Cantidad: ${item.quantity}`,
        `   Precio unitario: ${formatPrice(item.price)}`,
        `   Subtotal: ${formatPrice(subtotal)}`,
      ].join("\n")
    })
    .join("\n\n")
}

function buildCustomerBlock(customer?: CustomerInfo): string {
  if (!customer) return ""
  const rows: string[] = []
  if (customer.name) rows.push(`Nombre: ${customer.name}`)
  if (customer.city) rows.push(`Ciudad: ${customer.city}`)
  if (customer.address) rows.push(`Dirección: ${customer.address}`)
  if (customer.phone) rows.push(`Teléfono: ${customer.phone}`)
  if (customer.notes) rows.push(`Observación: ${customer.notes}`)
  if (rows.length === 0) return ""
  return `\n\n👤 *DATOS DEL CLIENTE*\n${rows.join("\n")}`
}

export function buildOrderMessage(items: LineItem[], customer?: CustomerInfo): string {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return [
    `Hola, ${storeConfig.name}. Estoy interesado en realizar el siguiente pedido:`,
    ``,
    `🛒 *PRODUCTOS*`,
    ``,
    buildLines(items),
    ``,
    `━━━━━━━━━━━━`,
    `💰 *TOTAL: ${formatPrice(total)}*`,
    ``,
    `🚚 *ENVÍO CONTRAENTREGA EN CALI*`,
    `El valor del domicilio se suma al precio del pedido.`,
    buildCustomerBlock(customer),
    ``,
    `Quisiera información para realizar la compra y conocer las opciones de entrega.`,
  ]
    .filter((line) => line !== null)
    .join("\n")
}

export function whatsappLink(
  message: string,
  number: string = storeConfig.whatsappNumber,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function cartWhatsappLink(
  items: CartItem[],
  customer?: CustomerInfo,
): string {
  return whatsappLink(buildOrderMessage(items, customer))
}

export function productWhatsappLink(
  product: Product,
  quantity = 1,
): string {
  return whatsappLink(
    buildOrderMessage([
      {
        name: product.name,
        quantity,
        price: product.price,
      },
    ]),
  )
}
