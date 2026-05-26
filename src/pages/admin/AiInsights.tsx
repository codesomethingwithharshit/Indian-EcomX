import { motion } from "framer-motion"

const insights = [
  { title: "Revenue Forecast", desc: "Projected 18% increase next week based on current momentum and upcoming collection drop.", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", glow: "from-purple-500/20 to-purple-600/10" },
  { title: "Top Performer", desc: "Premium Sneakers category driving 34% of total revenue. Consider expanding inventory.", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z", glow: "from-orange-500/20 to-orange-600/10" },
  { title: "Stock Alert", desc: "3 products running low on stock. Reorder recommendations ready for review.", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z", glow: "from-rose-500/20 to-rose-600/10" },
  { title: "Conversion Tip", desc: "Cart abandonment at 28%. A targeted email sequence could recover 12% of lost sales.", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", glow: "from-cyan-500/20 to-cyan-600/10" },
]

const recommendations = [
  "Increase ad spend on Instagram — highest ROAS channel at 4.1x",
  "Reorder Premium Sneakers — projected to sell out in 6 days",
  "Send cart recovery email — 28% abandonment rate this week",
  "Discount on Accessories — low conversion, test 15% off",
  "Expand T-Shirt inventory — trending +34% MoM",
]

export default function AdminAiInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">AI Insights</h2>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 animate-pulse">LIVE</span>
      </div>
      <p className="text-xs sm:text-sm text-white/30 -mt-4">AI-powered predictions and recommendations</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {insights.map((insight, i) => (
          <div key={insight.title} className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} /></svg>
              </div>
              <p className="text-sm font-semibold text-white/80 mb-2">{insight.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
        <p className="text-xs font-semibold text-white/80 mb-4">AI Recommendations</p>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-xs text-white/60 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}