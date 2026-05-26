import { motion } from "framer-motion"
import { useWishlist } from "../hooks/useWishlist"
import { showToast } from "../hooks/useToast"

export function WishlistButton({ product, className = "", iconClass = "text-neutral-600" }) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const liked = isInWishlist(product.id)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    showToast(
      liked ? "Removed from wishlist" : "Added to wishlist",
      "success"
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm ${className}`}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className={`w-4 h-4 transition-colors ${
          liked ? "text-red-500 fill-red-500" : iconClass
        }`}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </motion.button>
  )
}
