# Project Details

## Project Overview
- **Type**: Indian ecommerce (fashion/apparel) website — **URBAN EDGE**
- **Brand Vibe**: Premium modern fashion with dual-theme support:
  - **Default**: Clean, minimal, neutral-toned dark/light mode
  - **Premium (`.premium` theme)**: Dark luxury vibe — purple/indigo/fuchsia gradients, glassmorphism, glow effects, rich shadows
- **Target Audience**: Fashion-conscious Indian millennials/Gen Z seeking premium streetwear and contemporary fashion
- **Price Range**: ₹999–₹9,999 (mid-premium Indian market)

---

# Tech Stack
- **Frontend**: React 19 + TypeScript 6
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Animation**: Framer Motion 12
- **Routing**: React Router DOM 7
- **Carousel**: Swiper 12
- **Payments**: Razorpay (test keys in `.env.local`)
- **State**: React Context + useReducer (no Redux)
- **No backend** — fully localStorage/frontend-only (PWA-like single file app)

### Dependencies
```json
"dependencies": {
  "framer-motion": "^12.40.0",
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.15.1",
  "swiper": "^12.1.4"
}
```

---

# Current Problems In UI

### Navbar (Navbar.tsx)
- `iconHover` variable was missing (ReferenceError fixed)
- Mobile menu lacks polish — basic list, no transition on sub-items
- No sticky/blur effect transition — jumps instantly
- Premium theme icons use same hover for both themes
- No active link underline animation on mobile
- Logo/BRAND inconsistency between themes

### Footer (Footer.tsx)
- Email/phone were plain `<p>` tags (now fixed with icons + clickable links)
- Payment badges had no hover feedback (fixed)
- Grid layout feels unbalanced — brand spans 2 cols, rest 1 col each
- Copyright bar links too basic
- No back-to-top animation originally (now has framer-motion)
- Overall spacing could be tighter

### HeroBanner (HeroBanner.tsx)
- Text animations don't stagger on slide change
- Gradient overlays are heavy — could be more subtle
- Slide interval (6s) is good but no pause on hover
- CTA buttons lack depth on default theme
- No mobile-specific text sizing adjustments

### ProductCard (ProductCard.tsx)
- Cards feel flat on default theme — shadows too subtle
- No quick-add hover overlay on image (wishlist button is the only overlay element)
- Category text color low contrast on dark mode default
- "Featured" badge blends in on default theme
- Add to Cart button on default theme is basic gradient — no shimmer/hover depth
- No color/size variant preview in card
- Image aspect ratio 4:5 is good but no zoom effect on default theme

### Home Page (Home.tsx)
- All sections use the same 2x2/4-col grid — repetitive
- Section spacing inconsistent (py-16 vs py-16 lg:py-24)
- No parallax or visual break between sections
- Brands section logos break easily (no fallback) — uses cdn.simpleicons.org which may fail
- Testimonial cards identical — no visual hierarchy
- Newsletter CTA could be more compelling
- No scroll-triggered animation variety (all use same fade-up)

### General UI Issues
- **Spacing**: Inconsistent section padding (some `py-16`, some with `lg:py-24`)
- **Typography**: Only Inter + Instrument Sans loaded — no display/headline font for hero
- **Shadows**: Default theme uses `shadow-sm` — feels cheap for premium fashion
- **Cards**: No border glow or elevated hover state on default theme
- **Responsiveness**: Some grids use `grid-cols-2` all the way to `lg` — too wide on tablets
- **Animations**: Page transitions exist (`.page-enter`) but not wired into router
- **Empty states**: Cart, Wishlist empty states exist but are plain
- **Loading states**: Skeleton component exists but only shimmer, no skeleton layout
- **Colors**: Hardcoded `text-neutral-700`, `text-neutral-900` everywhere — no design tokens in Tailwind

---

# Design Goal
- **Apple-level cleanliness** with **Nike-level boldness**
- **Luxury ecommerce feel** — think SSENSE, MR PORTER, FARFETCH
- **High contrast dark mode** that feels premium, not default OS dark
- **Expensive-looking product cards** with subtle glow, scale, and depth
- **Smooth scrolling** with section reveal animations
- **Mobile-first** with buttery touch interactions
- **Premium animations** — spring-based, staggered, micro-interactions
- **High conversion UI** — clear CTAs, trust signals, urgency badges

**Vibe**: Dark luxury + tech-forward minimalism (like Linear + SSENSE had a baby)

---

# Important Instruction
- DO NOT rewrite project from scratch
- Keep existing structure as much as possible
- Make fast UI improvements — CSS, Tailwind classes, animation tweaks
- Focus on frontend polish — spacing, color, typography, hover states
- Improve responsiveness — test at 320px, 768px, 1024px, 1440px
- Improve visual hierarchy — use size, weight, color, and spacing
- Use modern ecommerce trends — glassmorphism, micro-animations, badge styling
- Keep performance optimized — lazy loading, will-change, GPU-accelerated animations
- Maintain clean reusable code — no duplication, extract patterns

---

# Pages (15 routes)

