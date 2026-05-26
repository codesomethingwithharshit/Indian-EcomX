import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"

const sections = [
  {
    title: "Acceptance of Terms",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    content: "By accessing or using URBAN EDGE, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services. We reserve the right to update these terms at any time without prior notice."
  },
  {
    title: "Account Registration",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    content: "When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately of any unauthorized use."
  },
  {
    title: "Orders and Payments",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
    content: "All orders are subject to availability and acceptance. We reserve the right to cancel any order for any reason. Prices are listed in Indian Rupees (INR) and include applicable taxes. Payment must be received before order processing begins."
  },
  {
    title: "Shipping and Delivery",
    icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
    content: "Estimated delivery times are provided for reference only. We are not responsible for delays caused by shipping carriers or unforeseen circumstances. Risk of loss passes to you upon delivery. Please inspect packages immediately upon receipt."
  },
  {
    title: "Returns and Refunds",
    icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3",
    content: "We accept returns within 15 days of delivery for unworn items with original tags. Refunds are processed within 5-7 business days after we receive the returned item. Customized and sale items are final sale unless defective."
  },
  {
    title: "Intellectual Property",
    icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125",
    content: "All content on this website including logos, images, text, and designs is the property of URBAN EDGE and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent."
  },
  {
    title: "Limitation of Liability",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    content: "URBAN EDGE shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid for the product or service giving rise to the claim."
  },
  {
    title: "Governing Law",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    content: "These terms are governed by the laws of India. Any disputes shall be resolved through arbitration in Mumbai, Maharashtra. Both parties agree to submit to the exclusive jurisdiction of courts in Mumbai."
  },
  {
    title: "Contact Us",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    content: "For questions about these Terms of Service, please contact us at legal@urbanedge.in or write to URBAN EDGE, BKC, Mumbai — 400051, India."
  }
]

export default function Terms() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div>
      <Helmet><title>Terms & Conditions - Indian EcomX</title><meta name="description" content="Terms and conditions for using Indian EcomX." /></Helmet>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">Legal</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4">Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Service</span></h1>
            <p className="mt-4 text-white/60 max-w-lg mx-auto text-sm">Last updated: May 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
          Please read these Terms of Service carefully before using the URBAN EDGE website or making a purchase.
          By accessing our platform, you agree to be bound by these terms.
        </p>

        <div className="space-y-2">
          {sections.map((section, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={section.title}
                className={`bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-amber-300/40 dark:border-amber-400/30 shadow-lg shadow-amber-500/5"
                    : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 sm:px-6 text-left gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-amber-100 dark:bg-amber-500/20"
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}>
                      <svg className={`w-4 h-4 transition-colors duration-300 ${
                        isOpen ? "text-amber-600 dark:text-amber-400" : "text-neutral-400"
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                      </svg>
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                      isOpen ? "text-amber-600 dark:text-amber-400" : "text-neutral-900 dark:text-white"
                    }`}>{section.title}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                      isOpen ? "rotate-180 text-amber-500" : "text-neutral-400"
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
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{section.content}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}