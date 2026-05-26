import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"

function MetricCard({ label, value, trend, chartColor, trendUp = true, delay = 0 }) {
  const sparkData = useMemo(() => { const pts = [30, 45, 38, 52, 48, 62, 55, 70, 65, 78, 72, 85]; return trendUp ? pts : [...pts].reverse() }, [trendUp])
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
      className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-orange-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />
      <div className="relative z-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white mt-1 tabular-nums">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>{trendUp ? "+" : ""}{trend}%</span>
          <span className="text-[10px] text-white/30">vs last month</span>
        </div>
        <div className="mt-3 h-8">
          <svg viewBox="0 0 100 32" className="w-full h-full" preserveAspectRatio="none">
            <defs><linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColor} stopOpacity="0.3" /><stop offset="100%" stopColor={chartColor} stopOpacity="0" /></linearGradient></defs>
            <path d={`M0,32 L${sparkData.map((v, i) => `${(i / 11) * 100},${32 - ((v - 30) / 55) * 28}`).join(" ")} L100,32 Z`} fill={`url(#sg-${label})`} />
            <polyline points={sparkData.map((v, i) => `${(i / 11) * 100},${32 - ((v - 30) / 55) * 28}`).join(" ")} fill="none" stroke={chartColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

function TopProductRow({ product, rank }) {
  const growth = ((product.rating - 3) * 12 + 5).toFixed(0)
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: rank * 0.04 }}
      className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 group">
      <span className="text-xs font-bold text-white/20 w-5 text-right">{rank}</span>
      <img src={product.images[0]} alt={product.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0"><p className="text-xs sm:text-sm font-medium text-white/80 truncate">{product.title}</p><p className="text-[10px] text-white/30">{product.category}</p></div>
      <div className="text-right"><p className="text-xs sm:text-sm font-semibold text-white/80">₹{product.price.toLocaleString()}</p><p className="text-[10px] text-emerald-400">{growth}%</p></div>
    </motion.div>
  )
}

function LiveEvent({ event, index }) {
  const colorMap = { order: "bg-emerald-400", product: "bg-purple-400", alert: "bg-amber-400", customer: "bg-cyan-400", warning: "bg-rose-400" }
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative">
        <span className={`absolute inset-0 rounded-full ${colorMap[event.type] || "bg-white/20"} animate-ping opacity-60`} />
        <span className={`block w-1.5 h-1.5 rounded-full ${colorMap[event.type] || "bg-white/20"}`} />
      </span>
      <span className="text-xs text-white/60 truncate">{event.text}</span>
    </motion.div>
  )
}

