import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const sections = [
  {
    title: "15-Day Return Policy",
    content: "We want you to love every purchase. If you're not completely satisfied, you can return any item within 15 days of delivery for a full refund. Items must be unworn, unwashed, and in their original condition with all tags attached."
  },
  {
    title: "Eligibility",
    content: "To be eligible for a return, your item must be in the same condition that you received it — unworn or unused, with tags, and in its original packaging. Items marked as 'Final Sale' cannot be returned. We also require a receipt or proof of purchase."
  },
  {
    title: "How to Initiate a Return",
    content: "To start a return, log into your account and navigate to Order History, or contact our support team at returns@urbanedge.in. We'll provide a return authorization and shipping instructions. Please do not send items back without first contacting us."
  },
  {
    title: "Refund Process",
    content: "Once we receive and inspect your return, we'll notify you of the approval or rejection. Approved refunds will be processed within 5–7 business days and credited to your original payment method. COD orders will be refunded via bank transfer — please provide your bank details."
  },
  {
    title: "Free Size Exchanges",
    content: "If your item doesn't fit, we offer free size exchanges within 7 days of delivery. We'll arrange a pickup for the original item and ship the replacement size at no additional cost. Size exchanges are subject to stock availability."
  },
  {
    title: "Damaged or Incorrect Items",
    content: "If you receive a damaged, defective, or incorrect item, please contact us immediately at support@urbanedge.in with your order number and photos of the issue. We'll arrange a free pickup and send a replacement or issue a full refund, including any shipping charges."
  },
  {
    title: "Non-Returnable Items",
    content: "Certain items cannot be returned, including: gift cards, downloadable software products, intimate apparel, and items marked as 'Final Sale' or 'Non-Returnable' on the product page. Please check the product page before purchasing."
  },
  {
    title: "Shipping Costs for Returns",
    content: "Return shipping is free for exchanges or if the item is damaged/incorrect. For change-of-mind returns, a nominal return shipping fee of ₹99 will be deducted from your refund. Original shipping charges are non-refundable."
  },
  {
    title: "Contact Us",
    content: "For any questions about our refund policy, please contact our customer support team at support@urbanedge.in or call +91 1800-123-4567. We're here to help!"
  }
]

export default function Refund() {
  return (
    <div>
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Policy</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4">Refund & Returns</h1>
            <p className="mt-4 text-white/60 max-w-lg mx-auto text-sm">Last updated: May 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
          At URBAN EDGE, customer satisfaction is our top priority. If you're not happy with your purchase, 
          we're here to make it right. Please review our refund and return policy below.
        </p>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6"
            >
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{section.title}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Need help with a return?</p>
          <Link to="/contact" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            Contact Support
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
