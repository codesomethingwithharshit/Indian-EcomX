import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../hooks/useAuth"
import { showToast } from "../hooks/useToast"

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordStrength = useMemo(() => {
    const pw = form.password
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }, [form.password])

  const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Very Strong"]
  const strengthColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-400"]

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = "Full name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email format"
    if (!form.password.trim()) errs.password = "Password is required"
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters"
    if (!form.confirmPassword.trim()) errs.confirmPassword = "Please confirm your password"
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match"
    if (!agreeTerms) errs.terms = "You must agree to the terms"
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    signup(form.fullName, form.email)
    showToast("Account created successfully! Please sign in.", "success")
    navigate("/login")
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-neutral-200/30 to-transparent dark:from-neutral-800/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-neutral-300/20 to-transparent dark:from-neutral-700/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-neutral-950 border border-white/20 dark:border-neutral-800/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-14 h-14 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Create Account</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Join URBAN EDGE today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.fullName ? "border-red-300 dark:border-red-700" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder=" "
              />
              <label htmlFor="fullName" className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-600 dark:peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                Full Name
              </label>
              {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.email ? "border-red-300 dark:border-red-700" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder=" "
              />
              <label htmlFor="email" className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-600 dark:peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                Email
              </label>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`peer w-full px-4 pt-6 pb-2 pr-12 rounded-xl border bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.password ? "border-red-300 dark:border-red-700" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder=" "
              />
              <label htmlFor="password" className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-600 dark:peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                Password
              </label>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="Toggle password">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-neutral-200 dark:bg-neutral-700"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength <= 2 ? "text-red-500" : "text-green-500"}`}>
                    {strengthLabel[Math.max(0, passwordStrength - 1)] || "Very Weak"}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className={`peer w-full px-4 pt-6 pb-2 pr-12 rounded-xl border bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.confirmPassword ? "border-red-300 dark:border-red-700" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder=" "
              />
              <label htmlFor="confirmPassword" className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-600 dark:peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                Confirm Password
              </label>
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="Toggle confirm password">
                {showConfirm ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                agreeTerms ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400"
              }`}>
                {agreeTerms && (
                  <svg className="w-3 h-3 text-white dark:text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="hidden" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                I agree to the{" "}
                <button type="button" className="text-neutral-900 dark:text-white font-medium hover:underline">Terms & Conditions</button>{" "}
                and{" "}
                <button type="button" className="text-neutral-900 dark:text-white font-medium hover:underline">Privacy Policy</button>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-neutral-900 dark:text-white font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
