import { useMemo, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules"
import { useProducts } from "../context/ProductContext"
import { useTheme } from "../hooks/useTheme"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

export function CollectionSlider({ headline, description, productIds }) {
  const { products } = useProducts()
  const { visualTheme } = useTheme()
  const isLatest = visualTheme === "latest"

  const slides = useMemo(() => {
    if (!productIds || productIds.length === 0) return products.slice(0, 8)
    return products.filter((p) => productIds.includes(p.id))
  }, [products, productIds])

  if (slides.length === 0) return null

  function SlideImg({ src, alt }) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const onError = useCallback(() => setError(true), [])
    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <svg className="w-12 h-12 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      )
    }
    return (
      <>
        <div className={`absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`} />
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />
      </>
    )
  }

  return (
    <section className="py-10 lg:py-14 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] via-transparent to-orange-500/[0.02] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em]">
            Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 premium-section-title">
            {headline || "Shop the Look"}
          </h2>
          {description && (
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1.5 max-w-md mx-auto">{description}</p>
          )}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={2}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 180,
            modifier: 1.6,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, Pagination, EffectCoverflow]}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="collection-swiper"
        >
          {slides.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="group block relative rounded-2xl overflow-hidden border-2 border-amber-500/25 dark:border-amber-400/25 hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-300 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/20"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <SlideImg src={product.images?.[0] || "/placeholder.svg"} alt={product.title} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm truncate drop-shadow-sm">{product.title}</p>
                  <p className="text-white/80 text-xs mt-0.5 drop-shadow-sm">₹{product.price?.toLocaleString()}</p>
                  <p className="text-white/40 text-[10px] mt-0.5 uppercase tracking-wider drop-shadow-sm">{product.category}</p>
                </div>
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  {product.featured && (
                    <span className="px-2.5 py-0.5 text-[9px] font-semibold rounded-full bg-[oklch(55%_0.18_50)] text-white shadow-lg shadow-amber-500/30">
                      Featured
                    </span>
                  )}
                  {product.rating && (
                    <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[9px] text-white/90">
                      <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {product.rating}
                    </span>
                  )}
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute top-3 right-3 text-[8px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/80 text-white">
                    {product.stock}
                  </span>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .collection-swiper {
          padding: 30px 0 50px 0;
          overflow: visible;
        }
        .collection-swiper .swiper-slide {
          transition: transform 0.4s ease;
          width: 260px;
        }
        .collection-swiper .swiper-slide-active {
          transform: scale(1.08);
          z-index: 2;
        }
        .collection-swiper .swiper-pagination {
          position: relative;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .collection-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.25);
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .collection-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          opacity: 1;
        }
        @media (max-width: 767px) {
          .collection-swiper .swiper-slide-active {
            transform: scale(1.12);
          }
          .collection-swiper .swiper-slide {
            width: 200px;
          }
        }
      `}</style>
    </section>
  )
}
