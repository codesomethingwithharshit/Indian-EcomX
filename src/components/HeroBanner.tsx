import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { heroSlides } from "../data"
import { useTheme } from "../hooks/useTheme"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

function PremiumHero({ slide, current, setCurrent }) {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[70vh] flex items-center overflow-hidden bg-neutral-950">
      {/* Background layers */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-bg"}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt="" className="w-full h-full object-cover opacity-30 sm:opacity-40" />
            <div className="absolute inset-0 premium-hero-overlay" />
          </motion.div>
        </AnimatePresence>
        <div className="premium-hero-glow premium-hero-glow-1" />
        <div className="premium-hero-glow premium-hero-glow-2" />
        <div className="premium-hero-glow premium-hero-glow-3" />
        <div className="absolute top-1/4 right-[20%] w-40 h-40 rounded-full border border-amber-500/20 animate-premium-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 left-[15%] w-32 h-32 rounded-full border border-orange-500/10 animate-premium-float pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] left-[40%] w-0.5 h-0.5 bg-amber-400/60 rounded-full" />
        <div className="absolute top-[60%] left-[20%] w-0.5 h-0.5 bg-orange-400/40 rounded-full" />
        <div className="absolute top-[20%] right-[35%] w-0.5 h-0.5 bg-rose-400/50 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* Pill badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-premium-pulse" />
              {slide.title}
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
            >
              {slide.subtitle.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                  {i === 0 ? (
                    <span className="text-white">{word}</span>
                  ) : i === 1 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">{word}</span>
                  ) : (
                    <span className="text-white/90">{word}</span>
                  )}
                  {i < slide.subtitle.split(" ").length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-6 text-base sm:text-lg max-w-md leading-relaxed text-white/50"
            >
              {slide.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to={slide.link} className="group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 text-sm relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  {slide.cta}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 text-sm border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 active:scale-[0.98]">
                View Collection
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {["https://i.pravatar.cc/40?img=1", "https://i.pravatar.cc/40?img=5", "https://i.pravatar.cc/40?img=8", "https://i.pravatar.cc/40?img=11"].map((url, i) => (
                  <img key={i} src={url} alt="" className="w-8 h-8 rounded-full border-2 border-neutral-950 object-cover" />
                ))}
              </div>
              <div className="text-xs text-white/30">
                <span className="text-amber-400 font-semibold">12K+</span> happy customers
              </div>
            </motion.div>
          </motion.div>

          {/* Right image panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative">
              <div className="w-[420px] h-[520px] rounded-3xl overflow-hidden relative">
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              </div>
              {/* Floating badge 1 */}
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-amber-400 text-xl font-bold">NEW</p>
                  <p className="text-white/60 text-[10px]">Season</p>
                </div>
              </div>
              {/* Floating badge 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 px-5 py-3.5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10"
              >
                <p className="text-white/80 text-xs font-medium">Free shipping</p>
                <p className="text-white/30 text-[10px] mt-0.5">on orders above ₹999</p>
              </motion.div>
              {/* Corner accent */}
              <div className="absolute top-6 right-6 w-16 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/60 to-amber-500/0 rotate-45" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? "w-10 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function LatestHero({ slide, current, setCurrent }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a1a] to-[#050510]" />
      <div className="absolute inset-0 latest-aurora" />
      <div className="absolute top-1/4 right-[15%] w-72 h-72 rounded-full border border-cyan-500/10 animate-latest-float pointer-events-none" />
      <div className="absolute top-[40%] right-[25%] w-40 h-40 rounded-full border border-indigo-500/10 animate-premium-float pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[20%] right-[10%] w-20 h-20 rounded-full bg-cyan-500/5 blur-xl pointer-events-none" />
      <div className="absolute top-[15%] left-[5%] w-56 h-56 rounded-full bg-indigo-500/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[30%] right-[30%] w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,220,255,0.6)] pointer-events-none" />
      <div className="absolute top-[60%] right-[20%] w-0.5 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] pointer-events-none" />
      <div className="absolute top-[30%] right-[40%] w-0.5 h-0.5 bg-cyan-300 rounded-full shadow-[0_0_12px_rgba(0,220,255,0.4)] pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[38px]"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6 px-4 py-2 rounded-full premium-pill"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-premium-pulse" />
                {slide.title}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
              >
                {slide.subtitle.split(" ").map((word, i) => (
                  <span key={i} className="inline-block">
                    {i === 1 ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">{word}</span>
                    ) : (
                      <span className="text-white">{word}</span>
                    )}
                    {i < slide.subtitle.split(" ").length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mt-6 text-base sm:text-lg max-w-md leading-relaxed text-white/50"
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Link to={slide.link} className="group inline-flex items-center justify-center px-8 py-4 font-medium rounded-xl transition-all duration-300 text-sm relative overflow-hidden premium-btn premium-btn-primary">
                  <span className="relative z-10 flex items-center gap-2">
                    {slide.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
                <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-xl transition-all duration-300 text-sm premium-btn premium-btn-secondary">
                  View Collection
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12 flex items-center gap-6"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50">{(i * 2).toFixed(1)}k</div>
                  ))}
                </div>
                <div className="text-xs text-white/30">
                  <span className="text-cyan-400 font-semibold">12K+</span> happy customers
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative">
                <div className="w-[400px] h-[500px] rounded-2xl overflow-hidden relative">
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 backdrop-blur-xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-cyan-400 text-lg font-bold">NEW</p>
                    <p className="text-white/50 text-[10px]">Season</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-white/70 text-xs font-medium">Free shipping</p>
                  <p className="text-white/30 text-[10px]">on orders above ₹999</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-3 pt-6 pb-5">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? "w-10 h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const slide = heroSlides[current]
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (isLatest) return <LatestHero slide={slide} current={current} setCurrent={setCurrent} />
  return <PremiumHero slide={slide} current={current} setCurrent={setCurrent} />
}
