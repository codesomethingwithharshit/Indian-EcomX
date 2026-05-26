import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"

export default function AdminAnalytics() {
  const { products } = useProducts()

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Analytics</h2><p className="text-xs sm:text-sm text-white/30 mt-1">In-depth metrics and growth trends</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[{ l: "Page Views", v: "847.2K", t: "+23.1%" }, { l: "Sessions", v: "392.5K", t: "+18.7%" }, { l: "Bounce Rate", v: "32.4%", t: "-4.2%" }, { l: "Avg. Session", v: "4m 12s", t: "+8.6%" }].map((m) => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className="text-xl font-bold text-white mt-1">{m.v}</p>
            <span className={`text-xs font-medium ${m.t.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>{m.t}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Monthly Comparison</p>
        <div className="flex flex-col gap-3">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => {
            const val = 40 + Math.sin(i * 0.8) * 25 + 15
            return (
              <div key={m} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-8">{m}</span>
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
                </div>
                <span className="text-[10px] text-white/50 w-12 text-right">₹{(val * 420).toFixed(0)}k</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