| Route | File | Description |
|---|---|---|
| `/` | `Home.tsx` | Hero banner + reorderable sections (categories, featured, trending, brands, testimonials, newsletter, custom) |
| `/products` | `Products.tsx` | Product listing with FilterSidebar, search, sort |
| `/products/:id` | `ProductDetails.tsx` | Image carousel, size/color select, reviews, delivery info |
| `/cart` | `Cart.tsx` | Cart items list + CartSummary |
| `/checkout` | `Checkout.tsx` | Address form + payment method select (COD, UPI, Card, NetBanking) + Razorpay |
| `/login` | `Login.tsx` | Simple login form (localStorage-based auth) |
| `/signup` | `Signup.tsx` | Signup form |
| `/wishlist` | `Wishlist.tsx` | Wishlist grid |
| `/admin` | `Admin.tsx` | Admin dashboard with tabs: Dashboard, Products, Orders, Reviews, Sections, Settings |
| `/about` | `About.tsx` | About us page |
| `/contact` | `Contact.tsx` | Contact form |
| `/faq` | `FAQ.tsx` | FAQ accordion |
| `/privacy` | `Privacy.tsx` | Privacy policy |
| `/refund` | `Refund.tsx` | Refund policy |
| `/terms` | `Terms.tsx` | Terms of service |
| `*` | `App.tsx` | 404 page |

---

# Components (24 reusable)

| Component | File | Purpose |
|---|---|---|
| `Navbar` | `Navbar.tsx` | Sticky nav with logo, links, theme toggle, cart/wishlist icons, mobile hamburger |
| `Footer` | `Footer.tsx` | 4-column footer: Brand, Shop, Support, Policies + payment badges + legal |
| `AnnouncementBar` | `AnnouncementBar.tsx` | Rotating promo bar (free shipping, discount code, returns) |
| `HeroBanner` | `HeroBanner.tsx` | Fullscreen hero with auto-rotating slides, CTAs, dot navigation |
| `ProductCard` | `ProductCard.tsx` | Product card with image, badges, rating, price, add-to-cart |
| `CategoryCard` | `CategoryCard.tsx` | Category icon card with emoji |
| `ProductSlider` | `ProductSlider.tsx` | Horizontal scrollable product carousel with arrows |
| `CollectionSlider` | `CollectionSlider.tsx` | Coverflow-style Swiper carousel for collections |
| `SearchBar` | `SearchBar.tsx` | Search input with icon and clear button |
| `FilterSidebar` | `FilterSidebar.tsx` | Category, price range, rating, stock filters |
| `CartFlyout` | `CartFlyout.tsx` | Slide-down mini-cart on add-to-cart |
| `CartItem` | `CartItem.tsx` | Single cart row with quantity selector |
| `CartSummary` | `CartSummary.tsx` | Order totals + checkout CTA |
| `QuantitySelector` | `QuantitySelector.tsx` | +/- quantity input |
| `WishlistButton` | `WishlistButton.tsx` | Heart toggle for wishlist |
| `Button` | `Button.tsx` | Reusable button with variants (primary, secondary, outline, ghost, danger, premium, shimmer, glass) |
| `ImageCarousel` | `ImageCarousel.tsx` | Product image gallery with thumbnails |
| `Toast` | `Toast.tsx` | Toast notification system |
| `Skeleton` | `Skeleton.tsx` | Loading shimmer placeholder |
| `OfferPopCard` | `OfferPopCard.tsx` | Exit-intent/ timed discount popup with countdown |
| `WhatsAppWidget` | `WhatsAppWidget.tsx` | Floating WhatsApp chat button |
| `ErrorBoundary` | `ErrorBoundary.tsx` | React error boundary wrapper |
| `ReviewCard` | `ReviewCard.tsx` | Single review display |
| `ProductFormModal` | `ProductFormModal.tsx` | Admin add/edit product modal |

---

# Theme Information

### Colors
- **Neutral palette**: `neutral-50` through `neutral-950` (Tailwind v4)
- **Default theme**: White/gray backgrounds, black text, neutral borders
- **Premium theme (`[data-theme="premium"]`)**:
  - Accent: Purple `hsl(258, 76%, 62%)` — CSS variable `--theme-accent-h: 258`
  - Gradients: `#7c3aed → #a855f7 → #c084fc` (purple spectrum)
  - Cool gradient: `#6366f1 → #06b6d4`
  - Warm gradient: `#7c3aed → #ec4899`
  - Dark base: `#08080f`, `#0f0f1a`, `#1a1040`
  - Glass: `rgba(255,255,255,0.55)` / `rgba(10,8,20,0.7)` (dark)
  - Glows: `0 0 40px hsla(...)` accent color glow
  - Shadows: Purple-tinted shadow scale

### Fonts
- **Primary**: Inter (300–900) — loaded via Google Fonts
- **Secondary**: Instrument Sans (400–700)
- **Fallback**: `system-ui, -apple-system, sans-serif`
- **Font features**: `cv02, cv03, cv04, cv11` (Inter stylistic alternates)

