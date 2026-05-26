import { useState, useMemo, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { ProductCard } from "../components/ProductCard"
import { SearchBar } from "../components/SearchBar"
import { FilterSidebar } from "../components/FilterSidebar"
import { ProductCardSkeleton } from "../components/Skeleton"
import { Button } from "../components/Button"
import { useProducts } from "../context/ProductContext"

export default function Products() {
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState("")
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (products.length > 0) setLoading(false)
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
    }
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory)
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      result = result.filter((p) => p.price >= min && p.price <= max)
    }
    if (selectedRating > 0) result = result.filter((p) => p.rating >= selectedRating)
    if (inStockOnly) result = result.filter((p) => p.stock > 0)
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price)
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === "newest") result.sort((a, b) => b.id - a.id)
    return result
  }, [products, search, selectedCategory, priceRange, selectedRating, inStockOnly, sortBy])

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setLoading(true)
    setTimeout(() => setLoading(false), 300)
    if (cat) setSearchParams({ category: cat })
    else setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Helmet><title>All Products - Indian EcomX</title><meta name="description" content="Browse our full collection of products at Indian EcomX. Shop fashion, electronics, home essentials and more." /></Helmet>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">All Products</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-3 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
          >
            <option value="">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
          <button
            className="lg:hidden p-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <AnimatePresence mode="wait">
          {(showFilters || true) && (
            <motion.aside
              initial={false}
              className={`${showFilters ? "fixed inset-0 z-40 lg:relative lg:inset-auto" : "hidden lg:block"} w-full lg:w-56 flex-shrink-0`}
            >
              {showFilters && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setShowFilters(false)} />
              )}
              <div className={`relative z-50 ${showFilters ? "fixed top-0 left-0 h-full w-72 bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto p-6" : ""}`}>
                {showFilters && (
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-neutral-500 hover:text-neutral-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedRating={selectedRating}
                  onRatingChange={setSelectedRating}
                  inStockOnly={inStockOnly}
                  onStockChange={setInStockOnly}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 lg:py-28">
              <svg className="w-16 h-16 mx-auto text-neutral-200 dark:text-neutral-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No products match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Category showcase */}
      <section className="mt-16 sm:mt-20 lg:mt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400">Collections</span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">Shop by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {products.reduce((acc, p) => {
            if (!acc.find((c) => c === p.category)) acc.push(p.category)
            return acc
          }, []).slice(0, 5).map((cat, i) => {
            const catData = cat
            const catProducts = products.filter((p) => p.category === catData)
            const cover = catProducts[0]?.images[0]
            const isTall = i === 0
            return (
              <button
                key={catData}
                onClick={() => { handleCategoryChange(catData); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className={`group relative rounded-2xl overflow-hidden bg-neutral-900 text-left ${isTall ? "md:col-span-2 md:row-span-2" : "aspect-[4/3] md:aspect-auto"}`}
                style={isTall ? { minHeight: "280px" } : {}}
              >
                <img
                  src={cover}
                  alt={catData}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
                <div className={`absolute ${isTall ? "bottom-5 left-5" : "bottom-3 left-3 sm:bottom-4 sm:left-4"} flex items-end justify-between w-full pr-4 sm:pr-5`}>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-semibold mb-1.5 ${isTall ? "" : "text-[9px]"}`}>
                      {catProducts.length} items
                    </span>
                    <h3 className={`font-bold text-white drop-shadow-sm ${isTall ? "text-xl sm:text-2xl" : "text-sm sm:text-base"}`}>{catData}</h3>
                    {isTall && <p className="text-white/50 text-xs mt-1 max-w-[180px] leading-relaxed">Explore our curated {catData.toLowerCase()} collection</p>}
                  </div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-amber-500/30 transition-colors duration-300 ${isTall ? "" : "hidden sm:flex"}`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

    </div>
  )
}
