import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"

export default function AdminRevenue() {
  const { products } = useProducts()
  const totalRevenue = useMemo(() => products.reduce((s, p) => s + p.price * (p.stock < 20 ? 80 - p.stock : p.stock), 0), [products])

  const categoryRevenue = [
    { cat: "Accessories", pct: 28 }, { cat: "Hoodies", pct: 22 }, { cat: "Shoes", pct: 18 },
    { cat: "T-Shirts", pct: 15 }, { cat: "Jeans", pct: 10 }, { cat: "Others", pct: 7 },
  ]

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Revenue</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Total revenue: ₹{(totalRevenue / 100000).toFixed(1)}L</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Net Revenue", v: `₹${(totalRevenue / 100000).toFixed(1)}L` },
          { l: "Gross Profit", v: `₹${((totalRevenue * 0.42) / 100000).toFixed(1)}L` },
          { l: "Expenses", v: `₹${((totalRevenue * 0.28) / 100000).toFixed(1)}L` },
          { l: "Net Margin", v: "42%" },
        ].map(m => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className="text-xl font-bold text-white mt-1">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Revenue by Category</p>
        <div className="flex flex-col gap-3">
          {categoryRevenue.map((c, i) => (
            <div key={c.cat} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-24">{c.cat}</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
              </div>
              <span className="text-xs text-white/50 w-12 text-right">{c.pct}%</span>
              <span className="text-[11px] text-white/30 w-16 text-right">₹{(totalRevenue * c.pct / 100 / 100000).toFixed(1)}L</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Monthly Revenue</p>
        <div className="flex items-end gap-2 sm:gap-3 h-32">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => {
            const h = 30 + Math.sin(i * 0.8) * 20 + i * 5
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-white/30">₹{(h * 12).toFixed(0)}k</span>
                <div className="w-full rounded-lg bg-white/[0.04] relative overflow-hidden" style={{ height: "100%" }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-purple-600/60 to-orange-500/40" />
                </div>
                <span className="text-[9px] text-white/30">{m}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}