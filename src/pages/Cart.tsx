import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useCart } from "../context/CartContext"
import { CartItem } from "../components/CartItem"
import { CartSummary } from "../components/CartSummary"
import { Button } from "../components/Button"

export default function Cart() {
  const { cart, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center"
          >
            <svg className="w-14 h-14 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 max-w-sm mx-auto">Add some items to get started. You'll find plenty of premium pieces waiting for you.</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/products">
              <Button variant="primary">Explore Products</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Shopping Cart</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-4">
            <Link to="/products">
              <Button variant="secondary" className="!text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <CartSummary />
          <Link to="/checkout">
            <Button variant="primary" className="w-full mt-4">
              Proceed to Checkout
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
