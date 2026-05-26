const RAZORPAY_KEY_ID = "rzp_test_Stfm7CWjU9vfBL"

export interface RazorpayOptions {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  onSuccess: (paymentId: string, orderId: string, signature: string) => void
  onFailure?: (error: any) => void
}

export function openRazorpayCheckout(options: RazorpayOptions) {
  return new Promise<void>((resolve, reject) => {
    if (!(window as any).Razorpay) {
      reject(new Error("Razorpay SDK not loaded"))
      return
    }

    const totalPaise = Math.round(options.amount * 100)

    const paymentObject = new (window as any).Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: totalPaise,
      currency: options.currency || "INR",
      name: "URBAN EDGE",
      description: "Premium Fashion",
      prefill: options.prefill,
      notes: options.notes || {},
      handler: function (response: any) {
        options.onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        )
        resolve()
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled"))
        },
      },
    })

    paymentObject.on("payment.failed", function (response: any) {
      options.onFailure?.(response.error)
      reject(response.error)
    })

    paymentObject.open()
  })
}
