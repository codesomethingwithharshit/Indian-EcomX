import { useState } from "react"

export function ImageCarousel({ images, title }) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-crosshair"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={images[selected]}
          alt={`${title} - Image ${selected + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
        />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selected === index ? "border-neutral-900 dark:border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img src={img} alt={`${title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
