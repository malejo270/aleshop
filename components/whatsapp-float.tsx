import { MessageCircle } from "lucide-react"
import { storeConfig } from "@/lib/store-config"

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${storeConfig.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="size-7" />
    </a>
  )
}