### Dark/Light Mode
- Toggled via `theme` key in localStorage (`"light"` / `"dark"`)
- `document.documentElement.classList.toggle("dark", isDark)`
- Visual theme (default/premium) stored as `visual-theme` key
- `document.documentElement.setAttribute("data-theme", visualTheme)`
- Smooth transition on `background-color` and `border-color` (300ms)

### Design System (CSS)
- **CSS Variables** in `:root` and `[data-theme="premium"]`:
  - `--theme-glow`, `--theme-card-bg`, `--theme-glass-bg`, `--theme-shadow-*`
  - `--theme-gradient-primary`, `--theme-gradient-accent`
  - `--theme-animate-duration`
- **Animation tokens**: `premiumFloat`, `premiumShimmer`, `premiumGlowPulse`, `premiumSlideUp`, `premiumScaleIn`, etc.
- **Component classes**: `.premium-card`, `.premium-navbar`, `.premium-btn`, `.premium-badge`, `.premium-footer`, `.premium-divider`, `.glass`, `.glass-strong`, `.premium-shimmer`

---

# Context / State Management

| Context | File | Description |
|---|---|---|
| `CartContext` | `CartContext.tsx` | Cart state (useReducer), add/remove/update/clear, totals with tax+shipping |
| `ProductContext` | `ProductContext.tsx` | Products array (useReducer), CRUD operations, localStorage persistence |
| `OrderContext` | `OrderContext.tsx` | Orders management |
| `ReviewContext` | `ReviewContext.tsx` | Reviews management |

### Custom Hooks
| Hook | File | Purpose |
|---|---|---|
| `useTheme` | `useTheme.ts` | Dark mode + visual theme toggle |
| `useAuth` | `useAuth.ts` | localStorage-based user login/signup/logout |
| `useWishlist` | `useWishlist.ts` | Wishlist CRUD |
| `useToast` | `useToast.ts` | Toast notifications |
| `useLocalStorage` | `useLocalStorage.ts` | Generic localStorage state hook |
| `useRecentlyViewed` | `useRecentlyViewed.ts` | Recently viewed products tracking |

---

# Data (data.js)
- **37 seed products** across 14 categories
- **14 categories**: Shirts, T-Shirts, Hoodies, Shorts, Jeans, Coats, Jackets, Shoes, Ethnic Wear, Sportswear, Blazers, Women Fashion, Formal Wear, Accessories
- **4 dummy reviews**, **4 testimonials**, **6 brand logos**
- **3 hero slides** (Summer Collection, New Arrivals, Limited Edition)
- **Delivery info** (shipping ₹999+ free, 15-day returns, 7-day exchange)

---

# Admin Dashboard
- **Login**: `admin` / `admin123` (sessionStorage)
- **6 tabs**: Dashboard, Products (CRUD + CSV import), Orders, Reviews, Sections (reorder home page), Settings (store name, logo, nav links)
- **Dashboard**: Summary cards (total products, orders, revenue, reviews)
- **Products**: Table with edit/delete, add modal, CSV import, reset to seed
- **Sections**: Drag-and-drop reorder of home page sections (categories, featured, trending, etc.) + custom sections

---

# Assets
- `/favicon.svg` — Purple gradient arrow logo
- `/icons.svg` — SVG sprite icons
- `src/assets/hero.png` — Fallback hero image
- `src/assets/vite.svg`, `src/assets/typescript.svg` — Vite/TS logos
- **External images**: Unsplash for products/hero, Pravatar for avatars, SimpleIcons/WorldVectorLogo for brands
- **No local fonts** — Google Fonts CDN (Inter + Instrument Sans)
- **No local icons** — Inline SVGs throughout

---

# What Needs Highest Priority

1. **Home page redesign** — Better section transitions, spacing polish, brand section reliability
2. **Product cards** — More depth, better hover states, quick-add overlay, premium glow
3. **Navbar** — Glassmorphism polish, mobile animation fix, active link states
4. **Mobile responsiveness** — Grid breakpoint tuning, touch interaction improvements
5. **Animations** — Consistent spring animations, stagger timing, scroll reveals
6. **Checkout UI** — Form design polishing, payment method cards, Razorpay flow

---

# UI Inspirations
- **SSENSE** — Dark luxury product presentation, typography
- **MR PORTER** — Editorial product cards, clean layout
- **Nike** — Bold typography, energetic CTAs
- **Stripe** — Clean documentation-like UI, micro-interactions
- **Linear** — Dark mode excellence, spring animations
- **Framer** — Premium glassmorphism, cursor interactions
- **Apple** — Spacing, typography hierarchy, minimalism

---

# Environment
| Variable | Value |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_Stfm7CWjU9vfBL` (test mode) |

---

# Scripts
```json
"dev": "vite",
"build": "vite build",
"typecheck": "tsc --noEmit",
"preview": "vite preview"
```

---

# Final Goal
> **"Make this ecommerce website look like a top-tier modern global brand with extremely polished UI/UX while keeping the existing architecture intact."**

Focus on: dark luxury aesthetic, buttery animations, Apple-level spacing, premium card design, and mobile-first responsive polish. Every component should feel intentional — from the announcement bar to the footer legal links.
