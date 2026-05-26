import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"

export default function AdminMarketing() {
  const { products } = useProducts()
  const { orders } = useOrders()

  const subscribers = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("admin-subscribers") || "[]") } catch { return [] }
  }, [])

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])
  const deliveredOrders = useMemo(() => orders.filter(o => o.status === "delivered"), [orders])
  const deliveredRevenue = useMemo(() => deliveredOrders.reduce((s, o) => s + (o.total || 0), 0), [deliveredOrders])
  const conversionRate = orders.length > 0 ? ((deliveredOrders.length / orders.length) * 100).toFixed(1) : "0"

  const topCategory = useMemo(() => {
    const map = {}
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : null
  }, [products])

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Marketing</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Campaign performance & channel analytics</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Total Orders", v: orders.length.toLocaleString() },
          { l: "Conversion Rate", v: `${conversionRate}%` },
          { l: "Delivered Revenue", v: `₹${(deliveredRevenue / 1000).toFixed(1)}k` },
          { l: "Subscribers", v: subscribers.length.toLocaleString() },
        ].map(m => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className="text-xl font-bold text-white mt-1">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Order Channels (by Status)</p>
        <div className="flex flex-col gap-3">
          {[
            { ch: "Pending", count: orders.filter(o => o.status === "pending").length, rev: orders.filter(o => o.status === "pending").reduce((s, o) => s + (o.total || 0), 0), color: "from-amber-400 to-yellow-400" },
            { ch: "Confirmed", count: orders.filter(o => o.status === "confirmed").length, rev: orders.filter(o => o.status === "confirmed").reduce((s, o) => s + (o.total || 0), 0), color: "from-blue-400 to-blue-500" },
            { ch: "Shipped", count: orders.filter(o => o.status === "shipped").length, rev: orders.filter(o => o.status === "shipped").reduce((s, o) => s + (o.total || 0), 0), color: "from-purple-400 to-purple-500" },
            { ch: "Delivered", count: deliveredOrders.length, rev: deliveredRevenue, color: "from-emerald-400 to-emerald-500" },
            { ch: "Cancelled", count: orders.filter(o => o.status === "cancelled").length, rev: orders.filter(o => o.status === "cancelled").reduce((s, o) => s + (o.total || 0), 0), color: "from-rose-400 to-rose-500" },
          ].filter(c => c.count > 0).map((c, i) => {
            const maxCount = Math.max(...orders.length > 0 ? [1, ...orders.map(() => 1)] : [1])
            const pct = orders.length > 0 ? (c.count / orders.length) * 100 : 0
            return (
              <motion.div key={c.ch} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                <span className="text-xs font-medium text-white/70 w-20">{c.ch}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} className={`h-full rounded-full bg-gradient-to-r ${c.color}`} />
                </div>
                <span className="text-[11px] text-white/40 w-16 text-right tabular-nums">{c.count}</span>
                <span className="text-[11px] text-white/40 w-20 text-right tabular-nums">₹{(c.rev / 1000).toFixed(1)}k</span>
              </motion.div>
            )
          })}
          {orders.length === 0 && <p className="text-xs text-white/30 py-4 text-center">No orders yet.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Product Stats</p>
          <p className="text-lg font-bold text-white">{products.length}</p>
          <p className="text-xs text-white/40 mt-0.5">Total products in catalog</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Top Category</p>
          <p className="text-lg font-bold text-white">{topCategory ? topCategory.name : "—"}</p>
          <p className="text-xs text-white/40 mt-0.5">{topCategory ? `${topCategory.count} product${topCategory.count !== 1 ? "s" : ""} in category` : "No data"}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Avg Order Value</p>
          <p className="text-lg font-bold text-white">₹{orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : "0"}</p>
          <p className="text-xs text-white/40 mt-0.5">Across {orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  )
}
