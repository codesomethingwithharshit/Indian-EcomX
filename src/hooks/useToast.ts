import { useState, useEffect } from "react"

let globalListeners = []
let globalState = []

function notify() {
  globalListeners.forEach((fn) => fn([...globalState]))
}

export function showToast(message, type = "success", duration = 3000) {
  const id = Date.now() + Math.random()
  globalState = [...globalState, { id, message, type }]
  notify()
  setTimeout(() => {
    globalState = globalState.filter((t) => t.id !== id)
    notify()
  }, duration)
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    globalListeners.push(setToasts)
    return () => {
      globalListeners = globalListeners.filter((fn) => fn !== setToasts)
    }
  }, [])

  return toasts
}
