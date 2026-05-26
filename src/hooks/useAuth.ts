import { useLocalStorage } from "./useLocalStorage"

export function useAuth() {
  const [user, setUser] = useLocalStorage("user", null)

  const login = (email, password) => {
    const userData = { email, name: email.split("@")[0], loggedInAt: new Date().toISOString() }
    setUser(userData)
    return userData
  }

  const signup = (fullName, email) => {
    const userData = { email, name: fullName, loggedInAt: new Date().toISOString() }
    setUser(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
  }

  return { user, isAuthenticated: !!user, login, signup, logout }
}
