import { useState, useMemo, useRef, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../context/ProductContext"
import { useOrders } from "../context/OrderContext"
import { useReviews } from "../context/ReviewContext"
import { useTheme } from "../hooks/useTheme"
import { ProductFormModal } from "../components/ProductFormModal"
import { showToast } from "../hooks/useToast"
import { loadSections, saveSections as saveHomeSections, loadCustomSections, getSectionTypes } from "../lib/sections"
const AdminDashboard = lazy(() => import("./admin/Dashboard"))
const AdminAnalytics = lazy(() => import("./admin/Analytics"))
const AdminCustomers = lazy(() => import("./admin/Customers"))
const AdminRevenue = lazy(() => import("./admin/Revenue"))
const AdminInventory = lazy(() => import("./admin/Inventory"))
const AdminMarketing = lazy(() => import("./admin/Marketing"))
const AdminAiInsights = lazy(() => import("./admin/AiInsights"))

const ADMIN_USER = "admin"
const ADMIN_PASS = "admin123"

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("admin-authenticated", "true"); onLogin()
    } else setError("Invalid credentials")
  }
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[20%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-md mx-auto px-4 py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Login</h1>
        <p className="text-sm text-white/40 text-center mb-6">Enter credentials</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError("") }}
              className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all" placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError("") }}
              className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all" placeholder="admin123" />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit"
            className="w-full py-3 bg-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.12] transition-colors">Sign In</button>
        </form>
        </motion.div>
      </div>
    </div>
  )
}

function CsvImport({ onImport, label, expectedHeaders }) {
  const fileRef = useRef(null)
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
        if (lines.length < 2) { showToast("CSV must have a header row + data rows", "error"); return }
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
        const missing = expectedHeaders.filter((h) => !headers.includes(h))
        if (missing.length) { showToast(`Missing columns: ${missing.join(", ")}`, "error"); return }
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(",").map((v) => v.trim())
          const obj = {}
          headers.forEach((h, i) => { obj[h] = vals[i] || "" })
          return obj
        })
        onImport(rows)
        showToast(`Imported ${rows.length} rows`, "success")
      } catch { showToast("Failed to parse CSV", "error") }
    }
    reader.readAsText(file)
    e.target.value = ""
  }
  return (
    <div className="mt-4">
      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 text-indigo-400 text-sm font-medium rounded-xl cursor-pointer hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
        {label}
        <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      </label>
    </div>
  )
}

