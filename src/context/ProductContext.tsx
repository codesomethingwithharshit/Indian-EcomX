import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { products as seedProducts } from "../data"

const ProductContext = createContext(null)

const SEED_IDS = new Set(seedProducts.map((p) => Number(p.id)))

function getDeletedSeedIds() {
  try { return new Set(JSON.parse(localStorage.getItem("admin-deleted-ids") || "[]")) } catch { return new Set() }
}

function loadProducts() {
  try {
    const saved = localStorage.getItem("admin-products")
    if (saved) {
      const parsed = JSON.parse(saved)
      const savedIds = new Set(parsed.map((p) => Number(p.id)))
      const deletedIds = getDeletedSeedIds()
      const missing = JSON.parse(JSON.stringify(seedProducts)).filter((p) => !savedIds.has(Number(p.id)) && !deletedIds.has(Number(p.id)))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem("admin-products", JSON.stringify(merged))
        return merged
      }
      return parsed
    }
  } catch {}
  return JSON.parse(JSON.stringify(seedProducts))
}

function nextId(products) {
  return Math.max(...products.map((p) => p.id), 0) + 1
}

function productReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return [...state, { ...action.product, id: nextId(state) }]
    case "EDIT_PRODUCT": {
      const editId = Number(action.product.id)
      return state.map((p) => (Number(p.id) === editId ? { ...p, ...action.product } : p))
    }
    case "DELETE_PRODUCT": {
      const delId = Number(action.id)
      return state.filter((p) => Number(p.id) !== delId)
    }
    case "RESET":
      return JSON.parse(JSON.stringify(seedProducts))
    default:
      return state
  }
}

export function ProductProvider({ children }) {
  const [products, dispatch] = useReducer(productReducer, null, loadProducts)

  useEffect(() => {
    localStorage.setItem("admin-products", JSON.stringify(products))
  }, [products])

  const addProduct = (product) => dispatch({ type: "ADD_PRODUCT", product })
  const editProduct = (product) => dispatch({ type: "EDIT_PRODUCT", product })
  const deleteProduct = (id) => {
    dispatch({ type: "DELETE_PRODUCT", id })
    const numId = Number(id)
    if (SEED_IDS.has(numId)) {
      const deleted = getDeletedSeedIds()
      deleted.add(numId)
      localStorage.setItem("admin-deleted-ids", JSON.stringify([...deleted]))
    }
  }
  const resetProducts = () => { dispatch({ type: "RESET" }); localStorage.removeItem("admin-deleted-ids") }

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider")
  return ctx
}
