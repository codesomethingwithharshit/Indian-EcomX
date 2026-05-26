import { useLocalStorage } from "./useLocalStorage"

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage("recentlyViewed", [])

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, 8)
    })
  }

  return { recentlyViewed, addToRecentlyViewed }
}
