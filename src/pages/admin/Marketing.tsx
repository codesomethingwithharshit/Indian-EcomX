import { motion } from "framer-motion"

export default function AdminMarketing() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl sm:text-2xl font-bold text-white">Marketing</h2><p className="text-xs sm:text-sm text-white/30 mt-1">Campaign performance & channel analytics</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ l: "Active Campaigns", v: "12" }, { l: "Impressions", v: "2.4M" }, { l: "Click-Through", v: "4.8%" }, { l: "ROAS", v: "3.2x" }].map(m => (
          <div key={m.l} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30">{m.l}</p>
            <p className="text-xl font-bold text-white mt-1">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">Channel Performance</p>
        <div className="flex flex-col gap-3">
          {[
            { ch: "Instagram", spend: "₹45K", conv: 320, roas: "4.1x", pct: 85 },
            { ch: "Google Ads", spend: "₹62K", conv: 480, roas: "3.8x", pct: 78 },
            { ch: "Email", spend: "₹12K", conv: 190, roas: "6.2x", pct: 92 },
            { ch: "Facebook", spend: "₹38K", conv: 210, roas: "2.9x", pct: 62 },
          ].map((c, i) => (
            <motion.div key={c.ch} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
              <span className="text-xs font-medium text-white/70 w-20">{c.ch}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-500" />
              </div>
              <span className="text-[11px] text-white/40 w-20 text-right">{c.spend}</span>
              <span className="text-[11px] text-white/40 w-24 text-right">{c.conv} conv.</span>
              <span className="text-xs font-semibold text-emerald-400 w-10 text-right">{c.roas}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}