export default function Dashboard() {
  const { products } = useProducts()
  const { orders } = useOrders()
  const [liveFeed, setLiveFeed] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const syncSubscribers = useCallback(() => {
    try { setSubscribers(JSON.parse(localStorage.getItem("admin-subscribers") || "[]")) } catch { setSubscribers([]) }
  }, [])
  useEffect(() => { syncSubscribers() }, [syncSubscribers])

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const now = new Date()
    const revenue = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
    const orderCount = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
    orders.forEach(o => {
      const day = days[new Date(o.createdAt).getDay()]
      if (revenue[day] !== undefined) {
        revenue[day] += o.total || 0
        orderCount[day]++
      }
    })
    const maxRev = Math.max(...Object.values(revenue), 1)
    return days.filter(d => d !== "Sun" || true).map(day => ({
      day, revenue: revenue[day], orders: orderCount[day],
      pct: (revenue[day] / (maxRev || 1)) * 100,
    }))
  }, [orders])

  const totalOrdersRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])

  useEffect(() => {
    if (orders.length === 0) {
      setLiveFeed([])
      return
    }
    const feed = orders.slice(0, 8).map((o, i) => ({
      id: o.id,
      text: `Order #ORD-${o.id} from ${o.customer?.city || "India"} — ₹${(o.total || 0).toLocaleString()}`,
      type: o.status === "cancelled" ? "warning" : o.status === "pending" ? "order" : "product",
    }))
    setLiveFeed(feed)
    const interval = setInterval(() => {
      if (orders.length === 0) return
      const randomOrder = orders[Math.floor(Math.random() * orders.length)]
      const newEvent = { id: Date.now(), text: `Order #ORD-${randomOrder.id} — ${randomOrder.customer?.city || "India"}`, type: "order" }
      setLiveFeed(prev => [newEvent, ...prev].slice(0, 8))
    }, 5000)
    return () => clearInterval(interval)
  }, [orders])

  const metrics = useMemo(() => {
    const delivered = orders.filter(o => o.status === "delivered").length
    const totalOrd = orders.length || 1
    return { totalRevenue: totalOrdersRevenue, totalOrders: orders.length, conversion: ((delivered / totalOrd) * 100).toFixed(1), returning: orders.length > 0 ? Math.round((delivered / totalOrd) * 100) : 0, avgOrder: orders.length > 0 ? (totalOrdersRevenue / orders.length).toFixed(0) : "0" }
  }, [orders, totalOrdersRevenue])

  const prevMonthOrders = useMemo(() => {
    const now = new Date()
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    return orders.filter(o => new Date(o.createdAt) <= monthAgo).length
  }, [orders])

  const trendPct = useMemo(() => {
    if (prevMonthOrders === 0) return 100
    const recentOrders = orders.length - prevMonthOrders
    return prevMonthOrders > 0 ? Math.round((recentOrders / prevMonthOrders) * 100) : 100
  }, [orders, prevMonthOrders])

  const prevMonthRevenue = useMemo(() => {
    const now = new Date()
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    return orders.filter(o => new Date(o.createdAt) <= monthAgo).reduce((s, o) => s + (o.total || 0), 0)
  }, [orders])

  const revenueTrend = useMemo(() => {
    if (prevMonthRevenue === 0) return 100
    const recent = totalOrdersRevenue - prevMonthRevenue
    return prevMonthRevenue > 0 ? Math.round((recent / prevMonthRevenue) * 100) : 100
  }, [totalOrdersRevenue, prevMonthRevenue])

  const topProducts = useMemo(() => [...products].sort((a, b) => (b.rating * b.stock) - (a.rating * a.stock)).slice(0, 6), [products])

  const lowStockProducts = useMemo(() => products.filter(p => p.stock <= 5).length, [products])

  const cityData = useMemo(() => {
    const cityMap = {}
    orders.forEach(o => {
      const city = o.customer?.city || "Unknown"
      cityMap[city] = (cityMap[city] || 0) + 1
    })
    const total = Object.values(cityMap).reduce((s, v) => s + v, 0) || 1
    return Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
  }, [orders])

  const revenueGrowthPct = useMemo(() => {
    const revs = weeklyData.map(d => d.revenue)
    const mid = Math.floor(revs.length / 2)
    const firstHalf = revs.slice(0, mid).reduce((s, v) => s + v, 0) || 1
    const secondHalf = revs.slice(mid).reduce((s, v) => s + v, 0)
    return ((secondHalf - firstHalf) / firstHalf * 100).toFixed(1)
  }, [weeklyData])

  const subscriberTrend = useMemo(() => {
    const now = new Date()
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    const old = subscribers.filter(s => new Date(s.subscribedAt) <= monthAgo).length
    if (old === 0) return subscribers.length > 0 ? 100 : 0
    return Math.round(((subscribers.length - old) / old) * 100)
  }, [subscribers])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Real-time performance metrics for your store</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard label="Total Revenue" value={`₹${(metrics.totalRevenue / 100000).toFixed(1)}L`} trend={revenueTrend} chartColor="#a855f7" delay={0} />
        <MetricCard label="Orders" value={metrics.totalOrders.toLocaleString()} trend={trendPct} chartColor="#f97316" delay={0.06} />
        <MetricCard label="Conversion Rate" value={`${metrics.conversion}%`} trend="2.1" chartColor="#22c55e" delay={0.12} />
        <MetricCard label="Delivered" value={`${metrics.returning}%`} trend="5.7" chartColor="#06b6d4" delay={0.18} />
        <MetricCard label="Avg Order Value" value={`₹${Number(metrics.avgOrder).toLocaleString()}`} trend="3.4" chartColor="#ec4899" delay={0.24} />
        <MetricCard label="Subscribers" value={subscribers.length.toLocaleString()} trend={subscriberTrend} chartColor="#eab308" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-xs font-semibold text-white/80">Revenue Growth</p><p className="text-[11px] text-white/30">Weekly performance (INR)</p></div>
            <span className="text-[11px] text-emerald-400 font-medium">{revenueGrowthPct > 0 ? "+" : ""}{revenueGrowthPct}%</span>
          </div>
          <div className="h-40 sm:h-48 flex items-end gap-1 sm:gap-2">
            {weeklyData.map((d) => {
              const h = d.pct || 0
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">₹{(d.revenue / 1000).toFixed(1)}k</span>
                  <div className="w-full rounded-lg bg-white/[0.04] relative overflow-hidden" style={{ height: "100%" }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: weeklyData.indexOf(d) * 0.08 }}
                      className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-purple-600/60 to-orange-500/40 group-hover:from-purple-500/80 group-hover:to-orange-500/60 transition-all duration-300" />
                  </div>
                  <span className="text-[9px] text-white/30">{d.day}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div><p className="text-xs font-semibold text-white/80">Top Cities</p><p className="text-[11px] text-white/30">Customer distribution by city</p></div>
          <div className="flex flex-col gap-3 mt-4">
            {cityData.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No order data yet.</p>
            ) : cityData.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-orange-400" />
                <span className="text-xs text-white/60 flex-1">{c.name}</span>
                <span className="text-xs font-medium text-white/80">{c.pct}%</span>
                <div className="w-24 sm:w-32 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.8, delay: cityData.indexOf(c) * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        <p className="text-xs font-semibold text-white/80">AI Insights</p>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300">LIVE</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: "Revenue", desc: `${totalOrdersRevenue > 0 ? `₹${totalOrdersRevenue.toLocaleString()}` : "No"} revenue from ${orders.length} order${orders.length !== 1 ? "s" : ""}.`, icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", glow: "from-purple-500/20 to-purple-600/10" },
          { title: "Top Product", desc: topProducts[0] ? `${topProducts[0].title} — ₹${topProducts[0].price.toLocaleString()}` : "No products yet.", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z", glow: "from-orange-500/20 to-orange-600/10" },
          { title: "Stock Alert", desc: `${lowStockProducts} product${lowStockProducts !== 1 ? "s" : ""} running low on stock (≤5).`, icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z", glow: "from-rose-500/20 to-rose-600/10" },
          { title: "Conversion Rate", desc: `${metrics.conversion}% of orders delivered. ${subscribers.length} newsletter subscriber${subscribers.length !== 1 ? "s" : ""}.`, icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", glow: "from-cyan-500/20 to-cyan-600/10" },
        ].map((insight, i) => (
          <div key={insight.title} className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} /></svg>
              </div>
              <p className="text-xs font-semibold text-white/80 mb-1">{insight.title}</p>
              <p className="text-[11px] text-white/40 leading-relaxed">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4"><div><p className="text-xs font-semibold text-white/80">Top Products</p><p className="text-[11px] text-white/30">Best performing items this month</p></div></div>
        <div className="space-y-0.5">{topProducts.map((p, i) => <TopProductRow key={p.id} product={p} rank={i + 1} />)}</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-xs font-semibold text-white/80">Newsletter Subscribers</p><p className="text-[11px] text-white/30">Recently subscribed emails</p></div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/40 font-mono">{subscribers.length} total</span>
              {subscribers.length > 0 && (
                <>
                  <button onClick={() => { const csv = "data:text/csv;charset=utf-8,Email,Date Subscribed\n" + subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`).join("\n"); const a = document.createElement("a"); a.href = encodeURI(csv); a.download = "subscribers.csv"; a.click(); }}
                    className="p-1.5 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Export CSV">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </button>
                  <button onClick={() => { if (window.confirm("Delete ALL subscribers? This cannot be undone.")) { localStorage.removeItem("admin-subscribers"); setSubscribers([]) } }}
                    className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete All">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-xs text-white/30 py-6 text-center">No subscribers yet.</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {[...subscribers].reverse().slice(0, 20).map((s, i) => (
                <div key={s.email} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-purple-400 flex-shrink-0">
                    {s.email.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 truncate">{s.email}</p>
                    <p className="text-[10px] text-white/30">{new Date(s.subscribedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><p className="text-xs font-semibold text-white/80">Live Activity</p><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /></div>
            <span className="text-[10px] text-white/30">Real-time</span>
          </div>
          <div className="space-y-1">{liveFeed.map((ev, i) => <LiveEvent key={ev.id} event={ev} index={i} />)}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-5"><div><p className="text-xs font-semibold text-white/80">Customer Intelligence</p><p className="text-[11px] text-white/30">Demographics & behaviour</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Top Cities</p><div className="space-y-2">
            {cityData.length === 0 ? (
              <p className="text-xs text-white/30 py-4">No data yet.</p>
            ) : cityData.map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-16">{c.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                </div>
                <span className="text-[10px] text-white/60 w-6 text-right">{c.pct}%</span>
              </div>
            ))}
          </div></div>
          <div><p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Orders by Status</p><div className="space-y-2">
            {[{ label: "Pending", filter: "pending", color: "bg-amber-400" }, { label: "Confirmed", filter: "confirmed", color: "bg-blue-400" }, { label: "Shipped", filter: "shipped", color: "bg-purple-400" }, { label: "Delivered", filter: "delivered", color: "bg-emerald-400" }, { label: "Cancelled", filter: "cancelled", color: "bg-rose-400" }].map(s => {
              const count = orders.filter(o => o.status === s.filter).length
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" />
                  <span className="text-[10px] text-white/40 w-16">{s.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: s.filter === "pending" ? "#fbbf24" : s.filter === "confirmed" ? "#60a5fa" : s.filter === "shipped" ? "#a855f7" : s.filter === "delivered" ? "#34d399" : "#fb7185" }} />
                  </div>
                  <span className="text-[10px] text-white/60 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div></div>
          <div><p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Products</p><div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Total</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">{products.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Low Stock</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${products.length > 0 ? (lowStockProducts / products.length) * 100 : 0}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">{lowStockProducts}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Categories</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">{new Set(products.map(p => p.category)).size}</span>
            </div>
          </div></div>
          <div><p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Orders</p><div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Total</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">{orders.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Revenue</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">₹{(totalOrdersRevenue / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Subscribers</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
              </div>
              <span className="text-[10px] text-white/60 w-6 text-right">{subscribers.length}</span>
            </div>
          </div></div>
        </div>
      </div>
    </div>
  )
}
