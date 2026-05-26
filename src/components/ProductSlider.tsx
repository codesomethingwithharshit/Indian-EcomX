import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./ProductCard"
import { useTheme } from "../hooks/useTheme"

export function ProductSlider({ products, title }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState)
    updateScrollState()
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState, products])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (!products || products.length === 0) return null

  const btnBase = isLatest
    ? "border-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-20"
    : "border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/40 disabled:opacity-20"

  return (
    <section className="py-10 lg:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold premium-section-title">{title}</h2>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex-shrink-0 w-[250px] sm:w-[270px]"
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-neutral-500 dark:text-neutral-400 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${btnBase}`}
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-neutral-500 dark:text-neutral-400 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${btnBase}`}
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  )
}
