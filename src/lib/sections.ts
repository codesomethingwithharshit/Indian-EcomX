const STORAGE_KEY = "home-sections"
const CUSTOM_SECTIONS_KEY = "admin-sections"

const prebuiltSections = [
  { id: "categories", type: "categories", label: "Shop by Category", visible: true, description: "Category grid with icons" },
  { id: "collection-slider", type: "collection-slider", label: "Collection Slider", visible: true, description: "Coverflow product carousel", headline: "Shop the Look", productIds: [] },
  { id: "featured", type: "featured", label: "Featured Products", visible: true, description: "Curated featured product grid with search" },
  { id: "trending", type: "trending", label: "Trending Now", visible: true, description: "Top rated products" },
  { id: "explore", type: "explore", label: "Explore More", visible: true, description: "Product slider carousel" },
  { id: "limited", type: "limited", label: "Low Stock Alert", visible: true, description: "Products with limited inventory" },
  { id: "brands", type: "brands", label: "Featured Brands", visible: true, description: "Brand logo showcase" },
  { id: "testimonials", type: "testimonials", label: "Testimonials", visible: true, description: "Customer reviews & quotes" },
  { id: "newsletter", type: "newsletter", label: "Newsletter", visible: true, description: "Email subscription form" },
]

export function getDefaultSections() {
  return prebuiltSections.map((s) => ({ ...s }))
}

export function loadSections() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const defaultIds = new Set(prebuiltSections.map((s) => s.id))
      const missingDefaults = prebuiltSections.filter((d) => !parsed.find((p) => p.id === d.id))
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults.map((m) => ({ ...m }))]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    }
  } catch {}
  return getDefaultSections()
}

export function saveSections(sections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
}

export function loadCustomSections() {
  try {
    const saved = localStorage.getItem(CUSTOM_SECTIONS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

export function getSectionTypes() {
  return [
    { id: "categories", label: "Shop by Category" },
    { id: "collection-slider", label: "Collection Slider" },
    { id: "featured", label: "Featured Products" },
    { id: "trending", label: "Trending Now" },
    { id: "explore", label: "Explore More" },
    { id: "limited", label: "Low Stock Alert" },
    { id: "brands", label: "Featured Brands" },
    { id: "testimonials", label: "Testimonials" },
    { id: "newsletter", label: "Newsletter" },
    { id: "custom", label: "Custom Section" },
  ]
}
