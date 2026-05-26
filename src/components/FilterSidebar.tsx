import { categories } from "../data"

export function FilterSidebar({ selectedCategory, onCategoryChange, priceRange, onPriceRangeChange, selectedRating, onRatingChange, inStockOnly, onStockChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-1">
          {[
            { label: "All", value: "" },
            ...categories.map((cat) => ({ label: `${cat.name} (${cat.count})`, value: cat.name })),
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onCategoryChange(item.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === item.value ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Price</h4>
        <div className="space-y-1">
          {[
            { label: "All Prices", value: "" },
            { label: "Under ₹1,500", value: "0-1500" },
            { label: "₹1,500 – ₹3,000", value: "1500-3000" },
            { label: "Above ₹3,000", value: "3000-99999" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => onPriceRangeChange(range.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                priceRange === range.value ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Rating</h4>
        <div className="space-y-1">
          {[
            { label: "All Ratings", value: 0 },
            { label: "4★ & above", value: 4 },
            { label: "3★ & above", value: 3 },
            { label: "2★ & above", value: 2 },
          ].map((rating) => (
            <button
              key={rating.value}
              onClick={() => onRatingChange(rating.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedRating === rating.value ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          inStockOnly ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400"
        }`}>
          {inStockOnly && <svg className="w-3 h-3 text-white dark:text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
        </div>
        <input type="checkbox" checked={inStockOnly} onChange={(e) => onStockChange(e.target.checked)} className="hidden" />
        <span className="text-sm text-neutral-700 dark:text-neutral-300">In Stock Only</span>
      </label>
    </div>
  )
}
