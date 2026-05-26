import { useEffect, useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

function normalizeVisualTheme(t) {
  if (t === "default" || !t) return "premium"
  return t
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage("theme", "light")
  const [rawTheme, setVisualTheme] = useLocalStorage("visual-theme", "premium")
  const visualTheme = normalizeVisualTheme(rawTheme)
  const isDark = theme === "dark"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    if (visualTheme !== rawTheme) {
      setVisualTheme(visualTheme)
      return
    }
    document.documentElement.setAttribute("data-theme", visualTheme)
  }, [visualTheme, rawTheme, setVisualTheme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [setTheme])

  const switchVisualTheme = useCallback((t) => {
    setVisualTheme(t)
  }, [setVisualTheme])

  return { theme, toggleTheme, isDark, visualTheme, switchVisualTheme }
}
