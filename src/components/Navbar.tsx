import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../hooks/useWishlist"
import { useTheme } from "../hooks/useTheme"
import { useAuth } from "../hooks/useAuth"

const defaultNavLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

function loadNavLinks() {
  try {
    const saved = localStorage.getItem("admin-nav-links")
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return defaultNavLinks
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { getCartCount } = useCart()
  const { wishlist } = useWishlist()
  const { isDark, toggleTheme, visualTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const isPremium = visualTheme === "premium"
  const isLatest = visualTheme === "latest"
  const iconColor = isLatest
    ? (isDark ? "text-cyan-400/80" : "text-cyan-600")
    : "text-amber-600/80 dark:text-amber-400/80"
  const iconHover = isLatest
    ? (isDark ? "hover:bg-white/5 hover:text-cyan-300" : "hover:bg-black/5 hover:text-cyan-700")
    : "hover:bg-amber-500/10 hover:text-amber-500"
  const navLinks = loadNavLinks()
  const storeLogo = localStorage.getItem("admin-store-logo")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navBg = scrolled || menuOpen
    ? "bg-white/80 dark:bg-neutral-950/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_rgba(255,255,255,0.03)]"
    : "bg-transparent"

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 premium-navbar ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="relative group">
            {storeLogo ? (
              <img src={storeLogo} alt="URBAN EDGE" className="h-8 md:h-9 w-auto object-contain" />
            ) : (
              <span className={`text-xl font-bold tracking-tight ${
                isLatest
                  ? "bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 dark:from-amber-300 dark:via-orange-400 dark:to-rose-300 bg-clip-text text-transparent"
              }`}>
                URBAN{" "}
                <span className="font-light">EDGE</span>
              </span>
            )}
            {(isPremium || isLatest) && !storeLogo && (
              <span className={`absolute -bottom-0.5 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                isLatest
                  ? "bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                  : "bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
              }`} />
            )}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? isLatest
                        ? "text-cyan-300"
                        : "text-amber-600 dark:text-amber-400"
                      : isLatest
                        ? "text-white/50 hover:text-cyan-300/80 hover:bg-white/5"
                        : "text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute -bottom-0 left-2 right-2 h-[2px] rounded-full ${
                        isLatest
                          ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
                          : isPremium
                            ? "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                            : "bg-neutral-900 dark:bg-white"
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 ${iconColor} ${iconHover}`}
                aria-label="Toggle theme"
            >
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </motion.div>
            </motion.button>

            <Link
              to="/wishlist"
              className={`relative p-2.5 rounded-xl transition-all duration-300 ${iconColor} ${iconHover}`}
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center ${
                      isLatest
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  }`}
                  style={{ width: 18, height: 18 }}
                >
                  {wishlist.length}
                </motion.span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-1">
                <span className={`text-sm font-medium px-2 ${
  isLatest
    ? (isDark ? "text-white/60" : "text-neutral-600")
    : "text-neutral-500 dark:text-neutral-300"
}`}>{user.name}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isLatest
                      ? (isDark
                        ? "text-white/50 hover:text-red-400 hover:bg-red-500/10"
                        : "text-neutral-500 hover:text-red-500 hover:bg-red-500/10")
                      : "text-neutral-500 dark:text-neutral-300 hover:text-red-400 hover:bg-red-500/10"
                  }`}
                  aria-label="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:inline-flex p-2.5 rounded-xl transition-all duration-300 ${iconColor} ${iconHover}`}
                aria-label="Sign In"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}

            <Link
              to="/cart"
              className={`relative p-2.5 rounded-xl transition-all duration-300 ${iconColor} ${iconHover}`}
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center ${
                      isLatest
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 premium-cart-badge"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 premium-cart-badge"
                    }`}
                    style={{ width: 18, height: 18 }}
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${iconColor} ${iconHover}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden premium-navbar border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? isLatest
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : isLatest
                        ? "text-white/50 hover:bg-white/5 hover:text-cyan-300"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user ? (
                  <div className={`flex items-center justify-between px-4 py-3 rounded-xl mt-2 ${
                      isLatest ? "bg-white/5" : "bg-neutral-100 dark:bg-neutral-800/50"
                    }`}>
                    <span className={`text-sm font-medium ${
                      isLatest ? "text-white/70" : "text-neutral-800 dark:text-neutral-300"
                    }`}>{user.name}</span>
                    <button
                      onClick={() => { logout(); setMenuOpen(false) }}
                      className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isLatest
                        ? "text-white/50 hover:bg-white/5 hover:text-cyan-300"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isLatest
                      ? "text-white/50 hover:bg-white/5 hover:text-cyan-300"
                      : "text-neutral-800 dark:text-neutral-200 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
                >
                  Wishlist ({wishlist.length})
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
