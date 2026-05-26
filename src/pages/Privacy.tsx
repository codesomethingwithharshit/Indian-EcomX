import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sections = [
  {
    title: "Information We Collect",
    icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
    content: "When you create an account, place an order, or contact us, we collect personal information such as your name, email address, phone number, shipping address, and payment details. We also collect browsing data including pages visited and products viewed to improve your shopping experience."
  },
  {
    title: "How We Use Your Information",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
    content: "We use your information to process and fulfill your orders, communicate with you about your purchases, send promotional offers (with your consent), improve our website and services, and comply with legal obligations. We never sell your personal data to third parties."
  },
  {
    title: "Data Protection",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    content: "We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your personal information. Your payment data is processed directly by our PCI-compliant payment partners and is never stored on our servers."
  },
  {
    title: "Cookies",
    icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    content: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our website."
  },
  {
    title: "Third-Party Services",
    icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z",
    content: "We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, delivering orders, and sending communications. These providers are contractually obligated to protect your data and use it only for the services they provide."
  },
  {
    title: "Your Rights",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    content: "You have the right to access, correct, or delete your personal data at any time. You can update your account information directly through your profile settings or contact us at privacy@urbanedge.in for assistance. You may also opt out of marketing communications at any time."
  },
  {
    title: "Data Retention",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    content: "We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account information is retained until you request deletion. Order data is retained for tax and accounting purposes as required by Indian regulations."
  },
  {
    title: "Changes to This Policy",
    icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
    content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and, where appropriate, via email. Continued use of our services after changes constitutes acceptance of the updated policy."
  },
  {
    title: "Contact Us",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    content: "If you have any questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer at privacy@urbanedge.in or write to us at URBAN EDGE, BKC, Mumbai — 400051, India."
  }
]

export default function Privacy() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">Legal</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4">Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Policy</span></h1>
            <p className="mt-4 text-white/60 max-w-lg mx-auto text-sm">Last updated: May 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
          At URBAN EDGE, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you visit our website or make a purchase.
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