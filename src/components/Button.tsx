import { motion } from "framer-motion"

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl cursor-pointer text-sm relative overflow-hidden"

  const variants = {
    primary: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 px-6 py-3",
    secondary: "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white px-6 py-3",
    outline: "bg-transparent text-neutral-900 dark:text-white border border-neutral-900 dark:border-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 px-6 py-3",
    ghost: "bg-transparent text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-4 py-2",
    danger: "bg-red-500 hover:bg-red-600 text-white px-6 py-3",
    premium: "premium-btn premium-btn-primary px-6 py-3",
    shimmer: "premium-btn-shimmer px-6 py-3",
    glass: "premium-btn premium-btn-secondary px-6 py-3",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