const defaultSection = { name: "", description: "", productIds: [] }

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("admin-authenticated") === "true")

  const { products, addProduct, editProduct, deleteProduct, resetProducts } = useProducts()
  const { orders, enquiries, updateOrderStatus, markEnquiryReplied, editEnquiry, deleteEnquiry, updateOrder, statuses } = useOrders()
  const { reviews, addReview, updateReview, deleteReview, approveReview, importReviews } = useReviews()
  const { visualTheme, switchVisualTheme } = useTheme()

  const [tab, setTab] = useState("products")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [search, setSearch] = useState("")

  const [sections, setSections] = useState(() => { try { return JSON.parse(localStorage.getItem("admin-sections") || "[]") } catch { return [] } })
  const [sectionForm, setSectionForm] = useState(defaultSection)
  const [editingSection, setEditingSection] = useState(null)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const saveSections = (updated) => { setSections(updated); localStorage.setItem("admin-sections", JSON.stringify(updated)) }
  const [homeSections, setHomeSections] = useState(() => loadSections())
  const [showAddSection, setShowAddSection] = useState(false)
  const availableTypes = getSectionTypes()
  const customSections = loadCustomSections()
  const usedTypes = new Set(homeSections.map((s) => s.type))
  const [editingSlider, setEditingSlider] = useState(null)
  const [sliderForm, setSliderForm] = useState({ headline: "", productIds: [] })

  const [fbMeta, setFbMeta] = useState(() => { try { return JSON.parse(localStorage.getItem("admin-meta") || '{"pixel":"","instagram":""}') } catch { return { pixel: "", instagram: "" } } })
  const [storeConfig, setStoreConfig] = useState(() => { try { return JSON.parse(localStorage.getItem("admin-store-config") || '{"name":"URBAN EDGE","currency":"INR","taxRate":"5","shippingRate":"99","email":"store@urbanedge.com","phone":"+919760971378","announcement":"Free shipping on orders above ₹999!"}') } catch { return { name: "URBAN EDGE", currency: "INR", taxRate: "5", shippingRate: "99", email: "store@urbanedge.com", phone: "+919760971378", announcement: "Free shipping on orders above ₹999!" } } })
  const [maintenanceMode, setMaintenanceMode] = useState(() => localStorage.getItem("admin-maintenance") === "true")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingEnquiry, setEditingEnquiry] = useState(null)
  const [storeLogo, setStoreLogo] = useState(() => localStorage.getItem("admin-store-logo") || "")
  const [navLinksConfig, setNavLinksConfig] = useState(() => { try { return JSON.parse(localStorage.getItem("admin-nav-links") || "[]") } catch { return [] } })
  const [navLinkForm, setNavLinkForm] = useState({ to: "", label: "" })
  const [editingNavLink, setEditingNavLink] = useState(null)
  const [showNavLinkForm, setShowNavLinkForm] = useState(false)

  const builtinThemeDefs = [
    { id: "premium-builtin", name: "Premium", isBuiltin: true, accentH: "258", accentS: "76%", accentL: "62%", bgDark: "#0a0814", bgLight: "#ffffff", textDark: "#ffffff", textLight: "#0f172a", cardBg: "linear-gradient(135deg, rgba(15,12,25,0.95), rgba(20,15,40,0.98))", glassBg: "rgba(10,8,20,0.95)", fontFamily: "Inter, sans-serif", baseSize: "16px", transitionDuration: "300ms", hoverLift: "6px", borderRadius: "16px" },
    { id: "latest-builtin", name: "Latest", isBuiltin: true, accentH: "190", accentS: "100%", accentL: "50%", bgDark: "#050505", bgLight: "#ffffff", textDark: "#ffffff", textLight: "#0f172a", cardBg: "#111114", glassBg: "rgba(17,17,20,0.95)", fontFamily: "Inter, sans-serif", baseSize: "16px", transitionDuration: "300ms", hoverLift: "8px", borderRadius: "16px" },
  ]

  const defaultThemeForm = {
    name: "", accentH: "190", accentS: "100%", accentL: "50%",
    bgDark: "#050505", bgLight: "#ffffff", textDark: "#ffffff", textLight: "#0f172a",
    cardBg: "#111114", glassBg: "rgba(17,17,20,0.95)",
    fontFamily: "Inter, sans-serif", baseSize: "16px",
    transitionDuration: "300ms", hoverLift: "6px", borderRadius: "16px",
  }
  const [savedThemes, setSavedThemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin-custom-themes") || "[]") } catch { return [] }
  })
  const [activeCustomTheme, setActiveCustomTheme] = useState(() => {
    return localStorage.getItem("admin-active-custom-theme") || ""
  })
  const [themeForm, setThemeForm] = useState(defaultThemeForm)
  const [editingTheme, setEditingTheme] = useState(null)
  const [showThemeForm, setShowThemeForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collections, setCollections] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin-collections") || "[]") } catch { return [] }
  })
  const [collectionForm, setCollectionForm] = useState({ name: "", description: "", image: "", productIds: [] })
  const [editingCollection, setEditingCollection] = useState(null)
  const [showCollectionForm, setShowCollectionForm] = useState(false)

  const navIcon = (id) => ({
    dashboard: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    analytics: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.25c.621 0 1.125.504 1.125 1.125v10.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h2.25zM16.5 4.5c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125h2.25z",
    orders: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    customers: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    products: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    sections: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    reviews: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
    revenue: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    enquiries: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    marketing: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    ai: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
    theme: "M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88a1.125 1.125 0 011.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 8.197l-2.88 2.88",
    settings: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.395.764.82.854.527.112 1.016.314 1.46.596.213.136.456.173.686.1l.855-.27c.53-.167 1.1.056 1.33.555l.383.852c.23.5.03 1.1-.46 1.346l-.716.36c-.339.17-.543.543-.487.93.068.462.068.938 0 1.4-.056.387.148.76.487.93l.716.36c.49.246.69.847.46 1.346l-.383.852c-.23.5-.8.722-1.33.555l-.855-.27c-.23-.073-.473-.036-.686.1a4.2 4.2 0 01-1.46.596c-.425.09-.75.43-.82.854l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.395-.764-.82-.854a4.2 4.2 0 01-1.46-.596c-.213-.136-.456-.173-.686-.1l-.855.27c-.53.168-1.1-.056-1.33-.555l-.383-.853c-.23-.5-.03-1.1.46-1.346l.716-.36c-.339-.17-.543-.543.487-.93a3.6 3.6 0 010-1.4c.056-.387-.148-.76-.487-.93l-.716-.36c-.49-.246-.69-.847-.46-1.346l.383-.852c.23-.5.8-.722 1.33-.555l.855.27c.23.073.473.036.686-.1a4.2 4.2 0 011.46-.596c.425-.09.75-.43.82-.854l-.149-.894z",
  }[id] || "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4")

  const [socialLinksConfig, setSocialLinksConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin-social-links") || "[]") } catch { return [] }
  })
  const [socialForm, setSocialForm] = useState({ platform: "", url: "", icon: "link" })
  const [editingSocial, setEditingSocial] = useState(null)
  const [showSocialForm, setShowSocialForm] = useState(false)

  const subscribersCount = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("admin-subscribers") || "[]").length } catch { return 0 }
  }, [])
  const stats = useMemo(() => [
    { label: "Total Products", value: products.length },
    { label: "Orders", value: orders.length },
    { label: "Enquiries", value: enquiries.length },
    { label: "Reviews", value: reviews.length },
    { label: "Subscribers", value: subscribersCount },
  ], [products, orders, enquiries, reviews, subscribersCount])

  const filtered = useMemo(() => products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())), [products, search])

  useEffect(() => {
    const existing = document.getElementById("admin-custom-theme-style")
    if (existing) existing.remove()
    if (!activeCustomTheme) return
    const theme = savedThemes.find((t) => t.id === activeCustomTheme)
    if (!theme || !theme.css) return
    const currentTheme = document.documentElement.getAttribute("data-theme") || "latest"
    const style = document.createElement("style")
    style.id = "admin-custom-theme-style"
    style.textContent = `[data-theme="${currentTheme}"] { ${theme.css} }`
    document.head.appendChild(style)
    return () => {
      const s = document.getElementById("admin-custom-theme-style")
      if (s) s.remove()
    }
  }, [activeCustomTheme, savedThemes])

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />

  const handleAdd = () => { setEditingProduct(null); setModalOpen(true) }
  const handleEdit = (product) => { setEditingProduct(product); setModalOpen(true) }
  const handleDelete = (product) => { if (window.confirm(`Delete "${product.title}"?`)) { deleteProduct(product.id); showToast(`"${product.title}" deleted`, "info") } }
  const handleSubmit = (formData) => {
    if (editingProduct) { editProduct({ ...formData, id: editingProduct.id }); showToast(`"${formData.title}" updated`, "success") }
    else { addProduct(formData); showToast(`"${formData.title}" added`, "success") }
    setModalOpen(false); setEditingProduct(null)
  }

  const handleSaveSection = () => {
    if (!sectionForm.name.trim()) { showToast("Section name is required", "error"); return }
    if (editingSection) { const updated = sections.map((s) => s.id === editingSection.id ? { ...sectionForm, id: editingSection.id } : s); saveSections(updated); showToast(`Section updated`, "success") }
    else { saveSections([...sections, { ...sectionForm, id: Date.now() }]); showToast(`Section created`, "success") }
    setShowSectionForm(false); setSectionForm(defaultSection); setEditingSection(null)
  }
  const handleDeleteSection = (sec) => { if (window.confirm(`Delete section "${sec.name}"?`)) { saveSections(sections.filter((s) => s.id !== sec.id)); showToast(`Section deleted`, "info") } }

  const handleCsvProducts = (rows) => {
    rows.forEach((r) => {
      addProduct({
        title: r.title || "Untitled",
        price: Number(r.price) || 0,
        category: r.category || "General",
        description: r.description || "",
        rating: Number(r.rating) || 4,
        stock: Number(r.stock) || 10,
        images: (r.images || "").split(";").filter(Boolean),
        sizes: (r.sizes || "S,M,L,XL").split(",").filter(Boolean),
        colors: (r.colors || "Black,White").split(",").filter(Boolean),
        featured: r.featured === "true",
      })
    })
  }

  const handleCsvReviews = (rows) => {
    importReviews(rows.map((r) => ({
      productId: Number(r.productid) || 0,
      name: r.name || "Anonymous",
      email: r.email || "",
      rating: Number(r.rating) || 5,
      text: r.text || "",
      date: r.date || "",
      approved: r.approved === "true",
    })))
  }

  const saveTheme = (form, oldId) => {
    const h = parseInt(form.accentH) || 190
    const s = form.accentS || "100%"
    const l = form.accentL || "50%"
    const lNum = parseInt(l) || 50
    const css = `
      --theme-accent-h: ${h};
      --theme-accent-s: ${s};
      --theme-accent-l: ${l};
      --theme-glow: 0 0 60px hsl(${h},${s},${l},0.12), 0 0 120px hsl(${h},${s},${l},0.04);
      --theme-glow-color: hsl(${h},${s},${l},0.1);
      --theme-border-glow: 0 0 0 1px hsl(${h},${s},${l},0.15);
      --theme-card-bg: ${form.cardBg};
      --theme-glass-bg: ${form.glassBg};
      --theme-glass-border: rgba(255,255,255,0.06);
      --theme-gradient-primary: linear-gradient(135deg, ${form.bgDark}, #0b0b0f, ${form.bgDark});
      --theme-gradient-secondary: linear-gradient(135deg, ${form.bgDark}, #08080c);
      --theme-gradient-accent: linear-gradient(135deg, hsl(${h},${s},${l}), hsl(${h},${s},${Math.round(lNum * 0.7)}%));
      --theme-gradient-warm: linear-gradient(135deg, hsl(${h},${s},${l}), hsl(${h + 60},${s},${l}));
      --theme-gradient-cool: linear-gradient(135deg, hsl(${h + 40},${s},${l}), hsl(${h + 80},${s},${l}));
      --theme-shadow-sm: 0 1px 3px hsl(${h},${s},${l},0.06);
      --theme-shadow-md: 0 4px 20px hsl(${h},${s},${l},0.1);
      --theme-shadow-lg: 0 8px 40px hsl(${h},${s},${l},0.15);
      --theme-shadow-xl: 0 20px 80px hsl(${h},${s},${l},0.2);
      --theme-animate-duration: ${form.transitionDuration};
    `
    const theme = { ...form, id: oldId || `theme-${Date.now()}`, css }
    const updated = oldId
      ? savedThemes.map((t) => t.id === oldId ? theme : t)
      : [...savedThemes, theme]
    setSavedThemes(updated)
    localStorage.setItem("admin-custom-themes", JSON.stringify(updated))
    showToast(oldId ? "Theme updated" : "Theme created", "success")
    return theme
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "orders", label: "Orders", count: orders.length },
    { id: "customers", label: "Customers" },
    { id: "products", label: "Products", count: products.length },
    { id: "sections", label: "Sections", count: sections.length },
    { id: "collections", label: "Collections", count: collections.length },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "revenue", label: "Revenue" },
    { id: "inventory", label: "Inventory" },
    { id: "enquiries", label: "Enquiries", count: enquiries.length },
    { id: "marketing", label: "Marketing" },
    { id: "ai", label: "AI Insights" },
    { id: "theme", label: "Theme" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <div className="h-full bg-[#08080c] overflow-x-hidden relative" style={{ isolation: 'isolate' }}>
      {/* Ambient glow layers */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,60,255,0.08), transparent), radial-gradient(ellipse 50% 60% at 80% 20%, rgba(255,140,0,0.06), transparent), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(255,140,0,0.04), transparent)' }}>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/4 rounded-full blur-[200px]" />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      <div className="flex h-screen relative z-10">
        {/* Mobile overlay - inside stacking context so sidebar (z-30) stacks above it */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 lg:hidden z-20" onClick={() => setSidebarOpen(false)} />}

        {/* ====== Sidebar ====== */}
        <aside className={`fixed lg:relative inset-y-0 left-0 z-30 flex flex-col w-56 bg-[#0a0a0e]/98 backdrop-blur-2xl border-r border-white/[0.06] transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

          {/* Logo */}
          <div className="flex items-center h-12 px-3 border-b border-white/[0.05] flex-shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 shadow-lg shadow-amber-600/20">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <span className="ml-2 text-sm font-bold text-white/90 tracking-tight">Urban Edge</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5 scrollbar-thin">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  tab === t.id
                    ? "text-white bg-gradient-to-r from-purple-500/12 to-orange-500/8 border border-white/[0.06] shadow-sm"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={navIcon(t.id)} />
                </svg>
                <span className="truncate">{t.label}</span>
                {t.count !== undefined && (
                  <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none ${
                    tab === t.id ? "bg-white/[0.12] text-white/90" : "bg-white/[0.05] text-white/40"
                  }`}>{t.count}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom: Theme pills + Sign out */}
          <div className="px-2 py-2 border-t border-white/[0.05] space-y-1.5">
            <div className="flex items-center gap-1">
              {[{id:"premium",label:"Premium",grad:"from-amber-500/20 to-orange-500/20",border:"border-amber-500/30",txt:"text-amber-400",dot:"bg-amber-400"},{id:"latest",label:"Latest",grad:"from-cyan-500/20 to-blue-500/20",border:"border-cyan-500/30",txt:"text-cyan-400",dot:"bg-cyan-400"},{id:"custom",label:"Custom",grad:"from-purple-500/20 to-violet-500/20",border:"border-purple-500/30",txt:"text-purple-400",dot:"bg-purple-400"}].map((t) => (
                <button key={t.id} onClick={() => switchVisualTheme(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all border ${
                    visualTheme === t.id
                      ? `${t.grad} ${t.border} ${t.txt} shadow-sm`
                      : "border-transparent text-white/20 hover:text-white/40"
                  }`}>
                  {visualTheme === t.id && <span className={`w-1 h-1 rounded-full ${t.dot}`} />}
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => { setAuthenticated(false); sessionStorage.removeItem("admin-authenticated") }}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium text-white/30 hover:text-rose-400 hover:bg-rose-500/8 rounded-lg transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ====== Main Content Area ====== */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative" style={{ isolation: 'isolate' }}>
          {/* Top Bar */}
          <header className="flex-shrink-0 flex items-center gap-3 px-4 lg:px-6 h-12 border-b border-white/[0.05] bg-white/[0.02] backdrop-blur-xl">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 -ml-1 text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.05] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-white/95 tracking-tight truncate">{tabs.find(t => t.id === tab)?.label || "Dashboard"}</h1>
              <p className="text-xs text-white/25 mt-0.5 truncate font-medium tracking-wide">
                {tab === "dashboard" && "Store performance at a glance"}
                {tab === "analytics" && "Traffic and engagement metrics"}
                {tab === "orders" && "Manage customer orders"}
                {tab === "customers" && "Customer insights and history"}
                {tab === "products" && "Manage product catalog"}
                {tab === "sections" && "Homepage section builder"}
                {tab === "collections" && "Product collections (like Shopify)"}
                {tab === "reviews" && "Customer reviews management"}
                {tab === "revenue" && "Financial performance"}
                {tab === "inventory" && "Stock and inventory tracking"}
                {tab === "enquiries" && "Contact form submissions"}
                {tab === "marketing" && "Campaign performance"}
                {tab === "ai" && "AI-powered insights"}
                {tab === "theme" && "Visual theme customization"}
                {tab === "settings" && "Store configuration"}
              </p>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {tab === "products" && (
              <button onClick={handleAdd} className="px-3.5 py-2 bg-gradient-to-r from-purple-500/15 to-orange-500/15 hover:from-purple-500/25 hover:to-orange-500/25 text-white text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-white/[0.06]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}
            {tab === "sections" && (
              <button onClick={() => setShowAddSection(!showAddSection)} className="px-3.5 py-2 bg-gradient-to-r from-purple-500/15 to-orange-500/15 hover:from-purple-500/25 hover:to-orange-500/25 text-white text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-white/[0.06]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                <span className="hidden sm:inline">Add Section</span>
              </button>
            )}
            {tab === "collections" && (
              <button onClick={() => { setCollectionForm({ name: "", description: "", image: "", productIds: [] }); setEditingCollection(null); setShowCollectionForm(true) }} className="px-3.5 py-2 bg-gradient-to-r from-purple-500/15 to-orange-500/15 hover:from-purple-500/25 hover:to-orange-500/25 text-white text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-white/[0.06]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                <span className="hidden sm:inline">Add Collection</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" /></div>}>
        {tab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 overflow-hidden hover:border-white/[0.1] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] to-orange-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />
                  <div className="relative z-[1]">
                    <p className="text-xs text-white/35 font-semibold uppercase tracking-[0.1em]">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-2 tabular-nums tracking-tight">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <AdminDashboard />
          </>
        )}
        {tab === "analytics" && <AdminAnalytics />}
        {tab === "customers" && <AdminCustomers />}
        {tab === "revenue" && <AdminRevenue />}
        {tab === "inventory" && <AdminInventory />}
        {tab === "marketing" && <AdminMarketing />}
        {tab === "ai" && <AdminAiInsights />}
      </Suspense>

      {tab === "products" && (
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="p-4 md:p-5 border-b border-white/[0.05] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white/[0.02]">
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all" />
            </div>
            <CsvImport onImport={handleCsvProducts} label="Import Products" expectedHeaders={["title", "price", "category", "description", "stock", "images", "sizes", "colors"]} />
          </div>
          {/* Mobile: card layout */}
          <div className="sm:hidden divide-y divide-white/[0.04]">
            {filtered.map((product) => (
              <div key={product.id} className="p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                <img src={product.images?.[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-white/[0.04] flex-shrink-0 ring-1 ring-white/[0.06]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.title}</p>
                  <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-sm font-semibold text-white">₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-white/40 px-2 py-0.5 bg-white/[0.04] rounded-full">{product.category}</span>
                    <span className={`text-xs font-medium ml-auto px-2 py-0.5 rounded-full ${product.stock <= 5 ? "bg-amber-500/10 text-amber-400" : "bg-white/[0.04] text-white/60"}`}>{product.stock} left</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button onClick={() => handleEdit(product)} className="p-1.5 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all" aria-label="Edit"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                    <button onClick={() => handleDelete(product)} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all" aria-label="Delete"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <p className="text-white/40 text-sm">{search ? "No matches found." : "No products yet. Click the Add Product button to get started."}</p>
              </div>
            )}
          </div>
          {/* Desktop: table layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Stock</th>
                  <th className="text-right py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/[0.04] flex-shrink-0 ring-1 ring-white/[0.06]" />
                        <div className="min-w-0"><p className="text-sm font-medium text-white truncate max-w-[200px]">{product.title}</p><p className="text-xs text-white/40 truncate max-w-[200px]">{product.description}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell"><span className="text-xs text-white/60 px-2 py-0.5 bg-white/[0.04] rounded-full">{product.category}</span></td>
                    <td className="py-3 px-4 text-white font-medium tabular-nums">₹{product.price.toLocaleString()}</td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock <= 5 ? "bg-amber-500/10 text-amber-400" : "bg-white/[0.04] text-white/60"}`}>{product.stock}</span></td>
                    <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className="p-2 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all" aria-label="Edit"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                      <button onClick={() => handleDelete(product)} className="p-2 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all" aria-label="Delete"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-16 text-center">
                    <svg className="w-10 h-10 mx-auto text-white/10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    <p className="text-white/40 text-sm">{search ? "No matches found." : "No products yet."}</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }}
                className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white/[0.04] backdrop-blur-2xl border-b border-white/[0.06] px-5 md:px-6 py-4 flex items-center justify-between z-10">
                  <h3 className="text-sm md:text-base font-semibold text-white/90">Order <span className="font-mono text-white/50">#{selectedOrder.id}</span></h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-5 md:p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-0.5"><span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">Date</span><p className="text-white font-medium">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ""}</p></div>
                    <div className="space-y-0.5"><span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">Payment</span><p className="text-white font-medium capitalize">{selectedOrder.paymentMethod || "N/A"}</p></div>
                    <div className="space-y-0.5"><span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">Total</span><p className="text-white font-medium tabular-nums">₹{selectedOrder.total?.toLocaleString()}</p></div>
                    <div className="space-y-0.5"><span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">Status</span>
                      <select value={selectedOrder.status} onChange={(e) => { const v = e.target.value; updateOrderStatus(selectedOrder.id, v); setSelectedOrder({ ...selectedOrder, status: v }) }}
                        className="w-full px-2 py-1 text-xs font-medium rounded-lg border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        {statuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-2.5">Shipping Details</h4>
                    <div className="bg-white/[0.03] rounded-xl p-4 text-sm space-y-1 border border-white/[0.04]">
                      <p className="text-white font-medium">{selectedOrder.customer?.fullName}</p>
                      <p className="text-white/50">{selectedOrder.customer?.email}</p>
                      <p className="text-white/50">{selectedOrder.customer?.phone}</p>
                      <p className="text-white/50">{selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-2.5">Items ({selectedOrder.items?.length || 0})</h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                          {item.images?.[0] && <img src={item.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover bg-white/[0.06] flex-shrink-0 ring-1 ring-white/[0.06]" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/90 truncate">{item.title}</p>
                            <p className="text-xs text-white/40">{item.quantity || 1} × ₹{item.price?.toLocaleString()}{item.size ? ` | ${item.size}` : ""}{item.color ? ` | ${item.color}` : ""}</p>
                          </div>
                          <p className="text-sm font-medium text-white/90 tabular-nums">₹{((item.quantity || 1) * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06] pt-4">
                    <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-2.5">Order Notes</h4>
                    <textarea
                      defaultValue={selectedOrder.notes || ""}
                      onBlur={(e) => { updateOrder(selectedOrder.id, { notes: e.target.value }); setSelectedOrder({ ...selectedOrder, notes: e.target.value }) }}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" rows={2} placeholder="Add internal notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-white/[0.08] text-white/50 text-sm font-medium rounded-xl hover:bg-white/[0.05] transition-all">Close</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                <p className="text-white/40 text-sm">No orders yet. Orders from customers will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Order ID</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Items</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Total</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-right py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Action</th>
                  </tr></thead>
                  <tbody>
                    {[...orders].reverse().map((o) => (
                      <tr key={o.id} onClick={() => setSelectedOrder(o)}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                        <td className="py-3 px-4"><span className="text-xs font-mono text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-lg">#{o.id}</span></td>
                        <td className="py-3 px-4"><div className="min-w-0 max-w-[160px]"><p className="text-sm font-medium text-white truncate">{o.customer?.fullName}</p><p className="text-xs text-white/40 truncate">{o.customer?.email}</p></div></td>
                        <td className="py-3 px-4 hidden sm:table-cell"><span className="text-xs text-white/60 px-2 py-0.5 bg-white/[0.04] rounded-full">{o.items?.length || 0} item{(o.items?.length || 0) > 1 ? "s" : ""}</span></td>
                        <td className="py-3 px-4 text-sm font-medium text-white tabular-nums">₹{o.total?.toLocaleString()}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${o.status === "pending" ? "bg-amber-500/10 text-amber-400" : o.status === "confirmed" ? "bg-blue-500/10 text-blue-400" : o.status === "shipped" ? "bg-purple-500/10 text-purple-400" : o.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{o.status}</span></td>
                        <td className="py-3 px-4 text-xs text-white/40 hidden md:table-cell">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</td>
                        <td className="py-3 px-4 text-right">
                          <select value={o.status} onChange={(e) => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value) }}
                            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-white/[0.08] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all opacity-0 group-hover:opacity-100">
                            {statuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "enquiries" && (
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          {editingEnquiry && (
            <div className="border-b border-white/[0.06] p-5 bg-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white/90">Edit Enquiry</h4>
                <button onClick={() => setEditingEnquiry(null)} className="p-1 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="space-y-3 max-w-lg">
                <div><label className="block text-xs font-medium text-white/50 mb-1">Name</label><input value={editingEnquiry.name} onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" /></div>
                <div><label className="block text-xs font-medium text-white/50 mb-1">Email</label><input value={editingEnquiry.email} onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" /></div>
                <div><label className="block text-xs font-medium text-white/50 mb-1">Subject</label><input value={editingEnquiry.subject || ""} onChange={(e) => setEditingEnquiry({ ...editingEnquiry, subject: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" /></div>
                <div><label className="block text-xs font-medium text-white/50 mb-1">Message</label><textarea value={editingEnquiry.message || ""} onChange={(e) => setEditingEnquiry({ ...editingEnquiry, message: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" rows={3} /></div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingEnquiry(null)} className="px-3 py-1.5 border border-white/[0.08] text-white/50 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-all">Cancel</button>
                  <button onClick={() => { editEnquiry(editingEnquiry.id, { name: editingEnquiry.name, email: editingEnquiry.email, subject: editingEnquiry.subject, message: editingEnquiry.message }); setEditingEnquiry(null) }}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500/15 to-orange-500/15 text-white text-xs font-medium rounded-xl hover:from-purple-500/25 hover:to-orange-500/25 transition-all border border-white/[0.06]">Save</button>
                </div>
              </div>
            </div>
          )}
          {enquiries.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <p className="text-white/40 text-sm">No enquiries yet. Contact form submissions will appear here.</p>
              </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {[...enquiries].reverse().map((e) => (
                <div key={e.id} className="p-5 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div><div className="flex items-center gap-3"><h4 className="text-sm font-semibold text-white">{e.name}</h4><span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${e.replied ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{e.replied ? "Replied" : "New"}</span></div><p className="text-xs text-white/40 mt-0.5">{e.email}</p></div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-white/40">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ""}</span>
                      <button onClick={() => setEditingEnquiry({ ...e })} className="p-1.5 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all" aria-label="Edit"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                      <button onClick={() => { if (window.confirm(`Delete enquiry from ${e.name}?`)) deleteEnquiry(e.id) }} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all" aria-label="Delete"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                      {!e.replied && <button onClick={() => markEnquiryReplied(e.id)} className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20">Mark Replied</button>}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-white/60 mb-1">{e.subject}</p>
                  <p className="text-sm text-white/60">{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "collections" && (
        <div className="space-y-4">
          {showCollectionForm && (
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{editingCollection ? "Edit Collection" : "New Collection"}</h3>
                <button onClick={() => { setShowCollectionForm(false); setCollectionForm({ name: "", description: "", image: "", productIds: [] }); setEditingCollection(null) }} className="p-1 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Collection Name</label>
                  <input value={collectionForm.name} onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="Summer Essentials" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Image URL (optional)</label>
                  <input value={collectionForm.image} onChange={(e) => setCollectionForm({ ...collectionForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="https://..." />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/70 mb-1">Description</label>
                <textarea value={collectionForm.description} onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" rows={2} placeholder="Curated for the season..." />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/70 mb-1.5">Assign Products</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                  {products.map((p) => (
                    <button key={p.id} onClick={() => setCollectionForm((prev) => ({ ...prev, productIds: prev.productIds.includes(p.id) ? prev.productIds.filter((id) => id !== p.id) : [...prev.productIds, p.id] }))}
                      className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${collectionForm.productIds.includes(p.id) ? "bg-purple-500/15 text-white border-purple-500/30" : "border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/20"}`}>{p.title}</button>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-1">{collectionForm.productIds.length} product{collectionForm.productIds.length !== 1 ? "s" : ""} selected</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowCollectionForm(false); setCollectionForm({ name: "", description: "", image: "", productIds: [] }); setEditingCollection(null) }} className="px-3 py-1.5 border border-white/[0.08] text-white/50 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-all">Cancel</button>
                <button onClick={() => {
                  if (!collectionForm.name.trim()) { showToast("Collection name is required", "error"); return }
                  const updated = editingCollection
                    ? collections.map((c) => c.id === editingCollection.id ? { ...collectionForm, id: editingCollection.id } : c)
                    : [...collections, { ...collectionForm, id: Date.now() }]
                  setCollections(updated)
                  localStorage.setItem("admin-collections", JSON.stringify(updated))
                  setShowCollectionForm(false); setCollectionForm({ name: "", description: "", image: "", productIds: [] }); setEditingCollection(null)
                  showToast(editingCollection ? "Collection updated" : "Collection created", "success")
                }} className="px-3 py-1.5 bg-gradient-to-r from-purple-500/15 to-orange-500/15 text-white text-xs font-medium rounded-xl hover:from-purple-500/25 hover:to-orange-500/25 transition-all border border-white/[0.06]">{editingCollection ? "Update Collection" : "Create Collection"}</button>
              </div>
            </div>
          )}
          {collections.length === 0 && !showCollectionForm ? (
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl py-16 text-center shadow-xl shadow-black/20">
              <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-white/40 text-sm">No collections yet. Collections are like Shopify collections — groups of products you can feature on your store.</p>
              <button onClick={() => setShowCollectionForm(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500/15 to-orange-500/15 text-white text-xs font-medium rounded-xl hover:from-purple-500/25 hover:to-orange-500/25 transition-all border border-white/[0.06]">Create Your First Collection</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {collections.map((c) => (
                <div key={c.id} className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20 group hover:border-white/[0.12] transition-all">
                  {c.image && (
                    <div className="h-28 overflow-hidden">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{c.name}</h3>
                      <span className="text-[10px] font-medium text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded-md flex-shrink-0">{c.productIds.length} items</span>
                    </div>
                    {c.description && <p className="text-xs text-white/40 mt-1 line-clamp-2">{c.description}</p>}
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/[0.04]">
                      <button onClick={() => { setCollectionForm(c); setEditingCollection(c); setShowCollectionForm(true) }} className="flex-1 px-2 py-1.5 text-[10px] font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.05] rounded-lg transition-all border border-white/[0.06]">Edit</button>
                      <button onClick={() => { if (window.confirm(`Delete collection "${c.name}"?`)) { const updated = collections.filter((x) => x.id !== c.id); setCollections(updated); localStorage.setItem("admin-collections", JSON.stringify(updated)); showToast(`"${c.name}" deleted`, "info") } }} className="flex-1 px-2 py-1.5 text-[10px] font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all border border-rose-500/20">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "reviews" && (
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="p-4 md:p-5 border-b border-white/[0.05] bg-white/[0.02]">
            <CsvImport onImport={handleCsvReviews} label="Import Reviews" expectedHeaders={["productid", "name", "email", "rating", "text"]} />
          </div>
           {reviews.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                <p className="text-white/40 text-sm">No reviews yet. Customer reviews will appear here for moderation.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Product ID</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Rating</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Review</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-right py-3.5 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                  </tr></thead>
                  <tbody>
                    {[...reviews].reverse().map((r) => (
                      <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors group">
                      <td className="py-3 px-4"><span className="text-xs font-mono text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-lg">#{r.productId}</span></td>
                      <td className="py-3 px-4"><div><p className="text-sm font-medium text-white">{r.name}</p><p className="text-xs text-white/40">{r.email}</p></div></td>
                      <td className="py-3 px-4"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <svg key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-white/[0.12] fill-white/[0.12]"}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div></td>
                      <td className="py-3 px-4 hidden sm:table-cell"><p className="text-xs text-white/60 truncate max-w-[200px]">{r.text}</p></td>
                      <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${r.approved ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{r.approved ? "Approved" : "Pending"}</span></td>
                      <td className="py-3 px-4 text-xs text-white/40 hidden md:table-cell">{r.date || ""}</td>
                      <td className="py-3 px-4 text-right">
                        {!r.approved && <button onClick={() => approveReview(r.id)} className="px-2 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all border border-emerald-500/20">Approve</button>}
                        <button onClick={() => { const t = prompt("Edit review text:", r.text); if (t) updateReview(r.id, { text: t }); showToast("Review updated", "success") }} className="p-2 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                        <button onClick={() => { deleteReview(r.id); showToast("Review deleted", "info") }} className="p-2 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "sections" && (
        <div className="space-y-4 md:space-y-5">
          {editingSlider && (
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/90">Configure Collection Slider</h3>
                <button onClick={() => setEditingSlider(null)} className="p-1 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/50 mb-1.5">Headline</label>
                <input value={sliderForm.headline} onChange={(e) => setSliderForm({ ...sliderForm, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="Shop the Look" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Select Products</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                  {products.map((p) => (
                    <button key={p.id} onClick={() => setSliderForm((prev) => ({ ...prev, productIds: prev.productIds.includes(p.id) ? prev.productIds.filter((id) => id !== p.id) : [...prev.productIds, p.id] }))}
                      className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${sliderForm.productIds.includes(p.id) ? "bg-purple-500/15 text-white border-purple-500/30" : "border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/20"}`}>{p.title}</button>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-1">{sliderForm.productIds.length} product{sliderForm.productIds.length !== 1 ? "s" : ""} selected</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditingSlider(null)} className="px-3 py-1.5 border border-white/[0.08] text-white/50 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-all">Cancel</button>
                <button onClick={() => {
                  if (!editingSlider) return
                  const updated = homeSections.map((s) => s.id === editingSlider.id ? { ...s, headline: sliderForm.headline, productIds: sliderForm.productIds } : s)
                  setHomeSections(updated); saveHomeSections(updated); setEditingSlider(null)
                  showToast("Collection slider updated", "success")
                }} className="px-3 py-1.5 bg-gradient-to-r from-purple-500/15 to-orange-500/15 text-white text-xs font-medium rounded-xl hover:from-purple-500/25 hover:to-orange-500/25 transition-all border border-white/[0.06]">Save</button>
              </div>
            </div>
          )}
          {showAddSection && (
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Add a Section</h3>
                <button onClick={() => setShowAddSection(false)} className="p-1 text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all" aria-label="Close"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTypes.map((t) => {
                  const disabled = t.id !== "custom" && usedTypes.has(t.id)
                  return (
                    <button key={t.id} disabled={disabled}
                      onClick={() => {
                        if (t.id === "custom") {
                          setSectionForm(defaultSection); setEditingSection(null); setShowSectionForm(true); setShowAddSection(false); return
                        }
                        const extra = t.id === "collection-slider" ? { headline: "Shop the Look", productIds: [] } : {}
                        const updated = [...homeSections, { id: t.id, type: t.id, label: t.label, visible: true, description: "", ...extra }]
                        setHomeSections(updated); saveHomeSections(updated); setShowAddSection(false)
                        showToast(`"${t.label}" added`, "success")
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                        disabled ? "opacity-30 cursor-not-allowed border-white/[0.08] text-white/40" : "border-white/[0.08] text-white/60 hover:text-white/80 hover:border-white/20"
                      }`}>{t.label}</button>
                  )
                })}
              </div>
            </div>
          )}

          {showSectionForm && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">{editingSection ? "Edit Custom Section" : "New Custom Section"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div><label className="block text-xs font-medium text-white/70 mb-1">Name *</label><input value={sectionForm.name} onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all" placeholder="Summer Essentials" /></div>
                <div><label className="block text-xs font-medium text-white/70 mb-1">Description</label><input value={sectionForm.description} onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all" placeholder="Curated for the season" /></div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium text-white/70 mb-1.5">Assign Products</label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-white/[0.04] rounded-xl">
                  {products.map((p) => (
                    <button key={p.id} onClick={() => { setSectionForm((prev) => ({ ...prev, productIds: prev.productIds.includes(p.id) ? prev.productIds.filter((id) => id !== p.id) : [...prev.productIds, p.id] })) }}
                      className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${sectionForm.productIds.includes(p.id) ? "bg-white/[0.08] text-white border-neutral-900" : "border-white/[0.08] text-white/60 hover:border-neutral-400"}`}>{p.title}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowSectionForm(false); setSectionForm(defaultSection); setEditingSection(null) }} className="px-3 py-1.5 border border-white/[0.08] text-white/60 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!sectionForm.name.trim()) { showToast("Section name is required", "error"); return }
                  const customId = Date.now()
                  const secId = editingSection ? editingSection.id : customId
                  const updatedCustom = editingSection
                    ? sections.map((s) => s.id === secId ? { ...sectionForm, id: secId } : s)
                    : [...sections, { ...sectionForm, id: customId }]
                  saveSections(updatedCustom)
                  if (!editingSection) {
                    const newSec = { id: `custom-${customId}`, type: "custom", label: sectionForm.name || "Custom Section", visible: true, customSectionId: customId, description: sectionForm.description }
                    const updated = [...homeSections, newSec]
                    setHomeSections(updated); saveHomeSections(updated)
                  }
                  setShowSectionForm(false); setSectionForm(defaultSection); setEditingSection(null)
                  showToast(editingSection ? "Section updated" : "Section created", "success")
                }} className="px-3 py-1.5 bg-white/[0.08] text-white text-xs font-medium rounded-xl hover:bg-white/[0.12] transition-colors">{editingSection ? "Update" : "Create"}</button>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl shadow-xl shadow-black/20 divide-y divide-white/[0.04]">
            {homeSections.map((sec, idx) => {
              const typeInfo = availableTypes.find((t) => t.id === sec.type)
              const isCustom = sec.type === "custom"
              const customSec = isCustom ? customSections.find((c) => c.id === sec.customSectionId) : null
              return (
                <div key={sec.id} className="flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors">
                  <button onClick={() => {
                    const reordered = [...homeSections]
                    if (idx > 0) { [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]; setHomeSections(reordered); saveHomeSections(reordered) }
                  }} className="p-1 text-white/40 hover:text-white/60 transition-colors disabled:opacity-20" disabled={idx === 0} aria-label="Move up">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                  </button>
                  <button onClick={() => {
                    const reordered = [...homeSections]
                    if (idx < reordered.length - 1) { [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]; setHomeSections(reordered); saveHomeSections(reordered) }
                  }} className="p-1 text-white/40 hover:text-white/60 transition-colors disabled:opacity-20" disabled={idx === homeSections.length - 1} aria-label="Move down">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  <button onClick={() => {
                    const updated = homeSections.map((s) => s.id === sec.id ? { ...s, visible: !s.visible } : s)
                    setHomeSections(updated); saveHomeSections(updated)
                  }} className={`relative w-9 h-5 rounded-full transition-colors ${sec.visible ? "bg-indigo-600" : "bg-white/[0.08]"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${sec.visible ? "translate-x-4" : ""}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{typeInfo?.label || sec.label || "Section"}</p>
                    <p className="text-xs text-white/40 truncate">{isCustom ? `${customSec?.productIds?.length || 0} products` : sec.description}</p>
                  </div>
                  {isCustom && customSec && (
                    <span className="text-xs text-white/40">{customSec.productIds?.length || 0} products</span>
                  )}
                  {sec.type === "collection-slider" && (
                    <button onClick={() => { setSliderForm({ headline: sec.headline || "Shop the Look", productIds: sec.productIds || [] }); setEditingSlider(sec) }}
                      className="p-1.5 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all" aria-label="Configure">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.395.764.82.854.527.112 1.016.314 1.46.596.213.136.456.173.686.1l.855-.27c.53-.167 1.1.056 1.33.555l.383.852c.23.5.03 1.1-.46 1.346l-.716.36c-.339.17-.543.543-.487.93.068.462.068.938 0 1.4-.056.387.148.76.487.93l.716.36c.49.246.69.847.46 1.346l-.383.852c-.23.5-.8.722-1.33.555l-.855-.27c-.23-.073-.473-.036-.686.1a4.2 4.2 0 01-1.46.596c-.425.09-.75.43-.82.854l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.395-.764-.82-.854a4.2 4.2 0 01-1.46-.596c-.213-.136-.456-.173-.686-.1l-.855.27c-.53.168-1.1-.056-1.33-.555l-.383-.853c-.23-.5-.03-1.1.46-1.346l.716-.36c.339-.17.543-.543.487-.93a3.6 3.6 0 010-1.4c.056-.387-.148-.76-.487-.93l-.716-.36c-.49-.246-.69-.847-.46-1.346l.383-.852c.23-.5.8-.722 1.33-.555l.855.27c.23.073.473.036.686-.1a4.2 4.2 0 011.46-.596c.425-.09.75-.43.82-.854l.149-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  )}
                  <button onClick={() => {
                    if (!window.confirm(`Remove "${typeInfo?.label || sec.label}" from homepage?`)) return
                    const updated = homeSections.filter((s) => s.id !== sec.id)
                    setHomeSections(updated); saveHomeSections(updated)
                    showToast(`"${typeInfo?.label || sec.label}" removed`, "info")
                  }} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-colors" aria-label="Remove section">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/20">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Custom Sections</h3>
            {sections.length === 0 ? (
              <p className="text-xs text-white/40">No custom sections created yet.</p>
            ) : (
              <div className="space-y-2">
                {sections.map((sec) => (
                  <div key={sec.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{sec.name}</p>
                      <p className="text-xs text-white/40">{sec.productIds.length} products</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSectionForm(sec); setEditingSection(sec); setShowSectionForm(true) }} className="p-1.5 text-white/40 hover:text-white/60 hover:bg-white/[0.05] rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                      <button onClick={() => handleDeleteSection(sec)} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "theme" && (
        <div className="space-y-6">
          {/* Theme Manager */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white/90">Theme Manager</h2>
              <button onClick={() => { setThemeForm(defaultThemeForm); setEditingTheme(null); setShowThemeForm(true) }}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-500/15 to-orange-500/15 hover:from-purple-500/25 hover:to-orange-500/25 text-white text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-white/[0.06]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Create Theme
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {builtinThemeDefs.map((t) => {
                const builtinActive = !activeCustomTheme && visualTheme === t.id.replace("-builtin", "")
                return (
                <div key={t.id} className={`relative p-4 rounded-xl border transition-all ${
                  builtinActive
                    ? "border-amber-500/40 bg-gradient-to-br from-amber-500/8 to-amber-500/3"
                    : "border-white/[0.06] bg-white/[0.03] hover:border-white/20"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white/90">{t.name}</p>
                      <p className="text-xs text-white/35 font-mono mt-0.5">Built-in</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/20">Active</span>
                      {visualTheme !== "premium" && (
                        <button onClick={() => switchVisualTheme("premium")}
                          className={`flex-1 px-2 py-1 text-xs font-medium rounded-lg transition-all ${
                        builtinActive
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white/80"
                      }`}>{builtinActive ? "Active" : "Activate"}</button>)}
                      <button onClick={() => {
                        setThemeForm({
                          name: `${t.name} (Custom)`, accentH: t.accentH, accentS: t.accentS, accentL: t.accentL,
                          bgDark: t.bgDark, bgLight: t.bgLight, textDark: t.textDark, textLight: t.textLight,
                          cardBg: t.cardBg, glassBg: t.glassBg, fontFamily: t.fontFamily, baseSize: t.baseSize,
                          transitionDuration: t.transitionDuration, hoverLift: t.hoverLift, borderRadius: t.borderRadius,
                        })
                        setEditingTheme(null); setShowThemeForm(true)
                      }} className="px-2 py-1 text-xs font-medium rounded-lg border border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all">Edit</button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
          
          {/* Theme Customizer Form */}
          {showThemeForm && (
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">{editingTheme ? "Edit Theme" : "Create New Theme"}</h2>
                <button onClick={() => { setShowThemeForm(false); setThemeForm(defaultThemeForm); setEditingTheme(null) }}
                  className="p-1.5 text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Theme Name</label>
                    <input value={themeForm.name} onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="My Custom Theme" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "accentH", label: "Accent H", type: "number" },
                      { key: "accentS", label: "Accent S", type: "text" },
                      { key: "accentL", label: "Accent L", type: "text" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-white/40 mb-1">{f.label}</label>
                        <input type={f.type} value={themeForm[f.key]} onChange={(e) => setThemeForm({ ...themeForm, [f.key]: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Accent Color Preview</label>
                    <div className="h-10 rounded-xl border border-white/[0.08]" style={{ background: `hsl(${themeForm.accentH}, ${themeForm.accentS}, ${themeForm.accentL})` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "bgDark", label: "Dark BG" },
                      { key: "bgLight", label: "Light BG" },
                      { key: "textDark", label: "Dark Text" },
                      { key: "textLight", label: "Light Text" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-white/40 mb-1">{f.label}</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={themeForm[f.key]} onChange={(e) => setThemeForm({ ...themeForm, [f.key]: e.target.value })}
                            className="w-8 h-8 rounded-lg border border-white/[0.08] cursor-pointer flex-shrink-0" />
                          <input value={themeForm[f.key]} onChange={(e) => setThemeForm({ ...themeForm, [f.key]: e.target.value })}
                            className="flex-1 px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "cardBg", label: "Card BG" },
                      { key: "glassBg", label: "Glass BG" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-white/40 mb-1">{f.label}</label>
                        <input value={themeForm[f.key]} onChange={(e) => setThemeForm({ ...themeForm, [f.key]: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Font Family</label>
                    <select value={themeForm.fontFamily} onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                      <option>Inter, sans-serif</option>
                      <option>system-ui, sans-serif</option>
                      <option>Georgia, serif</option>
                      <option>SF Pro Display, sans-serif</option>
                      <option>Playfair Display, serif</option>
                      <option>DM Sans, sans-serif</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Base Font Size</label>
                      <select value={themeForm.baseSize} onChange={(e) => setThemeForm({ ...themeForm, baseSize: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <option>14px</option><option>15px</option><option>16px</option><option>17px</option><option>18px</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Transition Duration</label>
                      <select value={themeForm.transitionDuration} onChange={(e) => setThemeForm({ ...themeForm, transitionDuration: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <option>200ms</option><option>300ms</option><option>400ms</option><option>500ms</option><option>600ms</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Hover Lift (px)</label>
                      <select value={themeForm.hoverLift} onChange={(e) => setThemeForm({ ...themeForm, hoverLift: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <option>2px</option><option>4px</option><option>6px</option><option>8px</option><option>10px</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Border Radius</label>
                      <select value={themeForm.borderRadius} onChange={(e) => setThemeForm({ ...themeForm, borderRadius: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <option>8px</option><option>12px</option><option>16px</option><option>20px</option><option>24px</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-3">
                    <label className="block text-xs font-medium text-white/70 mb-2">Live Preview</label>
                    <div className="p-4 rounded-xl border border-white/[0.08] space-y-2" style={{ fontFamily: themeForm.fontFamily }}>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ background: `hsl(${themeForm.accentH}, ${themeForm.accentS}, ${themeForm.accentL})` }} />
                        <span className="text-sm font-semibold text-white">Sample Heading</span>
                      </div>
                      <p className="text-xs text-white/40" style={{ fontSize: themeForm.baseSize }}>Body text at {themeForm.baseSize} with {themeForm.fontFamily}.</p>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-all hover:-translate-y-0.5" style={{ background: `hsl(${themeForm.accentH}, ${themeForm.accentS}, ${themeForm.accentL})`, borderRadius: themeForm.borderRadius }}>Sample Button</button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => { setShowThemeForm(false); setThemeForm(defaultThemeForm); setEditingTheme(null) }}
                      className="px-4 py-2 border border-white/[0.08] text-white/60 text-sm font-medium rounded-xl hover:bg-white/[0.05] transition-colors">Cancel</button>
                    <button onClick={() => {
                      if (!themeForm.name.trim()) { showToast("Theme name is required", "error"); return }
                      const theme = saveTheme(themeForm, editingTheme?.id)
                      setShowThemeForm(false); setThemeForm(defaultThemeForm); setEditingTheme(null)
                      showToast(`"${theme.name}" ${editingTheme ? "updated" : "created"}`, "success")
                    }} className="px-4 py-2 bg-white/[0.08] text-white text-sm font-medium rounded-xl hover:bg-white/[0.12] transition-colors">{editingTheme ? "Update Theme" : "Save Theme"}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Links */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Social Media Links</h2>
              <button onClick={() => { setSocialForm({ platform: "", url: "", icon: "link" }); setEditingSocial(null); setShowSocialForm(true) }}
                className="px-4 py-2 bg-white/[0.08] text-white text-sm font-medium rounded-xl hover:bg-white/[0.12] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Add Social
              </button>
            </div>
            {showSocialForm && (
              <div className="mb-5 p-4 bg-white/[0.04] rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Platform</label>
                    <select value={socialForm.platform} onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                      <option value="">Select...</option>
                      <option>Instagram</option><option>Twitter</option><option>Facebook</option><option>YouTube</option>
                      <option>LinkedIn</option><option>Pinterest</option><option>TikTok</option><option>Snapchat</option>
                      <option>Threads</option><option>WhatsApp</option><option>Telegram</option><option>Discord</option>
                      <option>GitHub</option><option>Dribbble</option><option>Behance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">URL</label>
                    <input value={socialForm.url} onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="https://instagram.com/brand" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Icon</label>
                    <select value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                      <option value="link">Link</option><option value="instagram">Instagram</option><option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option>
                      <option value="pinterest">Pinterest</option><option value="tiktok">TikTok</option><option value="whatsapp">WhatsApp</option>
                      <option value="github">GitHub</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowSocialForm(false); setSocialForm({ platform: "", url: "", icon: "link" }); setEditingSocial(null) }}
                    className="px-3 py-1.5 border border-white/[0.08] text-white/60 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-colors">Cancel</button>
                  <button onClick={() => {
                    if (!socialForm.platform.trim() || !socialForm.url.trim()) { showToast("Platform and URL are required", "error"); return }
                    if (editingSocial) {
                      const updated = socialLinksConfig.map((l) => l.id === editingSocial.id ? { ...socialForm, id: editingSocial.id } : l)
                      setSocialLinksConfig(updated); localStorage.setItem("admin-social-links", JSON.stringify(updated))
                    } else {
                      const newLink = { ...socialForm, id: Date.now() }
                      const updated = [...socialLinksConfig, newLink]
                      setSocialLinksConfig(updated); localStorage.setItem("admin-social-links", JSON.stringify(updated))
                    }
                    setShowSocialForm(false); setSocialForm({ platform: "", url: "", icon: "link" }); setEditingSocial(null)
                    showToast(editingSocial ? "Social link updated" : "Social link added", "success")
                  }} className="px-3 py-1.5 bg-white/[0.08] text-white text-xs font-medium rounded-xl hover:bg-white/[0.12] transition-colors">{editingSocial ? "Update" : "Add"}</button>
                </div>
              </div>
            )}
            {socialLinksConfig.length === 0 ? (
              <p className="text-xs text-white/40">No social links added. Social icons will not appear in the footer.</p>
            ) : (
              <div className="space-y-2">
                {socialLinksConfig.map((link, idx) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                    <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 text-xs uppercase font-bold flex-shrink-0">{link.platform.charAt(0)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{link.platform}</p>
                      <p className="text-xs text-white/40 truncate">{link.url}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium bg-white/[0.06] text-white/60 rounded-full capitalize">{link.icon}</span>
                    <button onClick={() => { setSocialForm(link); setEditingSocial(link); setShowSocialForm(true) }}
                      className="p-1.5 text-white/40 hover:text-white/60 hover:bg-white/[0.05] rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                    <button onClick={() => { if (window.confirm(`Delete "${link.platform}"?`)) { const updated = socialLinksConfig.filter((l) => l.id !== link.id); setSocialLinksConfig(updated); localStorage.setItem("admin-social-links", JSON.stringify(updated)); showToast("Link deleted", "info") } }}
                      className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Store Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {[
                { key: "name", label: "Store Name", placeholder: "URBAN EDGE" },
                { key: "email", label: "Store Email", placeholder: "store@urbanedge.com" },
                { key: "phone", label: "Store Phone", placeholder: "+919760971378" },
                { key: "currency", label: "Currency", placeholder: "INR" },
                { key: "taxRate", label: "Tax Rate (%)", placeholder: "5" },
                { key: "shippingRate", label: "Shipping Rate (₹)", placeholder: "99" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-white/70 mb-1">{field.label}</label>
                  <input type="text" value={storeConfig[field.key]} onChange={(e) => { const v = { ...storeConfig, [field.key]: e.target.value }; setStoreConfig(v); localStorage.setItem("admin-store-config", JSON.stringify(v)) }}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder={field.placeholder} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Store Logo</h2>
            <div className="max-w-lg space-y-3">
              {storeLogo && (
                <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl">
                  <img src={storeLogo} alt="Logo" className="h-12 w-auto rounded-lg object-contain bg-white/[0.06] p-1 border border-white/[0.08]" />
                  <span className="text-xs text-white/40">Logo preview</span>
                  <button onClick={() => { setStoreLogo(""); localStorage.removeItem("admin-store-logo") }} className="ml-auto p-1.5 text-white/40 hover:text-red-500 rounded-lg hover:bg-rose-500/10 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 text-indigo-400 text-sm font-medium rounded-xl cursor-pointer hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                Upload Logo Image
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { const data = ev.target.result; setStoreLogo(data); localStorage.setItem("admin-store-logo", data); showToast("Logo uploaded", "success") }; reader.readAsDataURL(file) } }} className="hidden" />
              </label>
              <p className="text-xs text-white/40">Recommended: PNG with transparent background, max 200px height.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Navigation Links</h2>
            <p className="text-xs text-white/40 mb-4">Manage the links shown in the navigation bar. The first link will be treated as the home page.</p>
            {showNavLinkForm && (
              <div className="mb-4 p-4 bg-white/[0.04] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-white/70">{editingNavLink ? "Edit Link" : "Add Link"}</h4>
                  <button onClick={() => { setShowNavLinkForm(false); setNavLinkForm({ to: "", label: "" }); setEditingNavLink(null) }} className="p-1 text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-white/70 mb-1">Label</label><input value={navLinkForm.label} onChange={(e) => setNavLinkForm({ ...navLinkForm, label: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Home" /></div>
                  <div><label className="block text-xs font-medium text-white/70 mb-1">Path</label><input value={navLinkForm.to} onChange={(e) => setNavLinkForm({ ...navLinkForm, to: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="/" /></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setShowNavLinkForm(false); setNavLinkForm({ to: "", label: "" }); setEditingNavLink(null) }} className="px-3 py-1.5 border border-white/[0.08] text-white/60 text-xs font-medium rounded-xl hover:bg-white/[0.05] transition-colors">Cancel</button>
                  <button onClick={() => {
                    if (!navLinkForm.label.trim() || !navLinkForm.to.trim()) { showToast("Label and path are required", "error"); return }
                    if (editingNavLink) {
                      const updated = navLinksConfig.map((l) => l.id === editingNavLink.id ? { ...navLinkForm, id: editingNavLink.id } : l)
                      setNavLinksConfig(updated); localStorage.setItem("admin-nav-links", JSON.stringify(updated))
                    } else {
                      const newLink = { ...navLinkForm, id: Date.now() }
                      const updated = [...navLinksConfig, newLink]
                      setNavLinksConfig(updated); localStorage.setItem("admin-nav-links", JSON.stringify(updated))
                    }
                    setShowNavLinkForm(false); setNavLinkForm({ to: "", label: "" }); setEditingNavLink(null)
                    showToast(editingNavLink ? "Link updated" : "Link added", "success")
                  }} className="px-3 py-1.5 bg-white/[0.08] text-white text-xs font-medium rounded-xl hover:bg-white/[0.12] transition-colors">{editingNavLink ? "Update" : "Add"}</button>
                </div>
              </div>
            )}
            {navLinksConfig.length === 0 ? (
              <p className="text-xs text-white/40">No custom links. Default links (Home, Shop) will be used.</p>
            ) : (
              <div className="space-y-2">
                {navLinksConfig.map((link, idx) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                    <button onClick={() => {
                      if (idx === 0) return
                      const reordered = [...navLinksConfig]
                      ;[reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]
                      setNavLinksConfig(reordered); localStorage.setItem("admin-nav-links", JSON.stringify(reordered))
                    }} disabled={idx === 0} className="p-1 text-white/40 hover:text-white/60 transition-colors disabled:opacity-20"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg></button>
                    <button onClick={() => {
                      if (idx === navLinksConfig.length - 1) return
                      const reordered = [...navLinksConfig]
                      ;[reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]
                      setNavLinksConfig(reordered); localStorage.setItem("admin-nav-links", JSON.stringify(reordered))
                    }} disabled={idx === navLinksConfig.length - 1} className="p-1 text-white/40 hover:text-white/60 transition-colors disabled:opacity-20"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{link.label}</p>
                      <p className="text-xs text-white/40 font-mono">{link.to}</p>
                    </div>
                    <button onClick={() => { setNavLinkForm(link); setEditingNavLink(link); setShowNavLinkForm(true) }} className="p-1.5 text-white/40 hover:text-white/60 hover:bg-white/[0.05] rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                    <button onClick={() => { if (window.confirm(`Delete "${link.label}"?`)) { const updated = navLinksConfig.filter((l) => l.id !== link.id); setNavLinksConfig(updated); localStorage.setItem("admin-nav-links", JSON.stringify(updated)); showToast("Link deleted", "info") } }} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                  </div>
                ))}
              </div>
            )}
            {!showNavLinkForm && (
              <button onClick={() => setShowNavLinkForm(true)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors border border-indigo-500/20">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Add Link
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Announcement Bar</h2>
            <div className="max-w-lg">
              <label className="block text-xs font-medium text-white/70 mb-1">Announcement Text</label>
              <div className="flex gap-2">
                <input type="text" value={storeConfig.announcement} onChange={(e) => { const v = { ...storeConfig, announcement: e.target.value }; setStoreConfig(v); localStorage.setItem("admin-store-config", JSON.stringify(v)) }}
                  className="flex-1 px-3 py-2 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Free shipping on orders above ₹999!" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Maintenance Mode</h2>
            <div className="flex items-center justify-between max-w-lg">
              <div>
                <p className="text-sm text-white/70">Enable maintenance mode</p>
                <p className="text-xs text-white/40 mt-0.5">When enabled, visitors will see a maintenance page instead of the store.</p>
              </div>
              <button onClick={() => { const v = !maintenanceMode; setMaintenanceMode(v); localStorage.setItem("admin-maintenance", v ? "true" : "false"); showToast(v ? "Maintenance mode ON" : "Maintenance mode OFF", "info") }}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${maintenanceMode ? "bg-amber-500" : "bg-white/[0.08]"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenanceMode ? "translate-x-6" : ""}`} />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Meta Ads Connection</h2>
            <p className="text-xs text-white/40 mb-6">Connect Facebook and Instagram to track conversions and set up ad campaigns.</p>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Facebook Pixel ID</label>
                <input type="text" value={fbMeta.pixel} onChange={(e) => { const v = { ...fbMeta, pixel: e.target.value }; setFbMeta(v); localStorage.setItem("admin-meta", JSON.stringify(v)) }}
                  className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="e.g. 1234567890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Instagram Business Account ID</label>
                <input type="text" value={fbMeta.instagram} onChange={(e) => { const v = { ...fbMeta, instagram: e.target.value }; setFbMeta(v); localStorage.setItem("admin-meta", JSON.stringify(v)) }}
                  className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="e.g. 17841400000000000" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-semibold text-white mb-4">Danger Zone</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { if (window.confirm("Reset all products to defaults? This cannot be undone.")) { resetProducts(); showToast("Products reset to defaults", "info") } }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">Reset Products to Default</button>
              <button onClick={() => { if (window.confirm("Delete ALL orders? This cannot be undone.")) { localStorage.removeItem("orders"); window.location.reload() } }}
                className="px-5 py-2.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">Delete All Orders</button>
              <button onClick={() => { if (window.confirm("Delete ALL enquiries? This cannot be undone.")) { localStorage.removeItem("enquiries"); window.location.reload() } }}
                className="px-5 py-2.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">Delete All Enquiries</button>
              <button onClick={() => { if (window.confirm("Delete ALL reviews? This cannot be undone.")) { localStorage.removeItem("app-reviews"); window.location.reload() } }}
                className="px-5 py-2.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">Delete All Reviews</button>
            </div>
          </div>
        </div>
      )}

      <ProductFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingProduct(null) }} onSubmit={handleSubmit} product={editingProduct} />
      </div>
      </main>
    </div>
    </div>
    </div>
  )
}
