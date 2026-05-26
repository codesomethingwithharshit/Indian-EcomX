import { useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useCart } from "../context/CartContext"
import { useTheme } from "../hooks/useTheme"
import { WishlistButton } from "./WishlistButton"

export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const handleImgError = useCallback(() => setImgError(true), [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden transition-all duration-500 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm border border-white/20 dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-neutral-900/60 hover:shadow-xl hover:shadow-amber-500/5"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-amber-500/10 via-transparent to-orange-500/10" />
      <Link to={`/products/${product.id}`} className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className={`absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transition-opacity duration-500 ${imgLoaded ? "opacity-0" : "opacity-100"}`} />
        {imgError ? (
          <div className="w-full h-56 sm:h-60 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <svg className="w-10 h-10 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        ) : (
          <motion.img
            src={product.images[0]}
            alt={product.title}
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
            className={`w-full h-56 sm:h-60 object-cover transition-all duration-700 ease-out ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <WishlistButton
          product={product}
          iconClass="text-white/90"
          className={`absolute top-2.5 right-2.5 z-10 rounded-lg ${
            isLatest
              ? "latest-badge"
              : "bg-[oklch(55%_0.18_50)] backdrop-blur-sm border border-white/10"
          }`}
        />
        {product.featured && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider z-10 bg-[oklch(55%_0.18_50)] text-white shadow-lg shadow-amber-500/30">
            Featured
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className={`absolute top-2.5 left-2.5 text-white text-[9px] font-semibold px-2 py-0.5 rounded-md z-10 ${
            isLatest
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20"
              : "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20"
          }`}>
            Only {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-md z-10">
            Out of Stock
          </span>
        )}
        {/* Price badge on image */}
        <span className={`absolute bottom-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-lg z-10 shadow-lg ${
          isLatest
            ? "bg-black/60 backdrop-blur-sm text-cyan-300"
            : "bg-black/60 backdrop-blur-sm text-white"
        }`}>
          ₹{product.price.toLocaleString()}
        </span>
      </Link>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isLatest
              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-400/20"
          }`}>
            {product.category}
          </span>
          {product.rating && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 ml-auto">
              <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating}
            </span>
          )}
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className={`text-sm font-semibold leading-snug line-clamp-1 transition-colors ${
            isLatest
              ? "text-white group-hover:text-cyan-300"
              : "text-amber-700 dark:text-amber-400"
          }`}>
            {product.title}
          </h3>
        </Link>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`w-full mt-auto py-2 text-[11px] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            isLatest
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-[1.02]"
              : "bg-[oklch(55%_0.18_50)] text-white hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {product.stock === 0 ? "Sold Out" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  )
}
