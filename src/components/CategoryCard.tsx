import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../hooks/useTheme"
import { useState, useCallback } from "react"

export function CategoryCard({ category }) {
  const { visualTheme } = useTheme()
  const [imgError, setImgError] = useState(false)
  const onError = useCallback(() => setImgError(true), [])

  return (
    <Link to={`/products?category=${category.name}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="group relative w-[150px] sm:w-[170px] flex-shrink-0 h-44 sm:h-48 rounded-2xl overflow-hidden cursor-pointer"
      >
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800">
            <span className="text-3xl">🛍️</span>
          </div>
        ) : (
          <img
            src={category.image}
            alt={category.name}
            onError={onError}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          visualTheme === "latest"
            ? "bg-gradient-to-t from-cyan-500/20 to-transparent"
            : "bg-gradient-to-t from-amber-500/20 to-transparent"
        }`} />
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white drop-shadow-sm">{category.name}</h3>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
              visualTheme === "latest"
                ? "bg-cyan-500/30 text-cyan-200"
                : "bg-amber-500/30 text-amber-200"
            }`}>{category.count}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}