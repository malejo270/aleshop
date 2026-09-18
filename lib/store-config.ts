/**
 * Store-wide configuration. In stage 1 these are defaults; in stage 2 they
 * will be loaded from the `store_config` table so the admin can edit the
 * WhatsApp number and store details without changing code.
 */
export type StoreConfig = {
  name: string
  tagline: string
  /** WhatsApp number in international format, digits only (no + or spaces). */
  whatsappNumber: string
}

export const storeConfig: StoreConfig = {
  name: "AleShop Technology",
  tagline: "Tecnología premium al alcance de un mensaje",
  whatsappNumber: "573176046454",
}
