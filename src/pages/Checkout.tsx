import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { useCart } from "../context/CartContext"
import { useOrders } from "../context/OrderContext"
import { Button } from "../components/Button"
import { CartSummary } from "../components/CartSummary"
import { showToast } from "../hooks/useToast"
import { openRazorpayCheckout } from "../lib/razorpay"

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive" },
  { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", desc: "All major banks" },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, getCartTotal, getShipping, getTax, getGrandTotal } = useCart()
  const { placeOrder } = useOrders()
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" })
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState("cod")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = "Full name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email"
    if (!form.phone.trim()) errs.phone = "Phone is required"
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) errs.phone = "Enter valid 10-digit phone"
    if (!form.address.trim()) errs.address = "Address is required"
    if (!form.city.trim()) errs.city = "City is required"
    if (!form.state.trim()) errs.state = "State is required"
    if (!form.pincode.trim()) errs.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter valid 6-digit pincode"
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)

    if (payment === "cod") {
      await new Promise((r) => setTimeout(r, 2000))
      setLoading(false)
      placeOrder({
        customer: { ...form },
        items: [...cart],
        paymentMethod: payment,
        paymentDetails: null,
        subtotal: getCartTotal(),
        shipping: getShipping(),
        tax: getTax(),
        total: getGrandTotal(),
      })
      setSubmitted(true)
      clearCart()
      localStorage.setItem("lastOrderId", JSON.stringify(Date.now()))
      return
    }

    try {
      await openRazorpayCheckout({
        amount: getGrandTotal(),
        currency: "INR",
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        onSuccess: (paymentId, orderId, signature) => {
          placeOrder({
            customer: { ...form },
            items: [...cart],
            paymentMethod: payment,
            paymentDetails: { paymentId, orderId, signature },
            subtotal: getCartTotal(),
            shipping: getShipping(),
            tax: getTax(),
            total: getGrandTotal(),
          })
          setSubmitted(true)
          clearCart()
          localStorage.setItem("lastOrderId", JSON.stringify(Date.now()))
        },
        onFailure: (error) => {
          showToast(`Payment failed: ${error.description || "Please try again"}`, "error")
        },
      })
    } catch (err: any) {
      if (err.message !== "Payment cancelled") {
        showToast("Payment could not be processed. Please try again.", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !submitted) {
    const lastId = localStorage.getItem("lastOrderId")
    if (lastId) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <Helmet><title>Order Confirmed - Indian EcomX</title><meta name="description" content="Your order was placed successfully!" /></Helmet>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
            <div className="w-24 h-24 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Order Placed!</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Your order #ORD-{lastId} has been placed successfully.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/products"><Button variant="primary">Continue Shopping</Button></Link>
              <Link to="/"><Button variant="secondary">Back to Home</Button></Link>
            </div>
          </motion.div>
        </div>
      )
    }
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <Helmet><title>Shopping Cart - Indian EcomX</title><meta name="description" content="Your cart is empty. Start shopping!" /></Helmet>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">Add some items before checking out.</p>
        <Link to="/products"><Button variant="primary">Shop Now</Button></Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <Helmet><title>Order Confirmed - Indian EcomX</title><meta name="description" content="Your order has been placed successfully!" /></Helmet>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
          <div className="w-24 h-24 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-12 h-12 text-green-600 dark:text-green-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </motion.svg>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Order Placed!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Thank you for your order. You'll receive a confirmation shortly.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/products"><Button variant="primary">Continue Shopping</Button></Link>
            <Link to="/"><Button variant="secondary">Back to Home</Button></Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Helmet><title>Checkout - Indian EcomX</title><meta name="description" content="Complete your purchase at Indian EcomX. Secure checkout with COD, UPI, cards, and net banking." /></Helmet>
      <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        <Link to="/cart" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-neutral-600 dark:text-neutral-300">Checkout</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "fullName", label: "Full Name", type: "text", span: true, placeholder: "John Doe" },
                  { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                  { name: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
                  { name: "address", label: "Address", type: "text", span: true, placeholder: "123 Main Street" },
                  { name: "city", label: "City", type: "text", placeholder: "Mumbai" },
                  { name: "state", label: "State", type: "text", placeholder: "Maharashtra" },
                  { name: "pincode", label: "Pincode", type: "text", placeholder: "400001" },
                ].map((field) => (
                  <div key={field.name} className={field.span ? "sm:col-span-2" : ""}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{field.label}</label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all ${
                        errors[field.name] ? "border-red-300 dark:border-red-700" : "border-neutral-200 dark:border-neutral-700"
                      }`}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPayment(method.id)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${
                      payment === method.id
                        ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      payment === method.id ? "border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-600"
                    }`}>
                      {payment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{method.label}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <CartSummary />
            <motion.button
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  )
}
