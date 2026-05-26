import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const announcements = [
  { text: "FREE SHIPPING on orders above ₹999", icon: "🚚" },
  { text: "Use code URBAN20 for 20% OFF", icon: "🏷️" },
  { text: "Easy 15-day returns — no questions asked", icon: "↩️" },
]

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-9 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 dark:from-amber-800 dark:via-orange-800 dark:to-amber-800 overflow-hidden">
      <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-white text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2"
          >
            <span className="text-[15px]">{announcements[current].icon}</span>
            <span>{announcements[current].text}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
