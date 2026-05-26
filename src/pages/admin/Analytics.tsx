import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"
import { useReviews } from "../../context/ReviewContext"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AdminAnalytics() {
  const { products } = useProducts()
  const { orders } = useOrders()
  const { reviews } = useReviews()

  const monthlyData = useMemo(() => {
    const revenue = {}
    const orderCount = {}
    orders.forEach(o => {
      if (!o.createdAt) return
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      revenue[key] = (revenue[key] || 0) + (o.total || 0)
      orderCount[key] = (orderCount[key] || 0) + 1
    })
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      months.push({
        label: monthNames[d.getMonth()],
        revenue: revenue[key] || 0,
        orders: orderCount[key] || 0,
      })
    }
    return months
  }, [orders])

  const maxMonthlyRevenue = useMemo(() => Math.max(...monthlyData.map(m => m.revenue), 1), [monthlyData])

  const categoryBreakdown = useMemo(() => {
    const map = {}
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    const total = products.length || 1
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
  }, [products])

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0"

  const ordersByStatus = useMemo(() => {
    const map = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => { if (map[o.status] !== undefined) map[o.status]++ })
    return map
  }, [orders])

  const deliveredOrders = useMemo(() => orders.filter(o => o.status === "delivered"), [orders])
  const itemsSold = useMemo(() => deliveredOrders.reduce((s, o) => s + (o.items?.length || 0), 0), [deliveredOrders])
  const cancelRate = totalOrders > 0 ? ((ordersByStatus.cancelled / totalOrders) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Analytics</h2><p className="text-xs sm:text-sm text-white/30 mt-1">In-depth metrics and growth trends</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { l: "Total Products", v: products.length.toLocaleString(), t: `${categoryBreakdown.length} categories` },
          { l: "Total Orders", v: totalOrders.toLocaleString(), t: `₹${(totalRevenue / 1000).toFixed(1)}k revenue` },
          { l: "Avg. Order Value", v: `₹${avgOrderValue.toFixed(0)}`, t: `${ordersByStatus.delivered} delivered` },
          { l: "Avg. Rating", v: avgRating, t: `${reviews.length} review${reviews.length !== 1 ? "s" : ""}` },
        ].map((m) => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className="text-xl font-bold text-white mt-1">{m.v}</p>
            <span className="text-xs font-medium text-white/40">{m.t}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <p className="text-xs font-semibold text-white/80 mb-4">Monthly Revenue (INR)</p>
          <div className="flex flex-col gap-3">
            {monthlyData.map((m, i) => {
              const pct = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0
              return (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40 w-8">{m.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
                  </div>
                  <span className="text-[10px] text-white/50 w-16 text-right tabular-nums">₹{(m.revenue / 1000).toFixed(1)}k</span>
                </div>
              )
            })}
            {monthlyData.every(m => m.revenue === 0) && (
              <p className="text-xs text-white/30 py-4 text-center">No order data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-white/80">Orders by Status</p>
            <span className="text-[10px] text-white/30">{totalOrders} total</span>
          </div>
          <div className="flex flex-col gap-3">
            {[{ l: "Pending", k: "pending", c: "#fbbf24" }, { l: "Confirmed", k: "confirmed", c: "#60a5fa" }, { l: "Shipped", k: "shipped", c: "#a855f7" }, { l: "Delivered", k: "delivered", c: "#34d399" }, { l: "Cancelled", k: "cancelled", c: "#fb7185" }].map(s => {
              const count = ordersByStatus[s.k]
              const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0
              return (
                <div key={s.k} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.c }} />
                  <span className="text-xs text-white/60 flex-1">{s.l}</span>
                  <span className="text-xs font-medium text-white/80">{count}</span>
                  <div className="w-20 sm:w-28 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.1 }} className="h-full rounded-full" style={{ background: s.c }} />
                  </div>
                </div>
              )
            })}
            {totalOrders === 0 && <p className="text-xs text-white/30 py-4 text-center">No orders yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-white/80">Product Categories</p>
            <span className="text-[10px] text-white/30">{products.length} products</span>
          </div>
          <div className="flex flex-col gap-3">
            {categoryBreakdown.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-white/60 flex-1 truncate">{c.name}</span>
                <span className="text-[10px] text-white/40">{c.count}</span>
                <div className="w-20 sm:w-28 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-400" />
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-xs text-white/30 py-4 text-center">No products yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <p className="text-xs font-semibold text-white/80 mb-4">Key Metrics</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { l: "Cancel Rate", v: `${cancelRate}%` },
              { l: "Items Delivered", v: itemsSold.toLocaleString() },
              { l: "Categories", v: categoryBreakdown.length.toLocaleString() },
              { l: "Avg Rating", v: avgRating },
            ].map((m) => (
              <div key={m.l} className="bg-white/[0.04] rounded-xl p-3">
                <p className="text-[10px] text-white/30">{m.l}</p>
                <p className="text-base font-bold text-white mt-0.5">{m.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <p className="text-[10px] text-white/30 mb-2">Monthly Order Volume</p>
            <div className="flex items-end gap-1 h-16">
              {monthlyData.map((m, i) => {
                const max = Math.max(...monthlyData.map(x => x.orders), 1)
                const h = (m.orders / max) * 100
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-0.5 group">
                    <span className="text-[8px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">{m.orders}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="w-full rounded-sm bg-gradient-to-t from-purple-500/60 to-orange-400/40" style={{ minHeight: m.orders > 0 ? "4px" : "0" }} />
                    <span className="text-[8px] text-white/30">{m.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
