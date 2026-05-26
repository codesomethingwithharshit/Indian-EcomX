import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

const categories = [
  {
    category: "Orders & Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), and Net Banking from all major Indian banks." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled within 24 hours of placement for a full refund. After that, the order may already be processed for shipping." },
      { q: "Do you have a loyalty program?", a: "Yes! Join URBAN EDGE Rewards to earn points on every purchase. Members get early access to new drops, exclusive discounts, and birthday rewards." },
    ],
  },
  {
    category: "Shipping & Delivery",
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days across India. Orders above ₹999 qualify for free shipping. Express shipping is available at checkout for an additional ₹199." },
      { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking link via email and SMS. You can also track your order from the Order History section in your account dashboard." },
      { q: "Do you ship internationally?", a: "Currently, we ship only within India. We're working on expanding to international markets soon. Sign up for our newsletter to stay updated!" },
    ],
  },
  {
    category: "Returns & Exchanges",
    faqs: [
      { q: "What is your return policy?", a: "We offer easy returns within 15 days of delivery. Items must be unworn, unwashed, and with tags attached. Once received, refunds are processed within 5–7 business days." },
      { q: "Can I exchange my order for a different size?", a: "Yes! Free size exchanges are available within 7 days of delivery. We'll arrange a pickup and send the replacement size at no extra cost." },
    ],
  },
  {
    category: "Support & Trust",
    faqs: [
      { q: "Are the products genuine?", a: "Absolutely. Every product on URBAN EDGE is sourced directly from verified manufacturers and undergoes strict quality checks before being listed." },
      { q: "How can I contact customer support?", a: "You can reach us via email at support@urbanedge.in, call us at +91 1800-123-4567 (Mon–Sat, 10 AM – 7 PM), or use the Contact form on our website." },
    ],
  },
]

function AccordionGroup({ items, defaultOpen = false }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen ? 0 : null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className={`bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-300 ${
            isOpen
              ? "border-amber-300/40 dark:border-amber-400/30 shadow-lg shadow-amber-500/5"
              : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
          }`}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 sm:px-6 text-left gap-3"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  isOpen
                    ? "bg-amber-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                }`}>{i + 1}</span>
                <span className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                  isOpen
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-neutral-900 dark:text-white"
                }`}>{item.q}</span>
              </div>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 text-amber-500"
                    : "text-neutral-400"
                }`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-4">
                    <div className="h-px bg-gradient-to-r from-amber-400/30 via-amber-500/20 to-transparent mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(categories[0].category)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute top-20 left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">Support</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Questions</span></h1>
            <p className="mt-4 text-white/60 max-w-lg mx-auto text-sm">Everything you need to know about shopping at URBAN EDGE.</p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                activeCategory === cat.category
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <AccordionGroup items={categories.find((c) => c.category === activeCategory)?.faqs || []} defaultOpen />
          </motion.div>
        </AnimatePresence>

        {/* Still have questions */}
        <div className="mt-12 text-center bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Still have questions?</p>
          <Link to="/contact" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            Contact our support team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}