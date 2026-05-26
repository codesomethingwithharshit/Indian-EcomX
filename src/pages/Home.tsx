import { useState, useMemo, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../hooks/useTheme"
import { HeroBanner } from "../components/HeroBanner"
import { CategoryCard } from "../components/CategoryCard"
import { ProductCard } from "../components/ProductCard"
import { SearchBar } from "../components/SearchBar"
import { ProductSlider } from "../components/ProductSlider"
import { categories, testimonials, brands } from "../data"
import { useProducts } from "../context/ProductContext"
import { loadSections, loadCustomSections } from "../lib/sections"
import { showToast } from "../hooks/useToast"
import { CollectionSlider } from "../components/CollectionSlider"

function BrandLogo({ brand, visualTheme }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <span className={`text-sm font-bold tracking-tight ${
        visualTheme === "latest"
          ? "text-white/60"
          : "text-neutral-600 dark:text-neutral-400"
      }`}>
        {brand.name}
      </span>
    )
  }
  return (
    <img
      src={brand.logo}
      alt={brand.name}
      onError={() => setError(true)}
      className={`h-7 md:h-9 object-contain transition-all duration-300 dark:brightness-0 dark:invert ${
        visualTheme === "latest"
          ? "opacity-70"
          : "opacity-80"
      }`}
    />
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
}

