import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { showToast } from "../hooks/useToast"

const OrderContext = createContext(null)

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]")
  } catch {
    return []
  }
}

function loadEnquiries() {
  try {
    return JSON.parse(localStorage.getItem("enquiries") || "[]")
  } catch {
    return []
  }
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

function orderReducer(state, action) {
  switch (action.type) {
    case "PLACE_ORDER":
      return [...state, { ...action.order, id: Date.now(), createdAt: new Date().toISOString() }]
    case "UPDATE_STATUS":
      return state.map((o) =>
        o.id === action.id ? { ...o, status: action.status } : o
      )
    case "UPDATE_ORDER":
      return state.map((o) =>
        o.id === action.id ? { ...o, ...action.updates } : o
      )
    default:
      return state
  }
}

function enquiryReducer(state, action) {
  switch (action.type) {
    case "ADD_ENQUIRY":
      return [...state, { ...action.enquiry, id: Date.now(), createdAt: new Date().toISOString(), replied: false }]
    case "MARK_REPLIED":
      return state.map((e) =>
        e.id === action.id ? { ...e, replied: true } : e
      )
    case "EDIT_ENQUIRY":
      return state.map((e) =>
        e.id === action.id ? { ...e, ...action.updates } : e
      )
    case "DELETE_ENQUIRY":
      return state.filter((e) => e.id !== action.id)
    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const [orders, dispatch] = useReducer(orderReducer, null, loadOrders)
  const [enquiries, enqDispatch] = useReducer(enquiryReducer, null, loadEnquiries)

  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem("enquiries", JSON.stringify(enquiries)) }, [enquiries])

  const placeOrder = (order) => {
    const id = Date.now()
    dispatch({ type: "PLACE_ORDER", order: { ...order, id, status: "pending", createdAt: new Date().toISOString() } })
    showToast("Order placed successfully!", "success")
    return id
  }

  const updateOrderStatus = (id, status) => {
    dispatch({ type: "UPDATE_STATUS", id, status })
    showToast(`Order #${id} status updated to "${status}"`, "success")
  }

  const addEnquiry = (enquiry) => {
    enqDispatch({ type: "ADD_ENQUIRY", enquiry: { ...enquiry, replied: false } })
    showToast("Enquiry submitted! We'll get back to you soon.", "success")
  }

  const markEnquiryReplied = (id) => {
    enqDispatch({ type: "MARK_REPLIED", id })
    showToast("Enquiry marked as replied", "success")
  }

  const editEnquiry = (id, updates) => {
    enqDispatch({ type: "EDIT_ENQUIRY", id, updates })
    showToast("Enquiry updated", "success")
  }

  const deleteEnquiry = (id) => {
    enqDispatch({ type: "DELETE_ENQUIRY", id })
    showToast("Enquiry deleted", "info")
  }

  const updateOrder = (id, updates) => {
    dispatch({ type: "UPDATE_ORDER", id, updates })
    showToast(`Order #${id} updated`, "success")
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        enquiries,
        placeOrder,
        updateOrderStatus,
        addEnquiry,
        markEnquiryReplied,
        editEnquiry,
        deleteEnquiry,
        updateOrder,
        statuses,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders must be used within an OrderProvider")
  return ctx
}
