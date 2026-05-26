import { useMemo } from "react"
import { motion } from "framer-motion"
import { useOrders } from "../../context/OrderContext"
import { useProducts } from "../../context/ProductContext"

function getInitials(name) {
  return (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

function CustomerMetrics({ label, value, trend }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
      <p className="text-xl font-bold text-white mt-1">{value}</p>
      <span className="text-xs font-medium text-emerald-400">{trend}</span>
    </div>
  )
}

export default function AdminCustomers() {
  const { orders } = useOrders()
  const { products } = useProducts()

  const customerMap = useMemo(() => {
    const map = new Map()
    orders.forEach(o => {
      const email = o.customer?.email || `guest-${o.id}`
      if (!map.has(email)) {
        map.set(email, { email, name: o.customer?.fullName || "Guest", city: o.customer?.city || "—", orders: 0, spent: 0 })
      }
      const entry = map.get(email)
      entry.orders++
      entry.spent += (o.total || 0)
    })
    return map
  }, [orders])

  const customers = useMemo(() =>
    Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent),
    [customerMap]
  )

  const totalCustomers = customers.length
  const totalSpent = customers.reduce((s, c) => s + c.spent, 0)
  const avgSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Customers</h2><p className="text-xs sm:text-sm text-white/30 mt-1">{totalCustomers.toLocaleString()} customers across India</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CustomerMetrics label="Total Customers" value={totalCustomers.toLocaleString()} trend={totalCustomers > 0 ? `Avg ₹${Math.round(avgSpent).toLocaleString()}/customer` : "—"} />
        <CustomerMetrics label="Total Orders" value={orders.length.toLocaleString()} trend={orders.length > 0 ? `${(orders.filter(o => o.status === "delivered").length / orders.length * 100).toFixed(0)}% delivered` : "—"} />
        <CustomerMetrics label="Products" value={products.length.toLocaleString()} trend={`${products.filter(p => p.stock > 0).length} in stock`} />
      </div>

      {customers.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 text-center">
          <p className="text-sm text-white/30">No customers yet. Orders placed on the site will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="hidden sm:flex items-center gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] uppercase tracking-wider text-white/30 font-medium">
            <span className="w-8" /><span className="flex-1">Name</span><span className="w-28">Email</span><span className="w-20">City</span><span className="w-20">Orders</span><span className="w-24">Total Spent</span>
          </div>
          {customers.map((c, i) => (
            <motion.div key={c.email} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">{getInitials(c.name)}</div>
              <span className="text-xs text-white/70 flex-1">{c.name}</span>
              <span className="text-[11px] text-white/40 w-28 hidden sm:block">{c.email}</span>
              <span className="text-[11px] text-white/40 w-20">{c.city}</span>
              <span className="text-[11px] text-white/40 w-20">{c.orders} order{c.orders !== 1 ? "s" : ""}</span>
              <span className="text-[11px] font-medium text-emerald-400 w-24">₹{c.spent.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
