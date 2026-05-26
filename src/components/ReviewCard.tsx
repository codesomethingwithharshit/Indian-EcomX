export function ReviewCard({ review }) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-5 border border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">{review.name}</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{review.date}</span>
      </div>
      <div className="flex items-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={`w-4 h-4 ${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200 dark:text-neutral-700 fill-neutral-200 dark:fill-neutral-700"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{review.text}</p>
    </div>
  )
}
