import { motion } from "framer-motion"
import { useTheme } from "../hooks/useTheme"

export function WhatsAppWidget() {
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"

  return (
    <motion.a
      href="https://wa.me/919760971378"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-md transition-all duration-300
        ${isLatest
          ? "bg-white/10 border border-white/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40"
          : "bg-white/10 border border-white/15 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400/30"
        }`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Chat on WhatsApp"
    >
      {/* Glow ring animation */}
      <span className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
        isLatest
          ? "bg-cyan-400"
          : "bg-amber-400"
      }`} />

      {/* WhatsApp icon */}
      <svg
        className="w-7 h-7 relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.304.633 4.454 1.722 6.309L.137 23.25a.4.4 0 00.504.513l4.972-1.488A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-2.065 0-3.982-.56-5.634-1.532l-.388-.229-3.046.912.974-2.97-.252-.402A9.56 9.56 0 012.4 12c0-5.302 4.298-9.6 9.6-9.6s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" />
      </svg>
    </motion.a>
  )
}