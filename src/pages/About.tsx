import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

const stats = [
  { label: "Products Delivered", value: "50K+", icon: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
  { label: "Happy Customers", value: "25K+", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { label: "Cities Covered", value: "500+", icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" },
  { label: "Years of Excellence", value: "5+", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
]

const values = [
  { title: "Quality First", desc: "Every product undergoes rigorous quality checks to ensure it meets our premium standards before reaching you.", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
  { title: "Sustainable Practices", desc: "We are committed to ethical sourcing and eco-friendly packaging, reducing our environmental footprint.", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  { title: "Customer Obsession", desc: "Your satisfaction drives everything we do. From seamless shopping to hassle-free returns, we've got you covered.", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
]

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", avatar: "https://i.pravatar.cc/120?img=11", bio: "Visionary leader with 15+ years in fashion retail." },
  { name: "Priya Sharma", role: "Head of Design", avatar: "https://i.pravatar.cc/120?img=5", bio: "Award-winning designer formerly at NIFT." },
  { name: "Rahul Verma", role: "CTO", avatar: "https://i.pravatar.cc/120?img=3", bio: "Full-stack architect & ecommerce specialist." },
  { name: "Neha Patel", role: "Marketing Director", avatar: "https://i.pravatar.cc/120?img=9", bio: "Growth strategist behind 10x brand scaling." },
]

const timeline = [
  { year: "2021", title: "The Beginning", desc: "URBAN EDGE founded in Mumbai with a vision to redefine Indian streetwear." },
  { year: "2022", title: "First Milestone", desc: "Crossed 10,000 customers and expanded to 200+ cities across India." },
  { year: "2023", title: "Sustainable Shift", desc: "Launched eco-friendly packaging and ethical sourcing program." },
  { year: "2024", title: "Digital First", desc: "Revamped platform with AI-powered recommendations and virtual try-on." },
  { year: "2025", title: "Scaling Up", desc: "Partnered with 500+ artisans and launched exclusive designer drops." },
  { year: "2026", title: "Global Ready", desc: "Preparing for international expansion with 50K+ customers served." },
]

function TimelineAccordion() {
  const [openYear, setOpenYear] = useState(null)

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {timeline.map((item) => (
        <div key={item.year} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          <button
            onClick={() => setOpenYear(openYear === item.year ? null : item.year)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left"
          >
            <span className="text-xs font-bold text-amber-500 dark:text-amber-400 w-10 flex-shrink-0">{item.year}</span>
            <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">{item.title}</span>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${openYear === item.year ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <AnimatePresence>
            {openYear === item.year && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <div>
      <Helmet><title>About Us - Indian EcomX</title><meta name="description" content="Learn about Indian EcomX - your trusted online shopping destination. We offer quality products at the best prices." /></Helmet>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
              Crafting the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300">Indian Fashion</span>
            </h1>
            <p className="mt-6 text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              URBAN EDGE was born from a simple belief — that premium fashion should be accessible, sustainable, and deeply personal.
              We curate every piece with intention, blending timeless craftsmanship with contemporary design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 text-center group hover:border-amber-400/30 dark:hover:border-amber-400/20 transition-all duration-300"
            >
              <svg className="w-6 h-6 mx-auto text-amber-500/60 dark:text-amber-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mt-3">More Than Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Fashion</span></h2>
            <div className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>Founded in 2021, URBAN EDGE started as a small collective of designers and artisans passionate about redefining what Indian fashion means to the modern world. We saw a gap — between heritage craftsmanship and contemporary aesthetics — and set out to bridge it.</p>
              <p>Every product in our collection is handpicked for its quality, fit, and timeless appeal. We work directly with manufacturers who share our commitment to ethical practices and sustainable production.</p>
              <p>Today, we serve over 25,000 customers across 500+ cities, but our mission remains the same: to help you express your unique style with confidence.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400" alt="" className="rounded-2xl aspect-[3/4] object-cover" />
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" alt="" className="rounded-2xl aspect-[3/4] object-cover mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Our Values</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mt-3">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {values.map((val) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 text-left group hover:border-amber-400/30 dark:hover:border-amber-400/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors duration-300">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={val.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{val.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Accordion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Journey</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mt-3">Our Timeline</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Click each year to learn more about our milestones.</p>
        </div>
        <TimelineAccordion />
      </section>

      {/* Team */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mt-3">Meet the Founders</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-2xl object-cover mx-auto ring-2 ring-transparent group-hover:ring-amber-400/40 transition-all duration-300" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{member.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{member.role}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 leading-relaxed max-w-[140px] mx-auto">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white py-16 lg:py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Elevate Your Style?</h2>
            <p className="text-white/60 mt-3 max-w-md mx-auto text-sm">Explore our curated collection and find pieces that speak to you.</p>
            <Link to="/products" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-sm">
              Shop Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}