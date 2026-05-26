import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { useOrders } from "../context/OrderContext"
import { showToast } from "../hooks/useToast"

const contactInfo = [
  {
    label: "Email",
    value: "support@urbanedge.in",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  },
  {
    label: "Phone",
    value: "+91 1800-123-4567",
    icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
  },
  {
    label: "Address",
    value: "URBAN EDGE HQ, BKC, Mumbai — 400051, India",
    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  },
  {
    label: "Hours",
    value: "Mon–Sat, 10 AM – 7 PM IST",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
]

export default function Contact() {
  const { addEnquiry } = useOrders()
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email"
    if (!form.subject.trim()) errs.subject = "Subject is required"
    if (!form.message.trim()) errs.message = "Message is required"
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    addEnquiry({ ...form })
    setSent(true)
    showToast("Message sent successfully!", "success")
  }

  return (
    <div>
      <Helmet><title>Contact Us - Indian EcomX</title><meta name="description" content="Get in touch with Indian EcomX." /></Helmet>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute top-20 left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">Get in Touch</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4">Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Us</span></h1>
            <p className="mt-4 text-white/60 max-w-lg mx-auto text-sm">Have a question, concern, or just want to say hello? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Message Sent!</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">We'll respond within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); setErrors({}) }}
                    className="mt-6 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 sm:p-8 space-y-5"
                >
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Send us a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Name *</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.name
                            ? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
                            : "border-neutral-200/60 dark:border-neutral-700/60 focus:ring-amber-500/20 focus:border-amber-500/30"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.email
                            ? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
                            : "border-neutral-200/60 dark:border-neutral-700/60 focus:ring-amber-500/20 focus:border-amber-500/30"
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Subject *</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.subject
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
                          : "border-neutral-200/60 dark:border-neutral-700/60 focus:ring-amber-500/20 focus:border-amber-500/30"
                      }`}
                      placeholder="Order inquiry"
                    />
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Message *</label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        errors.message
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
                          : "border-neutral-200/60 dark:border-neutral-700/60 focus:ring-amber-500/20 focus:border-amber-500/30"
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 p-5 flex items-start gap-4 group hover:border-amber-400/30 dark:hover:border-amber-400/20 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors duration-300">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-[0.08em]">{item.label}</p>
                  <p className="text-sm text-neutral-900 dark:text-white mt-0.5">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-32 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden"
            >
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto text-neutral-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-[11px] text-neutral-400">BKC, Mumbai</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}