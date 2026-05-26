import { useCart } from "../context/CartContext"

export function CartSummary() {
  const { cart, getCartTotal, getShipping, getTax, getGrandTotal } = useCart()
  const subtotal = getCartTotal()

  if (cart.length === 0) return null

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 space-y-4 border border-neutral-100 dark:border-neutral-800">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-300">Subtotal</span>
          <span className="text-neutral-900 dark:text-white font-medium">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-300">Shipping</span>
          <span className={getShipping() === 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-neutral-900 dark:text-white font-medium"}>
            {getShipping() === 0 ? "Free" : `₹${getShipping()}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-300">Tax (12%)</span>
          <span className="text-neutral-900 dark:text-white font-medium">₹{getTax().toLocaleString()}</span>
        </div>
        {subtotal < 999 && subtotal > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
            Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
          </p>
        )}
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">Total</span>
          <span className="text-lg font-bold text-neutral-900 dark:text-white">₹{getGrandTotal().toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
