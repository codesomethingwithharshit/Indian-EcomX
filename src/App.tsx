import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"
import { OrderProvider } from "./context/OrderContext"
import { ReviewProvider } from "./context/ReviewContext"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { ToastContainer } from "./components/Toast"
import { CartFlyout } from "./components/CartFlyout"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { OfferPopCard } from "./components/OfferPopCard"
import { AnnouncementBar } from "./components/AnnouncementBar"
import { WhatsAppWidget } from "./components/WhatsAppWidget"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Wishlist from "./pages/Wishlist"
import Admin from "./pages/Admin"
import About from "./pages/About"
import Contact from "./pages/Contact"
import FAQ from "./pages/FAQ"
import Privacy from "./pages/Privacy"
import Refund from "./pages/Refund"
import Terms from "./pages/Terms"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block text-[160px] sm:text-[200px] font-bold leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 dark:from-neutral-800 to-neutral-100 dark:to-neutral-900 select-none">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white -mt-6 mb-3">Page not found</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all text-sm font-medium hover:gap-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <ReviewProvider>
          <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors duration-300">
            <div className="bg-grain fixed inset-0 z-0 pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col">
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1 flex flex-col">
                <ErrorBoundary>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/analytics" element={<Navigate to="/admin" replace />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund" element={<Refund />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <CartFlyout />
              <OfferPopCard />
              <ToastContainer />
              <Footer />
            </div>
            <WhatsAppWidget />
          </div>
          </ReviewProvider>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}
