import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { deliveryInfo } from "../data"
import { ImageCarousel } from "../components/ImageCarousel"
import { QuantitySelector } from "../components/QuantitySelector"
import { ReviewCard } from "../components/ReviewCard"
import { ProductCard } from "../components/ProductCard"
import { Button } from "../components/Button"
import { WishlistButton } from "../components/WishlistButton"
import { useCart } from "../context/CartContext"
import { useRecentlyViewed } from "../hooks/useRecentlyViewed"
import { useProducts } from "../context/ProductContext"
import { useReviews } from "../context/ReviewContext"
import { showToast } from "../hooks/useToast"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const allProducts = useProducts()
  const product = allProducts.products.find((p) => p.id === Number(id))
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { addReview, getProductReviews, getProductRating } = useReviews()
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, text: "" })
  const [submitted, setSubmitted] = useState(false)
  const productReviews = getProductReviews(product?.id)
  const ratingInfo = getProductRating(product?.id)

  useEffect(() => {
    if (product) addToRecentlyViewed(product)
  }, [product])

  const related = useMemo(
    () => allProducts.products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [allProducts.products, product]
  )

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <Helmet><title>Product Not Found - Indian EcomX</title></Helmet>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Product Not Found</h2>
        <p className="text-neutral-500 mb-6">The product you are looking for does not exist.</p>
        <Link to="/products"><Button>Back to Products</Button></Link>
      </div>
    )
  }

  const [imgError, setImgError] = useState(false)
  const handleImgError = useCallback(() => setImgError(true), [])

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, selectedColor }, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart({ ...product, selectedSize, selectedColor }, quantity)
    navigate("/checkout")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Helmet><title>{product.title} - Indian EcomX</title><meta name="description" content={product.description?.slice(0, 160)} /></Helmet>
      <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-8 overflow-x-auto pb-2">
        <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{product.category}</Link>
        <span>/</span>
        <span className="text-neutral-600 dark:text-neutral-300 truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-zoom-in group mb-4"
            onClick={() => setFullscreen(true)}
          >
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
                onError={handleImgError}
              />
            </AnimatePresence>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-neutral-600 shadow-sm">
              Click to zoom
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === index ? "border-neutral-900 dark:border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[oklch(55%_0.18_50)]">{product.category}</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[oklch(55%_0.18_50)] mt-2">{product.title}</h1>
            </div>
            <WishlistButton product={product} className="flex-shrink-0 bg-[oklch(55%_0.18_50)]" iconClass="text-white/80" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200 dark:text-neutral-700 fill-neutral-200 dark:fill-neutral-700"}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{product.rating} / 5</span>
          </div>

          <p className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mt-6">₹{product.price.toLocaleString()}</p>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-6">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
              product.stock > 5 ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" :
              product.stock > 0 ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
              "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
              }`} />
              {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
            {product.featured && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[oklch(55%_0.18_50)]/10 text-[oklch(55%_0.18_50)]">
                Featured
              </span>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-[oklch(55%_0.18_50)]">Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      selectedSize === size
                        ? "border-[oklch(55%_0.18_50)] bg-[oklch(55%_0.18_50)] text-white"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-[oklch(55%_0.18_50)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-[oklch(55%_0.18_50)]">Color</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      selectedColor === color
                        ? "border-[oklch(55%_0.18_50)] bg-[oklch(55%_0.18_50)] text-white"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-[oklch(55%_0.18_50)]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Quantity</h4>
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 bg-gradient-to-r from-[oklch(55%_0.18_50)] to-orange-600 hover:from-[oklch(48%_0.18_50)] hover:to-orange-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addedToCart ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Added to Cart
                </span>
              ) : (
                "Add to Cart"
              )}
            </motion.button>
            <Button variant="outline" className="flex-1" onClick={handleBuyNow}>Buy Now</Button>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Customer Reviews</h2>
            {ratingInfo && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{ratingInfo.average} avg · {ratingInfo.count} review{ratingInfo.count > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 text-center border border-green-100 dark:border-green-900/50 mb-6">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Thank you! Your review will appear after admin approval.</p>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-neutral-900/30 backdrop-blur-sm rounded-2xl p-5 border border-neutral-200/50 dark:border-neutral-700/50 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Write a Review</h3>
            <form onSubmit={(e) => { e.preventDefault(); addReview({ ...reviewForm, productId: product.id }); setSubmitted(true); showToast("Review submitted for approval", "success") }} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Your name" className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.18_50)]/20 transition-all" />
                <input type="email" required value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} placeholder="Your email" className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.18_50)]/20 transition-all" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                    <svg className={`w-5 h-5 cursor-pointer transition-colors ${star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300 dark:text-neutral-600 fill-neutral-300 dark:fill-neutral-600"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <textarea required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Share your experience..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.18_50)]/20 transition-all resize-none" />
              <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[oklch(55%_0.18_50)] to-orange-600 hover:from-[oklch(48%_0.18_50)] hover:to-orange-500 text-white text-sm font-semibold rounded-xl transition-all">Submit Review</button>
            </form>
          </div>
        )}

        {productReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Shipping & Returns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(deliveryInfo).map(([key, val]) => {
            const icons = { shipping: "🚚", returns: "📦", exchange: "🔄" }
            return (
              <div key={key} className="flex items-start gap-3 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-[oklch(55%_0.18_50)]/30 dark:hover:border-[oklch(55%_0.18_50)]/40 transition-all">
                <span className="text-lg flex-shrink-0 w-10 h-10 rounded-xl bg-[oklch(55%_0.18_50)]/10 dark:bg-[oklch(55%_0.18_50)]/20 flex items-center justify-center">{icons[key] || "📋"}</span>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">{key}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-0.5">{val}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              aria-label="Close fullscreen"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.title}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i) }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeImage ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
