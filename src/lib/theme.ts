import { useTheme } from "../hooks/useTheme"

export function useVisualTheme() {
  const { visualTheme } = useTheme()
  return {
    isPremium: visualTheme === "premium",
    isLatest: visualTheme === "latest",
    theme: visualTheme,
  }
}

export function tc(theme, map) {
  if (theme === "latest") return map.latest ?? map.premium
  return map.premium
}
