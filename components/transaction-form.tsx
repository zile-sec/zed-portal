"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useActivity } from "@/lib/activity-context"
import { X, Loader2 } from "lucide-react"

// Helper function to generate IDs without external dependencies
const generateId = () => {
  return `trx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function TransactionForm({ onSuccess, onCancel }) {
  const router = useRouter()
  const { user } = useAuth()
  const activityContext = useActivity()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    purpose: "",
    recipient: "",
    recipient_department: "",
    amount: "",
    currency: "ZMW",
    payment_method: "bank_transfer",
    description: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.purpose || !formData.recipient || !formData.recipient_department || !formData.amount) {
        throw new Error("Please fill in all required fields")
      }

      // Create a transaction object for localStorage (fallback)
      const fallbackTransaction = {
        id: generateId(),
        transaction_ref: `TRX-${Date.now().toString().substring(6)}`,
        department: user?.department || "Unknown Department",
        purpose: formData.purpose,
        amount: Number.parseFloat(formData.amount) || 0,
        currency: formData.currency,
        sender_id: user?.id || 0,
        recipient: formData.recipient,
        recipient_department: formData.recipient_department,
        payment_method: formData.payment_method,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: formData.description,
      }

      console.log("Created fallback transaction:", fallbackTransaction)

      // Always save to localStorage first as a backup
      try {
        const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
        existingTransactions.unshift(fallbackTransaction)
        localStorage.setItem("transactions", JSON.stringify(existingTransactions))
        console.log("Transaction saved to localStorage as backup")
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError)
      }

      // Create a simplified transaction object for the API
      const apiTransaction = {
        purpose: formData.purpose,
        amount: formData.amount,
        currency: formData.currency,
        recipient: formData.recipient,
        recipient_department: formData.recipient_department,
        payment_method: formData.payment_method,
        description: formData.description,
        department: user?.department || "Unknown Department",
        sender_id: user?.id || 0,
      }

      // Try to submit to API
      let savedTransaction = fallbackTransaction
      let usedFallback = true // Default to using fallback

      try {
        console.log("Sending API request to create transaction")

        // Use fetch with a timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch("/api/transactions/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiTransaction),
          signal: controller.signal,
        }).catch((err) => {
          console.error("Fetch error:", err)
          throw new Error("Network error when creating transaction")
        })

        clearTimeout(timeoutId)
        console.log("API response status:", response.status)

        // Check if response is OK before trying to parse JSON
        if (!response.ok) {
          // Get response text for error details
          const responseText = await response.text().catch((err) => {
            console.error("Error reading response text:", err)
            return "Could not read error details"
          })

          console.error("API error response text:", responseText)

          // Check if the response is HTML (likely an error page)
          if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
            console.error("Received HTML response instead of JSON")
            throw new Error("Server error: Received HTML instead of JSON")
          }

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(responseText)
            throw new Error(
              `API error: ${response.status} - ${errorData.message || errorData.error || "Unknown error"}`,
            )
          } catch (parseError) {
            // If can't parse as JSON, use the text
            throw new Error(`API error: ${response.status} - ${responseText.substring(0, 100)}...`)
          }
        }

        // Try to parse the response as JSON
        const responseText = await response.text().catch((err) => {
          console.error("Error reading response text:", err)
          return ""
        })

        console.log("API response text:", responseText)

        if (responseText.trim()) {
          // Check if the response is HTML (likely an error page)
          if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
            console.error("Received HTML response instead of JSON")
            throw new Error("Server error: Received HTML instead of JSON")
          }

          try {
            const responseData = JSON.parse(responseText)
            console.log("API response data:", responseData)
            savedTransaction = responseData
            usedFallback = false
          } catch (parseError) {
            console.error("Failed to parse API response:", parseError)
            console.log("Response that failed to parse:", responseText)
          }
        } else {
          console.warn("Empty response from API")
        }
      } catch (apiError) {
        console.error("API error:", apiError)
      }

      // Create activity for the transaction
      try {
        if (activityContext?.addActivity) {
          activityContext.addActivity({
            id: generateId(),
            user_id: user?.id || 0,
            action: "Created transaction",
            details: `Created transaction ${formData.purpose} for ${formData.currency} ${formData.amount} to ${formData.recipient_department}`,
            visible_to: [user?.id, 1], // Visible to creator and admin (ID 1)
            created_at: new Date().toISOString(),
          })
          console.log("Activity created for transaction")
        }
      } catch (activityError) {
        console.error("Error creating activity:", activityError)
      }

      // Create notification for the transaction
      try {
        const formatCurrency = (amount) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: formData.currency,
          }).format(amount)
        }

        // Create a notification in localStorage
        const newNotification = {
          id: generateId(),
          user_id: user?.id || 0,
          title: "Transaction Created",
          message: `Your transaction for ${formatCurrency(Number(formData.amount))} has been created successfully.`,
          details: `Transaction ID: ${savedTransaction.id}\nRecipient: ${formData.recipient}\nPurpose: ${formData.purpose}`,
          type: "transaction",
          related_type: "transaction",
          related_id: savedTransaction.id,
          status: "pending",
          created_at: new Date().toISOString(),
          is_read: false,
        }

        const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
        existingNotifications.unshift(newNotification)
        localStorage.setItem("notifications", JSON.stringify(existingNotifications))
        console.log("Notification created in localStorage")

        // Dispatch an event to update notifications
        window.dispatchEvent(new CustomEvent("notificationsUpdated"))
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError)
      }

      // Show success message
      alert(`Transaction created successfully${usedFallback ? " (using fallback storage)" : ""}!`)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(savedTransaction)
      } else {
        // Navigate to transactions page
        router.push("/transactions")
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
      setError(error.message || "Failed to create transaction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Transaction</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Sending Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={user?.department || "Finance Department"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                Logged in as: {user?.first_name} {user?.last_name} ({user?.email})
              </p>
            </div>

            <div>
              <label htmlFor="recipient_department" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Department
              </label>
              <select
                id="recipient_department"
                name="recipient_department"
                value={formData.recipient_department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Department</option>
                <option value="lands">Lands Department</option>
                <option value="finance">Finance Department</option>
                <option value="health">Health Department</option>
                <option value="admin">Administration</option>
              </select>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g., Equipment Purchase"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="e.g., ABC Corporation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ZMW">ZMW - Zambian Kwacha</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details about this transaction..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Transaction"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Make sure to export the component as default as well
export default TransactionForm
