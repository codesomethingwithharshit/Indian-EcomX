import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"

const ReviewContext = createContext(null)

function loadReviews() {
  try {
    const saved = localStorage.getItem("app-reviews")
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

function nextId(items) {
  return Math.max(...items.map((i) => i.id), 0) + 1
}

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(loadReviews)
  const reviewsRef = useRef(reviews)

  useEffect(() => {
    reviewsRef.current = reviews
    localStorage.setItem("app-reviews", JSON.stringify(reviews))
  }, [reviews])

  const addReview = (review) => {
    const current = reviewsRef.current
    const newReview = {
      ...review,
      id: nextId(current),
      date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
      approved: false,
    }
    setReviews((prev) => [newReview, ...prev])
    return newReview
  }

  const updateReview = (id, updates) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const approveReview = (id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)))
  }

  const importReviews = (bulk) => {
    const current = reviewsRef.current
    const maxId = nextId(current)
    const now = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    const mapped = bulk.map((r, i) => ({
      id: maxId + i,
      productId: Number(r.productId) || 0,
      name: r.name || "Anonymous",
      email: r.email || "",
      rating: Number(r.rating) || 5,
      text: r.text || "",
      date: r.date || now,
      approved: r.approved === "true" || r.approved === true,
    }))
    setReviews((prev) => [...mapped, ...prev])
  }

  const getProductReviews = useCallback((productId) =>
    reviewsRef.current.filter((r) => Number(r.productId) === Number(productId) && r.approved),
  [])

  const getProductRating = useCallback((productId) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return null
    const avg = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    return { average: Math.round(avg * 10) / 10, count: productReviews.length }
  }, [getProductReviews])

  return (
    <ReviewContext.Provider value={{ reviews, addReview, updateReview, deleteReview, approveReview, importReviews, getProductReviews, getProductRating }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error("useReviews must be used within a ReviewProvider")
  return ctx
}