function CategoriesSection() {
  return (
    <section className="py-10 lg:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Collections</span>
          <h2 className="text-2xl sm:text-3xl font-bold premium-section-title mt-1">Shop by Category</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto px-1 pb-2 scroll-x-wide" style={{ msOverflowStyle: "auto" }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedSection({ products }) {
  const scrollRef = useRef(null)
  const [search, setSearch] = useState("")

  const featured = useMemo(() => products.filter((p) => p.featured), [products])
  const filtered = featured.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section id="featured-top" className="bg-neutral-50 dark:bg-neutral-900/50 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Curated</span>
          <h2 className="text-2xl sm:text-3xl font-bold premium-section-title mt-1">Featured Products</h2>
          <div className="mt-3 max-w-xs mx-auto">
            <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16"><p className="text-neutral-500 text-sm">No products found.</p></div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scroll-x-wide"
          style={{ msOverflowStyle: "auto" }}
        >
          {filtered.map((product, i) => (
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
      )}
    </section>
  )
}


function TrendingSection({ products }) {
  const trending = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), [products])
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"
  if (trending.length === 0) return null
  return (
    <section className="py-10 lg:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Popular</span>
          <h2 className={`text-2xl sm:text-3xl font-bold mt-1 ${isLatest ? "text-white" : "premium-section-title"}`}>Trending Now</h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-x-wide" style={{ msOverflowStyle: "auto" }}>
          {trending.map((product, i) => {
            const gradient = isLatest
              ? "from-cyan-500/20 via-blue-500/10 to-transparent"
              : "from-amber-500/20 via-orange-500/10 to-transparent"
            return (
              <Link key={product.id} to={`/products/${product.id}`} className="block flex-shrink-0 w-[200px] sm:w-[220px] group">
                <motion.div
                  initial={{ opacity: 0 }}

                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent`}>
                    <h3 className="text-sm font-semibold text-white truncate">{product.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-white">₹{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <svg className={`w-3.5 h-3.5 ${isLatest ? "text-cyan-400" : "text-amber-400"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-white font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ExploreSection({ products }) {
  return (
    <ProductSlider title="Explore More" products={useMemo(() => products.slice(0, 8), [])} />
  )
}

function LimitedSection({ products }) {
  const limited = useMemo(() => products.filter((p) => p.stock <= 5 && p.stock > 0), [products])
  if (limited.length === 0) return null
  return (
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Limited Stock</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">Low Stock Alert</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1.5 text-xs">Grab these before they're gone</p>
        </div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {limited.map((product, i) => (
            <motion.div key={product.id} variants={itemAnim}><ProductCard product={product} index={i} /></motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BrandsSection({ visualTheme }) {
  const isLatest = visualTheme === "latest"

  const brandStyles = {
    Nike: {
      gradient: "from-zinc-100 via-neutral-100 to-zinc-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-neutral-800",
      glow: "shadow-zinc-200/50 dark:shadow-black/30",
      border: "border-zinc-300/40 dark:border-white/[0.06]",
      icon: "from-zinc-300/20 to-zinc-400/10 dark:from-white/10 dark:to-white/5",
      logoLight: true,
    },
    Adidas: {
      gradient: "from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950",
      glow: "shadow-blue-200/50 dark:shadow-blue-900/30",
      border: "border-blue-300/40 dark:border-blue-400/10",
      icon: "from-blue-300/20 to-indigo-400/10 dark:from-blue-400/10 dark:to-blue-600/5",
      logoLight: false,
    },
    Puma: {
      gradient: "from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-900 dark:to-yellow-950",
      glow: "shadow-orange-200/50 dark:shadow-orange-900/30",
      border: "border-orange-300/40 dark:border-orange-400/10",
      icon: "from-orange-300/20 to-amber-400/10 dark:from-orange-400/10 dark:to-amber-600/5",
      logoLight: false,
    },
    "H&M": {
      gradient: "from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950 dark:via-pink-900 dark:to-rose-950",
      glow: "shadow-rose-200/50 dark:shadow-pink-900/30",
      border: "border-rose-300/40 dark:border-pink-400/10",
      icon: "from-rose-300/20 to-pink-400/10 dark:from-pink-400/10 dark:to-rose-600/5",
      logoLight: false,
    },
    Zara: {
      gradient: "from-stone-100 via-amber-50/50 to-stone-100 dark:from-stone-900 dark:via-amber-900/30 dark:to-stone-900",
      glow: "shadow-stone-200/50 dark:shadow-amber-900/20",
      border: "border-stone-300/40 dark:border-amber-200/10",
      icon: "from-amber-200/20 to-stone-300/10 dark:from-amber-200/10 dark:to-stone-400/5",
      logoLight: true,
    },
    Levis: {
      gradient: "from-red-50 via-rose-50 to-red-100 dark:from-red-950 dark:via-rose-900 dark:to-red-950",
      glow: "shadow-red-200/50 dark:shadow-red-900/30",
      border: "border-red-300/40 dark:border-red-400/10",
      icon: "from-red-300/20 to-rose-400/10 dark:from-red-400/10 dark:to-rose-600/5",
      logoLight: false,
    },
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Trusted By</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 premium-section-title">
          Featured Brands
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {brands.map((brand, i) => {
          const style = brandStyles[brand.name] || brandStyles.Nike
          return (
            <motion.div key={brand.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className={`group relative overflow-hidden rounded-xl p-4 flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${style.gradient} ${style.border} border shadow-lg ${style.glow} hover:shadow-xl`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${style.icon} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <BrandLogo brand={brand} visualTheme={visualTheme} />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function TestimonialsSection({ visualTheme }) {
  const isLatest = visualTheme === "latest"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-center mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Testimonials</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 premium-section-title">What Our Customers Say</h2>
      </motion.div>

      <div className="relative">
        <div className="flex gap-4 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}>
          <motion.div
            className="flex gap-4 flex-shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="relative w-[320px] flex-shrink-0 rounded-xl p-5 bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] backdrop-blur-sm hover:bg-white/90 dark:hover:bg-white/[0.08] transition-all duration-300 group shadow-sm"
              >
                <div className="absolute top-0 left-0 w-12 h-12 border-t border-l rounded-tl-xl border-amber-400/40 dark:border-amber-400/30 group-hover:w-16 group-hover:h-16 transition-all duration-300" />
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-white/10" />
                  <div>
                    <p className="text-xs font-medium text-neutral-800 dark:text-white/80">{t.name}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-white/30">{t.role}</p>
                  </div>
                </div>
                <span className="absolute bottom-2 right-3 text-[10px] tracking-widest text-amber-400/50 dark:text-amber-400/30 group-hover:text-amber-400/70 dark:group-hover:text-amber-400/50 transition-colors duration-300">...</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection({ visualTheme }) {
  const isLatest = visualTheme === "latest"
  const [email, setEmail] = useState("")
  const [justSubscribed, setJustSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const subscribers = JSON.parse(localStorage.getItem("admin-subscribers") || "[]")
    if (subscribers.some((s) => s.email === email.trim())) {
      showToast("This email is already subscribed!", "info")
      return
    }
    subscribers.push({ email: email.trim(), subscribedAt: new Date().toISOString() })
    localStorage.setItem("admin-subscribers", JSON.stringify(subscribers))
    setEmail("")
    setJustSubscribed(true)
    showToast("Thank you for subscribing! 🎉", "success")
  }

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-neutral-50 to-orange-100/60 dark:from-amber-950/20 dark:via-neutral-950 dark:to-orange-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-300/10 dark:bg-amber-500/5 blur-3xl" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/60 dark:border-white/[0.06] bg-amber-50/50 dark:bg-white/[0.02] text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-600 dark:text-white/30 mb-5">
            <span className="w-1 h-1 rounded-full bg-amber-400/80 dark:bg-amber-400/60" />
            Newsletter
          </div>
          {justSubscribed ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">Thank You!</h2>
              <p className="text-neutral-500 dark:text-white/35 mt-3 text-sm max-w-sm mx-auto">
                You're now subscribed. Stay tuned for exclusive updates and drops.
              </p>
              <button onClick={() => setJustSubscribed(false)}
                className={`mt-6 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isLatest
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                } hover:scale-[1.02] active:scale-[0.98]`}>
                Subscribe Another Email
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">Stay in the Loop</h2>
              <p className="text-neutral-500 dark:text-white/35 mt-3 text-sm max-w-sm mx-auto">
                Be the first to know about new arrivals and exclusive drops.
              </p>
              <form onSubmit={handleSubscribe}
                className="mt-6 max-w-sm mx-auto flex gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-neutral-300/60 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/20 text-sm focus:outline-none transition-all duration-300 ${
                    isLatest
                      ? "focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/30"
                      : "focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/30"
                  }`} />
                <button type="submit"
                  className={`px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isLatest
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  } hover:scale-[1.02] active:scale-[0.98]`}>
                  Subscribe
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function CustomSection({ section, products }) {
  const { productIds } = section
  const sectionProducts = useMemo(() => products.filter((p) => productIds?.includes(p.id)), [products, productIds])
  if (!sectionProducts.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-8">
        <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Curated</span>
        <h2 className="text-2xl sm:text-3xl font-bold premium-section-title mt-1">{section.name || "Collection"}</h2>
        {section.description && <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1.5">{section.description}</p>}
      </div>
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {sectionProducts.map((product, i) => (
          <motion.div key={product.id} variants={itemAnim}><ProductCard product={product} index={i} /></motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default function Home() {
  const { products } = useProducts()
  const { visualTheme } = useTheme()
  const [sectionConfig] = useState(() => loadSections())
  const [customSections] = useState(() => loadCustomSections())

  const visibleSections = sectionConfig.filter((s) => s.visible)

  const sectionComponents = {
    categories: <CategoriesSection />,
    featured: <FeaturedSection products={products} />,
    trending: <TrendingSection products={products} />,
    explore: <ExploreSection products={products} />,
    limited: <LimitedSection products={products} />,
    brands: <BrandsSection visualTheme={visualTheme} />,
    testimonials: <TestimonialsSection visualTheme={visualTheme} />,
    newsletter: <NewsletterSection visualTheme={visualTheme} />,
  }

  return (
    <div>
      <HeroBanner />
      {visibleSections.map((sec) => {
        if (sec.type === "custom") {
          const customSec = customSections.find((c) => c.id === sec.customSectionId)
          if (!customSec) return null
          return <CustomSection key={sec.id} section={customSec} products={products} />
        }
        if (sec.type === "collection-slider") {
          return <CollectionSlider key={sec.id} headline={sec.headline} productIds={sec.productIds} />
        }
        return <div key={sec.id}>{sectionComponents[sec.type]}</div>
      })}
    </div>
  )
}
