import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AdminRevenue() {
  const { products } = useProducts()
  const { orders } = useOrders()

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])
  const productValue = useMemo(() => products.reduce((s, p) => s + p.price * p.stock, 0), [products])
  const deliveredRevenue = useMemo(() => orders.filter(o => o.status === "delivered").reduce((s, o) => s + (o.total || 0), 0), [orders])
  const pendingRevenue = useMemo(() => orders.filter(o => o.status === "pending").reduce((s, o) => s + (o.total || 0), 0), [orders])

  const categoryRevenue = useMemo(() => {
    const map = {}
    products.forEach(p => {
      const val = p.price * p.stock
      map[p.category] = (map[p.category] || 0) + val
    })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, val]) => ({ name, val, pct: Math.round((val / total) * 100) }))
  }, [products])

  const monthlyRevenue = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      if (!o.createdAt) return
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      map[key] = (map[key] || 0) + (o.total || 0)
    })
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      months.push({ label: monthNames[d.getMonth()], revenue: map[key] || 0 })
    }
    return months
  }, [orders])

  const maxMonthlyRev = useMemo(() => Math.max(...monthlyRevenue.map(m => m.revenue), 1), [monthlyRevenue])

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Revenue</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Total revenue: ₹{(totalRevenue / 100000).toFixed(1)}L from {orders.length} orders</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Total Revenue", v: `₹${(totalRevenue / 100000).toFixed(1)}L` },
          { l: "Delivered", v: `₹${(deliveredRevenue / 100000).toFixed(1)}L` },
          { l: "Pending", v: `₹${(pendingRevenue / 100000).toFixed(1)}L` },
          { l: "Inventory Value", v: `₹${(productValue / 100000).toFixed(1)}L` },
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
          {categoryRevenue.length === 0 ? (
            <p className="text-xs text-white/30 py-4 text-center">No products yet.</p>
          ) : categoryRevenue.map((c, i) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-24 truncate">{c.name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
              </div>
              <span className="text-xs text-white/50 w-12 text-right">{c.pct}%</span>
              <span className="text-[11px] text-white/30 w-16 text-right tabular-nums">₹{(c.val / 100000).toFixed(1)}L</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Monthly Revenue</p>
        <div className="flex items-end gap-2 sm:gap-3 h-32">
          {monthlyRevenue.map((m, i) => {
            const h = maxMonthlyRev > 0 ? (m.revenue / maxMonthlyRev) * 100 : 0
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">₹{(m.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-lg bg-white/[0.04] relative overflow-hidden" style={{ height: "100%" }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-purple-600/60 to-orange-500/40" />
                </div>
                <span className="text-[9px] text-white/30">{m.label}</span>
              </div>
            )
          })}
          {monthlyRevenue.every(m => m.revenue === 0) && (
            <div className="w-full text-center"><p className="text-xs text-white/30 py-8">No order data yet.</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
