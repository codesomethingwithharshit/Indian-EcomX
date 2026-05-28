import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../hooks/useTheme"

const curatedLinks = [
  { to: "/products", label: "Shop All" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
]

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
  },
  {
    label: "Twitter",
    href: "#",
    icon: <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M24 12.073c0-5.436-4.546-9.866-10.15-9.866-5.603 0-10.15 4.43-10.15 9.866 0 4.912 3.557 8.996 8.25 9.832v-6.958H9.432V12.07h2.518V9.827c0-2.5 1.473-3.874 3.726-3.874 1.08 0 2.207.195 2.207.195v2.44h-1.243c-1.224 0-1.607.767-1.607 1.555v1.868h2.734l-.437 2.857h-2.297v6.958c4.694-.836 8.25-4.92 8.25-9.832z" />,
  },
]

const socialBtnClass = "flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-sm transition-all duration-300"

export function Footer() {
  const { visualTheme, isDark } = useTheme()
  const isLatest = visualTheme === "latest"

  const adminSocialLinks = (() => {
    try { return JSON.parse(localStorage.getItem("admin-social-links") || "[]") } catch { return [] }
  })()
  const displaySocials = adminSocialLinks.length > 0
    ? adminSocialLinks.map((l) => ({ label: l.platform, href: l.url, icon: socialLinks.find((s) => s.label.toLowerCase() === l.platform.toLowerCase())?.icon || <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /> }))
    : socialLinks

  return (
    <footer
      className="premium-footer"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="footer-glow-cyan" />
      <div className="footer-glow-violet" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-14 lg:pt-16 pb-10 lg:pb-12">
          {/* Brand + Description */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            <div className="max-w-md">
              <Link to="/" className="group inline-block">
                <span className={`text-xl font-bold tracking-tight ${
                  isLatest
                    ? "bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 dark:from-amber-300 dark:via-orange-400 dark:to-rose-300 bg-clip-text text-transparent"
                }`}>
                  URBAN{" "}
                  <span className="font-light">EDGE</span>
                </span>
              </Link>
              <p className={`mt-2 text-sm leading-relaxed max-w-sm ${
                isLatest ? (isDark ? "text-white/30" : "text-neutral-500") : "text-white/40"
              }`}>
                Elevating modern Indian streetwear through premium craftsmanship and futuristic design.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {curatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
                    isLatest
                      ? (isDark ? "text-white/40 hover:text-white/70" : "text-neutral-500/70 hover:text-neutral-900/80") + " after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500"
                      : "text-white/40 hover:text-amber-400/90 after:bg-gradient-to-r after:from-amber-500 after:to-orange-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2.5 mt-8 lg:mt-6">
            {displaySocials.map((s) => {
              const label = s.label.toLowerCase()
              const brandColor = {
                instagram: "#e1306c",
                twitter: "#1da1f2",
                youtube: "#ff0000",
                facebook: "#1877f2",
                pinterest: "#e60023",
                tiktok: "#00f2ea",
                linkedin: "#0a66c2",
                whatsapp: "#25d366",
                telegram: "#0088cc",
                discord: "#5865f2",
                github: "#333",
                dribbble: "#ea4c89",
                behance: "#1769ff",
                snapchat: "#fffc00",
                threads: "#000000",
              }[label]
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  className={`${socialBtnClass}`}
                  style={{
                    borderColor: brandColor ? `${brandColor}44` : "rgba(255,255,255,0.1)",
                    color: brandColor ? brandColor : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { if (brandColor) { e.currentTarget.style.background = `${brandColor}18`; e.currentTarget.style.boxShadow = `0 0 24px ${brandColor}44`; e.currentTarget.style.borderColor = brandColor } }}
                  onMouseLeave={(e) => { if (brandColor) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${brandColor}44` } }}
                  aria-label={s.label}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Gradient Divider */}
        <div className="footer-divider" />

        {/* Copyright + Terms */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className={`text-[11px] tracking-[0.06em] ${
            isLatest ? (isDark ? "text-white/15" : "text-neutral-400") : "text-white/20"
          }`}>
            &copy; 2026 URBAN EDGE. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/terms" className={`text-[11px] tracking-[0.06em] transition-all duration-200 ${
              isLatest
                ? (isDark ? "text-white/15 hover:text-white/40" : "text-neutral-400 hover:text-neutral-900/80")
                : "text-white/20 hover:text-amber-400/80"
            }`}>Terms</Link>
            <Link to="/privacy" className={`text-[11px] tracking-[0.06em] transition-all duration-200 ${
              isLatest
                ? (isDark ? "text-white/15 hover:text-white/40" : "text-neutral-400 hover:text-neutral-900/80")
                : "text-white/20 hover:text-amber-400/80"
            }`}>Privacy</Link>
            <Link to="/contact" className={`text-[11px] tracking-[0.06em] transition-all duration-200 ${
              isLatest
                ? (isDark ? "text-white/15 hover:text-white/40" : "text-neutral-400 hover:text-neutral-900/80")
                : "text-white/20 hover:text-amber-400/80"
            }`}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}