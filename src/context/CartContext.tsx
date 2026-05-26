import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { showToast } from "../hooks/useToast"

const CartContext = createContext(null)

function loadCart() {
  try {
    const data = localStorage.getItem("cart")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find(
        (item) => item.id === action.product.id && item.selectedSize === action.product.selectedSize && item.selectedColor === action.product.selectedColor
      )
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id && item.selectedSize === action.product.selectedSize && item.selectedColor === action.product.selectedColor
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        )
      }
      return [...state, { ...action.product, quantity: action.quantity || 1 }]
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.id)
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.id)
      }
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      )
    }
    case "CLEAR_CART":
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, null, loadCart)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: "ADD_TO_CART", product, quantity })
    showToast(`${product.title} added to cart`, "success")
  }

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", id })
    showToast("Item removed from cart", "info")
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    showToast("Cart cleared", "info")
  }

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0)
  const getShipping = () => (getCartTotal() >= 999 ? 0 : 99)
  const getTax = () => Math.round(getCartTotal() * 0.12)
  const getGrandTotal = () => getCartTotal() + getShipping() + getTax()

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getShipping,
        getTax,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
