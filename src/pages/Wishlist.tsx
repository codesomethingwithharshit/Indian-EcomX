import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useWishlist } from "../hooks/useWishlist"
import { ProductCard } from "../components/ProductCard"
import { Button } from "../components/Button"

export default function Wishlist() {
  const { wishlist } = useWishlist()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Your Wishlist</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center"
            >
              <svg className="w-14 h-14 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 max-w-sm mx-auto">Save items you love by tapping the heart icon. They'll be waiting here when you're ready.</p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/products">
                <Button variant="primary">Discover Products</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {wishlist.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
