"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, X, AlertCircle, Loader2, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useActivity } from "@/lib/activity-context"
import { useNotifications } from "@/lib/notification-context"

// Helper function to generate IDs without external dependencies
const generateId = () => {
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Demo users for testing
const DEMO_USERS = [
  { id: 1, email: "admin@example.com", first_name: "Admin", last_name: "User", department: "admin", role: "admin" },
  { id: 2, email: "finance@example.com", first_name: "John", last_name: "Doe", department: "finance", role: "user" },
  { id: 3, email: "lands@example.com", first_name: "Jane", last_name: "Smith", department: "lands", role: "user" },
  { id: 4, email: "health@example.com", first_name: "Bob", last_name: "Johnson", department: "health", role: "user" },
]

export function AdminTransactionApproval() {
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [changeRequestNote, setChangeRequestNote] = useState("")
  const { user } = useAuth()

  // Safely use contexts with error handling
  const activityContext = useActivity()
  const notificationContext = useNotifications()

  // Initialize demo users in localStorage if they don't exist
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users")
      if (!storedUsers) {
        localStorage.setItem("users", JSON.stringify(DEMO_USERS))
        console.log("Initialized demo users in localStorage")
      }
    } catch (error) {
      console.error("Error initializing demo users:", error)
    }
  }, [])

  // Create fallback functions in case the contexts aren't available
  const addActivity = useCallback(
    (activity) => {
      if (activityContext?.addActivity) {
        activityContext.addActivity(activity)
      } else {
        console.warn("Activity context not available, using localStorage fallback")
        try {
          const storedActivities = localStorage.getItem("activities") || "[]"
          const activities = JSON.parse(storedActivities)
          activities.unshift({
            ...activity,
            id: generateId(),
            created_at: new Date().toISOString(),
          })
          localStorage.setItem("activities", JSON.stringify(activities))
          window.dispatchEvent(new CustomEvent("activitiesUpdated"))
        } catch (e) {
          console.error("Failed to create activity:", e)
        }
      }
    },
    [activityContext],
  )

  const addNotification = useCallback(
    (notification) => {
      console.log("Adding notification:", notification)

      try {
        // Get existing notifications from localStorage
        const storedNotifications = localStorage.getItem("notifications") || "[]"
        const notifications = JSON.parse(storedNotifications)

        // Create the new notification
        const newNotification = {
          ...notification,
          id: generateId(),
          created_at: new Date().toISOString(),
          is_read: false, // Make sure to use is_read instead of read
        }

        // Add to the beginning of the array
        notifications.unshift(newNotification)

        // Save back to localStorage
        localStorage.setItem("notifications", JSON.stringify(notifications))

        // Also add to context if available
        if (notificationContext?.addNotification) {
          notificationContext.addNotification(notification)
        }

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent("notificationsUpdated"))

        console.log("Successfully added notification:", newNotification)
        console.log("Current notifications in localStorage:", notifications)
      } catch (e) {
        console.error("Failed to create notification:", e)
      }
    },
    [notificationContext],
  )

  const loadPendingTransactions = useCallback(() => {
    try {
      setLoading(true)
      const storedTransactions = localStorage.getItem("transactions")
      if (storedTransactions) {
        const allTransactions = JSON.parse(storedTransactions)
        const pending = allTransactions.filter((t) => t.status === "pending")
        setPendingTransactions(pending)
      } else {
        setPendingTransactions([])
      }
      setError(null)
    } catch (err) {
      console.error("Error loading transactions:", err)
      setError("Failed to load pending transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load pending transactions from localStorage
    let isMounted = true

    loadPendingTransactions()

    // Listen for transaction updates
    const handleTransactionsUpdated = () => {
      if (isMounted) {
        loadPendingTransactions()
      }
    }

    window.addEventListener("transactionsUpdated", handleTransactionsUpdated)

    return () => {
      window.removeEventListener("transactionsUpdated", handleTransactionsUpdated)
      isMounted = false
    }
  }, [loadPendingTransactions])

  // Function to get user ID by email - using demo users directly
  const getUserIdByEmail = (email) => {
    const user = DEMO_USERS.find((u) => u.email === email)
    return user ? user.id : null
  }

  // Function to get all users by department - using demo users directly
  const getUsersByDepartment = (department) => {
    return DEMO_USERS.filter((u) => u.department === department)
  }

  const updateTransactionStatus = async (transactionId, newStatus, note = "") => {
    setProcessingId(transactionId)

    try {
      // Get the transaction
      const storedTransactions = localStorage.getItem("transactions")
      if (!storedTransactions) {
        throw new Error("No transactions found")
      }

      const allTransactions = JSON.parse(storedTransactions)
      const transactionIndex = allTransactions.findIndex((t) => t.id === transactionId)

      if (transactionIndex === -1) {
        throw new Error("Transaction not found")
      }

      const transaction = allTransactions[transactionIndex]

      // Update the transaction status
      transaction.status = newStatus
      transaction.updated_at = new Date().toISOString()
      transaction.approved_by = user?.id
      transaction.approved_at = new Date().toISOString()

      // Add change request note if provided
      if (newStatus === "change_requested" && note) {
        transaction.change_request_note = note
        transaction.change_requested_at = new Date().toISOString()
        transaction.change_requested_by = user?.id
      }

      // Save the updated transactions
      allTransactions[transactionIndex] = transaction
      localStorage.setItem("transactions", JSON.stringify(allTransactions))

      // Create activity for the transaction update
      const activityAction =
        newStatus === "approved"
          ? "Approved transaction"
          : newStatus === "rejected"
            ? "Rejected transaction"
            : "Requested changes to transaction"

      const activityData = {
        id: generateId(),
        user_id: user?.id,
        action: `${activityAction} ${transaction.transaction_ref || transaction.reference}`,
        details: `Transaction from ${transaction.department || transaction.from_department} to ${
          transaction.recipient_department || transaction.to_department
        } for ${transaction.currency || "ZMW"} ${Number(transaction.amount).toLocaleString()}${
          newStatus === "change_requested" && note ? `\n\nRequested Changes: ${note}` : ""
        }`,
        created_at: new Date().toISOString(),
        visible_to: [user?.id, transaction.sender_id || transaction.created_by], // Visible to admin and sender
      }

      // Add activity
      addActivity(activityData)

      // Create notification for the transaction creator
      const notificationTitle =
        newStatus === "approved"
          ? "Transaction Approved"
          : newStatus === "rejected"
            ? "Transaction Rejected"
            : "Changes Requested for Transaction"

      const notificationDescription =
        newStatus === "approved"
          ? `Your transaction ${transaction.transaction_ref || transaction.reference} has been approved`
          : newStatus === "rejected"
            ? `Your transaction ${transaction.transaction_ref || transaction.reference} has been rejected`
            : `Changes have been requested for your transaction ${transaction.transaction_ref || transaction.reference}`

      const notificationType = newStatus === "approved" ? "success" : newStatus === "rejected" ? "error" : "warning"

      const notificationData = {
        id: generateId(),
        user_id: transaction.sender_id || transaction.created_by,
        title: notificationTitle,
        description: notificationDescription,
        details: newStatus === "change_requested" && note ? `Requested Changes: ${note}` : "",
        type: notificationType,
        related_type: "transaction",
        related_id: transaction.id,
        created_at: new Date().toISOString(),
        is_read: false,
      }

      // Add notification for the transaction creator
      addNotification(notificationData)

      // If transaction is approved, create notification for Lands department
      if (newStatus === "approved") {
        console.log("Creating notification for Lands department")

        // Get Lands user ID directly (ID 3 in our demo users)
        const landsUserId = 3 // This is Jane Smith from lands department

        // Create notification for Lands department
        const landsNotificationData = {
          user_id: landsUserId,
          title: "New Approved Transaction",
          description: `A transaction from ${transaction.department || transaction.from_department} has been approved`,
          details: `Transaction Reference: ${transaction.transaction_ref || transaction.reference}
Amount: ${transaction.currency || "ZMW"} ${Number(transaction.amount).toLocaleString()}
Purpose: ${transaction.purpose || "Not specified"}
Status: Approved`,
          type: "info",
          related_type: "transaction",
          related_id: transaction.id,
        }

        // Add notification for Lands department
        addNotification(landsNotificationData)
        console.log("Created notification for Lands department user:", landsUserId)
      }

      // Update the UI
      setPendingTransactions((prev) => prev.filter((t) => t.id !== transactionId))

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("transactionsUpdated"))

      // Reset change request modal state if it was open
      if (newStatus === "change_requested") {
        setShowChangeRequestModal(false)
        setSelectedTransaction(null)
        setChangeRequestNote("")
      }
    } catch (err) {
      console.error("Error updating transaction:", err)
      setError(`Failed to ${newStatus} transaction: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  const handleRequestChange = (transaction) => {
    setSelectedTransaction(transaction)
    setChangeRequestNote("")
    setShowChangeRequestModal(true)
  }

  const submitChangeRequest = () => {
    if (!selectedTransaction) return
    updateTransactionStatus(selectedTransaction.id, "change_requested", changeRequestNote)
  }

  // Only show this component for admin users
  if (user?.role !== "admin" && user?.department !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (pendingTransactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <p className="text-gray-500">No transactions pending approval.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>

        <div className="space-y-4">
          {pendingTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {transaction.transaction_ref || transaction.reference} - {transaction.purpose || "Transaction"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {transaction.department || transaction.from_department} • To:{" "}
                    {transaction.recipient_department || transaction.to_department}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Amount: {transaction.currency || "ZMW"} {Number(transaction.amount).toLocaleString()}
                  </p>
                  {transaction.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{transaction.description}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRequestChange(transaction)}
                    disabled={processingId === transaction.id}
                    className="p-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 disabled:opacity-50"
                    aria-label="Request Changes"
                    title="Request Changes"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => updateTransactionStatus(transaction.id, "approved")}
                    disabled={processingId === transaction.id}
                    className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50"
                    aria-label="Approve"
                    title="Approve"
                  >
                    {processingId === transaction.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={() => updateTransactionStatus(transaction.id, "rejected")}
                    disabled={processingId === transaction.id}
                    className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50"
                    aria-label="Reject"
                    title="Reject"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Request Modal */}
      {showChangeRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Request Changes</h3>
            <p className="text-sm text-gray-600 mb-4">Please specify what changes are needed for this transaction:</p>

            <textarea
              value={changeRequestNote}
              onChange={(e) => setChangeRequestNote(e.target.value)}
              className="w-full border rounded-md p-3 h-32 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the changes needed..."
            ></textarea>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowChangeRequestModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitChangeRequest}
                disabled={!changeRequestNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
