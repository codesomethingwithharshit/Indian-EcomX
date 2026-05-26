import { useLocalStorage } from "./useLocalStorage"

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage("wishlist", [])

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) return prev.filter((p) => p.id !== product.id)
      return [...prev, product]
    })
  }

  const isInWishlist = (id) => wishlist.some((p) => p.id === id)

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id))
  }

  return { wishlist, toggleWishlist, isInWishlist, removeFromWishlist }
}
