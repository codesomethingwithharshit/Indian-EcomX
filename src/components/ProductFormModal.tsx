import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const defaultForm = {
  title: "",
  description: "",
  price: "",
  category: "Shirts",
  stock: "",
  rating: 4,
  featured: false,
  seoTitle: "",
  seoUrl: "",
  seoDescription: "",
  images: [""],
  sizes: [],
  colors: [],
}

const categories = ["Shirts", "T-Shirts", "Hoodies", "Shorts", "Jeans", "Shoes", "Accessories"]
const sizeOptions = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "7", "8", "9", "10", "11", "12", "One Size"]
const colorOptions = ["Black", "White", "Navy", "Grey", "Blue", "Red", "Olive", "Beige", "Brown", "Tan", "Maroon", "Khaki", "Dark Blue", "Light Blue"]

export function ProductFormModal({ open, onClose, onSubmit, product }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: String(product.price || ""),
        category: product.category || "Shirts",
        stock: String(product.stock || ""),
        rating: product.rating || 4,
        featured: product.featured || false,
        seoTitle: product.seoTitle || "",
        seoUrl: product.seoUrl || "",
        seoDescription: product.seoDescription || "",
        images: product.images?.length ? product.images : [""],
        sizes: product.sizes || [],
        colors: product.colors || [],
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [product, open])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const toggleArrayItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((x) => x !== item) : [...prev[field], item],
    }))
  }

  const handleImageChange = (index, value) => {
    const imgs = [...form.images]
    imgs[index] = value
    setForm((prev) => ({ ...prev, images: imgs }))
  }

  const addImage = () => setForm((prev) => ({ ...prev, images: [...prev.images, ""] }))
  const removeImage = (index) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = "Title is required"
    if (!form.description.trim()) errs.description = "Description is required"
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = "Valid price required"
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = "Valid stock required"
    if (!form.images[0]?.trim()) errs.images = "At least one image URL is required"
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      images: form.images.filter(Boolean),
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 sm:inset-auto sm:top-10 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700"
          >
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {product ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Product Title *</label>
                  <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all ${errors.title ? "border-red-300" : "border-neutral-200 dark:border-neutral-700"}`} placeholder="Classic Oxford Shirt" />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all resize-none ${errors.description ? "border-red-300" : "border-neutral-200 dark:border-neutral-700"}`} placeholder="Product description..." />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all ${errors.price ? "border-red-300" : "border-neutral-200 dark:border-neutral-700"}`} placeholder="2499" />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all ${errors.stock ? "border-red-300" : "border-neutral-200 dark:border-neutral-700"}`} placeholder="25" />
                  {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Rating</label>
                  <select value={form.rating} onChange={(e) => handleChange("rating", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all">
                    {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <button key={s} type="button" onClick={() => toggleArrayItem("sizes", s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${form.sizes.includes(s) ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button key={c} type="button" onClick={() => toggleArrayItem("colors", c)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${form.colors.includes(c) ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400"}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Image URLs *</label>
                {form.images.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={url} onChange={(e) => handleImageChange(i, e.target.value)} className={`flex-1 px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all ${errors.images && i === 0 ? "border-red-300" : "border-neutral-200 dark:border-neutral-700"}`} placeholder="https://images.unsplash.com/..." />
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(i)} className="px-3 text-red-500 hover:text-red-600">✕</button>
                    )}
                  </div>
                ))}
                {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
                <button type="button" onClick={addImage} className="text-xs text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 mt-1">+ Add another image</button>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.featured ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-600"}`}>
                  {form.featured && <svg className="w-3 h-3 text-white dark:text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </div>
                <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} className="hidden" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Mark as Featured</span>
              </label>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">SEO / Meta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Meta Title</label>
                    <input value={form.seoTitle} onChange={(e) => handleChange("seoTitle", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all" placeholder="Classic Oxford Shirt | URBAN EDGE" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Meta URL Slug</label>
                    <input value={form.seoUrl} onChange={(e) => handleChange("seoUrl", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all" placeholder="classic-oxford-shirt" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Meta Description</label>
                    <textarea value={form.seoDescription} onChange={(e) => handleChange("seoDescription", e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all resize-none" placeholder="Premium cotton oxford shirt..." />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                  {product ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
