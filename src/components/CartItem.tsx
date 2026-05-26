import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { QuantitySelector } from "./QuantitySelector"

export function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex gap-4 py-5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
      <Link to={`/products/${item.id}`} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <svg className="w-6 h-6 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        ) : (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.id}`}>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">{item.title}</h3>
        </Link>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.category}</p>
        {item.selectedSize && <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Size: {item.selectedSize}</p>}
        {item.selectedColor && <p className="text-xs text-neutral-400 dark:text-neutral-500">Color: {item.selectedColor}</p>}
        <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">₹{item.price.toLocaleString()}</p>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector quantity={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
          <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors p-1" aria-label={`Remove ${item.title}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>
  )
}
