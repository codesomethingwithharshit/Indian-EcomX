import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

const OFFER_KEY = "ue-offer-shown"
const SHOW_DELAY = 3000

function getEndDate() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString()
}

function getRemaining(end) {
  const diff = new Date(end).getTime() - Date.now()
  if (diff <= 0) return { h: 0, m: 0, s: 0 }
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export function OfferPopCard() {
  const [open, setOpen] = useState(false)
  const [end] = useState(getEndDate)
  const [left, setLeft] = useState(getRemaining(end))

  useEffect(() => {
    if (sessionStorage.getItem(OFFER_KEY)) return
    const t = setTimeout(() => setOpen(true), SHOW_DELAY)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const iv = setInterval(() => setLeft(getRemaining(end)), 1000)
    return () => clearInterval(iv)
  }, [open, end])

  const dismiss = () => { setOpen(false); sessionStorage.setItem(OFFER_KEY, "1") }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
          <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-neutral-900/5 dark:bg-white/5 rounded-full blur-3xl" />
              <button onClick={dismiss} className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="relative px-7 pt-9 pb-7 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/10 dark:bg-white/10 text-neutral-900 dark:text-white text-[11px] font-semibold tracking-wider mb-5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  LIMITED OFFER
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-7 h-7 text-neutral-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-6.75-3h.008v.008h-.008V15zm0-3h.008v.008h-.008V12zm0-3h.008v.008H9.75V9zm-3.75 0h.008v.008H6V9zm0 3h.008v.008H6V12zm0 3h.008v.008H6V15z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1.5">FLAT 20% OFF</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">on your first order. Use code <span className="font-mono font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">URBAN20</span></p>
                <div className="flex items-center justify-center gap-3 mb-5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Ends in
                  </span>
                  {[
                    { v: left.h, l: "Hrs" },
                    { v: left.m, l: "Min" },
                    { v: left.s, l: "Sec" },
                  ].map((u) => (
                    <div key={u.l} className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-900 dark:text-white">{String(u.v).padStart(2, "0")}</div>
                      <span className="text-[10px] text-neutral-500 mt-0.5">{u.l}</span>
                    </div>
                  ))}
                </div>
                <Link to="/products" onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <button onClick={dismiss} className="mt-3 text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">No thanks</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
