import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../../context/ProductContext"

export default function AdminInventory() {
  const { products } = useProducts()

  const lowStock = useMemo(() => products.filter(p => p.stock < 20).sort((a, b) => a.stock - b.stock), [products])

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Inventory</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Stock levels across all products</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Total Stock", v: products.reduce((s, p) => s + p.stock, 0) },
          { l: "Low Stock", v: products.filter(p => p.stock < 15).length, c: "text-amber-400" },
          { l: "In Stock", v: products.filter(p => p.stock >= 15).length, c: "text-emerald-400" },
          { l: "Out of Stock", v: products.filter(p => p.stock === 0).length, c: "text-rose-400" },
        ].map(m => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className={`text-xl font-bold mt-1 ${m.c || "text-white"}`}>{m.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/80">Stock Status</p>
          <span className="text-[10px] text-amber-400">{lowStock.length} products need attention</span>
        </div>
        <div className="space-y-1">
          {lowStock.slice(0, 10).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
              <img src={p.images[0]} alt={p.title} className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-xs text-white/70 flex-1 truncate">{p.title}</span>
              <span className={`text-xs font-medium ${p.stock < 5 ? "text-rose-400" : "text-amber-400"}`}>{p.stock} units</span>
              <div className="w-20 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-500" style={{ width: `${Math.min(p.stock * 2, 100)}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}