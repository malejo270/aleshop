const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

export function formatPrice(value: number): string {
  return currency.format(value)
}
