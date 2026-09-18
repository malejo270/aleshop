export type TrackEvent =
  | "add_to_cart"
  | "remove_from_cart"
  | "whatsapp_checkout"
  | "whatsapp_product"

/**
 * Lightweight interaction tracker. In stage 5 this will POST to an API route
 * that writes to the `stats` table so the admin dashboard can show which
 * products generate the most interest. For now it only logs.
 */
export function trackEvent(event: TrackEvent, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  console.log("[v0] track", event, payload ?? {})
}
