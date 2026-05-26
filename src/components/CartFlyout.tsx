import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

export function CartFlyout() {
  const { cart, getCartCount, getCartTotal } = useCart()
  const [open, setOpen] = useState(false)
  const prevLen = useRef(cart.length)

  useEffect(() => {
    if (cart.length <= prevLen.current) { prevLen.current = cart.length; return }
    prevLen.current = cart.length
    setOpen(true)
    const timer = setTimeout(() => setOpen(false), 4000)
    return () => clearTimeout(timer)
  }, [cart.length])

  if (cart.length === 0) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">Cart ({getCartCount()})</h3>
                <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-neutral-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-4 space-y-3">
              {cart.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-900 truncate">{item.title}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-xs font-semibold text-neutral-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {cart.length > 3 && (
                <p className="text-xs text-neutral-500 text-center">+{cart.length - 3} more items</p>
              )}
            </div>
            <div className="p-4 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-neutral-900">Total</span>
                <span className="text-sm font-bold text-neutral-900">₹{getCartTotal().toLocaleString()}</span>
              </div>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
