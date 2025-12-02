"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText, Download, AlertTriangle, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useActivity } from "@/lib/activity-context"

export default function TransactionDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [transaction, setTransaction] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [bankDetails, setBankDetails] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false)
  const [changeRequestNote, setChangeRequestNote] = useState("")

  // Define addActivity using useCallback to prevent unnecessary re-renders
  const addActivity = useCallback((activity) => {
    console.log("Fallback addActivity:", activity)
    try {
      // Try to add directly to localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      activities.push({
        ...activity,
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        created_at: new Date().toISOString(),
      })
      localStorage.setItem("activities", JSON.stringify(activities))

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("activitiesUpdated"))
    } catch (e) {
      console.error("Failed to add activity to localStorage:", e)
    }
  }, [])

  // Use activity context safely with fallback
  const activityContext = useActivity()
  let activityContextAddActivity = addActivity // Initialize with fallback
  if (activityContext && activityContext.addActivity) {
    activityContextAddActivity = activityContext.addActivity
  } else {
    console.warn("Activity context addActivity is undefined, using fallback.")
  }

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First try to get transaction from localStorage
        let localTransaction = null
        try {
          const storedTransactions = localStorage.getItem("transactions") || "[]"
          const transactions = JSON.parse(storedTransactions)
          localTransaction = transactions.find((t) => t.id === params.id || t.transaction_ref === params.id)

          if (localTransaction) {
            console.log("Found transaction in localStorage:", localTransaction)
          }
        } catch (e) {
          console.error("Error accessing localStorage:", e)
        }

        // Fetch transaction details from API
        console.log(`Fetching transaction from API: ${params.id}`)
        let transactionData = null

        try {
          const transactionRes = await fetch(`/api/transactions/${params.id}`)

          if (!transactionRes.ok) {
            const errorText = await transactionRes.text()
            console.error(`Transaction fetch error (${transactionRes.status}):`, errorText)
            throw new Error(`Failed to fetch transaction: ${transactionRes.status}`)
          }

          transactionData = await transactionRes.json()
          console.log("Transaction data received from API:", transactionData)
        } catch (apiError) {
          console.error("API error fetching transaction:", apiError)

          // If we have a local transaction, use it
          if (localTransaction) {
            console.log("Using localStorage transaction as fallback")
            transactionData = localTransaction
            setError("Could not fetch from API. Using locally stored data.")
          } else {
            // If no local transaction, create a mock one
            console.log("Creating mock transaction as fallback")
            transactionData = getMockTransaction(params.id)
            setError("Could not fetch transaction. Using mock data.")
          }
        }

        // Set the transaction data
        setTransaction(transactionData)

        // Fetch timeline
        try {
          const timelineRes = await fetch(`/api/transactions/${params.id}/timeline`)
          if (timelineRes.ok) {
            const timelineData = await timelineRes.json()
            setTimeline(timelineData)
          } else {
            console.warn("Timeline fetch failed, using empty array")
            setTimeline([])
          }
        } catch (timelineError) {
          console.error("Error fetching timeline:", timelineError)
          setTimeline([])
        }

        // Fetch bank details
        try {
          const bankDetailsRes = await fetch(`/api/transactions/${params.id}/bank-details`)
          if (bankDetailsRes.ok) {
            const bankDetailsData = await bankDetailsRes.json()
            setBankDetails(bankDetailsData)
          } else {
            console.warn("Bank details fetch failed, using null")
            setBankDetails(null)
          }
        } catch (bankDetailsError) {
          console.error("Error fetching bank details:", bankDetailsError)
          setBankDetails(null)
        }

        // Fetch attachments
        try {
          const attachmentsRes = await fetch(`/api/transactions/${params.id}/attachments`)
          if (attachmentsRes.ok) {
            const attachmentsData = await attachmentsRes.json()
            setAttachments(attachmentsData)
          } else {
            console.warn("Attachments fetch failed, using empty array")
            setAttachments([])
          }
        } catch (attachmentsError) {
          console.error("Error fetching attachments:", attachmentsError)
          setAttachments([])
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error)
        setError(error.message)

        // If we have a mock transaction, use it as fallback
        if (retryCount === 0) {
          const mockTransaction = getMockTransaction(params.id)
          if (mockTransaction) {
            console.log("Using mock transaction as fallback")
            setTransaction(mockTransaction)
            setTimeline(getMockTimeline(params.id))
            setError("Could not fetch transaction. Using mock data.")
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTransactionData()
    }
  }, [params.id, retryCount])

  const handleUpdateStatus = async (status, note = "") => {
    try {
      setIsUpdating(true)
      setUpdateError(null)

      // Try to update via API first
      try {
        const response = await fetch(`/api/transactions/${params.id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            userId: user.id,
            note: note || undefined,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to update status: ${response.status}`)
        }

        const updatedTransaction = await response.json()
        setTransaction(updatedTransaction)

        // Refresh timeline
        const timelineRes = await fetch(`/api/transactions/${params.id}/timeline`)
        if (timelineRes.ok) {
          const timelineData = await timelineRes.json()
          setTimeline(timelineData)
        }
      } catch (apiError) {
        console.error("API error updating transaction status:", apiError)

        // Fallback to client-side update
        if (transaction) {
          const updatedTransaction = {
            ...transaction,
            status: status,
            updated_at: new Date().toISOString(),
          }

          // Add change request note if provided
          if (status === "change_requested" && note) {
            updatedTransaction.change_request_note = note
            updatedTransaction.change_requested_at = new Date().toISOString()
            updatedTransaction.change_requested_by = user?.id
          }

          setTransaction(updatedTransaction)

          // Add to timeline
          const statusText =
            status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Changes Requested"

          const statusNotes =
            status === "approved"
              ? "Transaction approved for payment"
              : status === "rejected"
                ? "Transaction rejected"
                : `Changes requested: ${note}`

          const newTimelineEvent = {
            id: `local-${Date.now()}`,
            transaction_id: params.id,
            status: statusText,
            user_id: user?.id || 1,
            department: user?.department || "Unknown",
            notes: statusNotes,
            created_at: new Date().toISOString(),
          }

          setTimeline([newTimelineEvent, ...timeline])

          // Add activity
          if (activityContextAddActivity) {
            const activityAction =
              status === "approved"
                ? "Approved transaction"
                : status === "rejected"
                  ? "Rejected transaction"
                  : "Requested changes to transaction"

            activityContextAddActivity({
              user_id: user?.id || 1,
              action: activityAction,
              details: `Transaction ID: ${params.id}${status === "change_requested" ? `\nRequested Changes: ${note}` : ""}`,
              visible_to: [1, 2, 3], // Make visible to all test users
            })
          }

          // Update transactions in localStorage
          try {
            const storedTransactions = localStorage.getItem("transactions") || "[]"
            const transactions = JSON.parse(storedTransactions)
            const updatedTransactions = transactions.map((t) => (t.id === params.id ? updatedTransaction : t))
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions))
            window.dispatchEvent(new CustomEvent("transactionsUpdated"))
          } catch (e) {
            console.error("Failed to update transaction in localStorage:", e)
          }
        }
      }

      // Show success message
      const statusMessage =
        status === "approved" ? "approved" : status === "rejected" ? "rejected" : "changes requested for"

      alert(`Transaction ${statusMessage} successfully!`)

      // Reset change request modal if it was open
      if (status === "change_requested") {
        setShowChangeRequestModal(false)
        setChangeRequestNote("")
      }
    } catch (error) {
      console.error("Error updating transaction status:", error)
      setUpdateError(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRequestChange = () => {
    setShowChangeRequestModal(true)
  }

  const submitChangeRequest = () => {
    if (!changeRequestNote.trim()) return
    handleUpdateStatus("change_requested", changeRequestNote)
  }

  // Mock data functions for fallback
  const getMockTransaction = (id) => {
    // Create a mock transaction based on the ID
    return {
      id: id,
      transaction_ref: id,
      department: "Finance Department",
      purpose: "Equipment Purchase",
      description: "Purchase of new equipment for the department",
      amount: "15000",
      currency: "USD",
      sender_id: 1,
      recipient: "Vendor Company",
      recipient_department: "IT Department",
      recipient_type: "Company",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: "Priority purchase",
      blockchain_hash:
        "0x" +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join(""),
    }
  }

  const getMockTimeline = (id) => {
    // Create mock timeline events
    return [
      {
        id: "tl-1",
        transaction_id: id,
        status: "Created",
        user_id: 1,
        department: "Finance",
        notes: "Transaction created",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ]
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/transactions" className="text-green-600 hover:text-green-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Transaction</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/transactions" className="text-green-600 hover:text-green-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Not Found</h3>
            <p className="text-gray-500 mb-4">The transaction you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/transactions"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              View All Transactions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/transactions" className="text-green-600 hover:text-green-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-600 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Warning: {error}</p>
              <p>Some data might not be up-to-date. Using locally cached information.</p>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : transaction.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : transaction.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : transaction.status === "change_requested"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
              }`}
            >
              {transaction.status === "change_requested"
                ? "Changes Requested"
                : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="p-6">
            {/* Change Request Note (if applicable) */}
            {transaction.status === "change_requested" && transaction.change_request_note && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Changes Requested</h3>
                    <p className="text-sm text-blue-700 mt-1">{transaction.change_request_note}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Requested on{" "}
                      {new Date(transaction.change_requested_at || transaction.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference</p>
                    <p className="text-sm text-gray-900">{transaction.transaction_ref || transaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">From Department</p>
                    <p className="text-sm text-gray-900">{transaction.sender_department || transaction.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">To Department</p>
                    <p className="text-sm text-gray-900">{transaction.recipient_department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="text-sm text-gray-900">{transaction.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {transaction.currency} {Number(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">
                      {transaction.payment_method
                        ? transaction.payment_method
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString()} at{" "}
                      {new Date(transaction.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recipient Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Recipient Name</p>
                    <p className="text-sm text-gray-900">{transaction.recipient}</p>
                  </div>
                  {bankDetails && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bank Name</p>
                        <p className="text-sm text-gray-900">{bankDetails.bank_name || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Number</p>
                        <p className="text-sm text-gray-900">{bankDetails.account_number || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Name</p>
                        <p className="text-sm text-gray-900">{bankDetails.account_name || "Not provided"}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-sm text-gray-900">{transaction.description || "No description provided"}</p>
                  </div>
                </div>

                {/* Admin Actions - Fixed to check for admin role or department */}
                {(user?.role === "admin" || user?.department === "admin") && transaction.status === "pending" && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                    {updateError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        {updateError}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleUpdateStatus("approved")}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        {isUpdating ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleRequestChange}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        {isUpdating ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Request Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("rejected")}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        {isUpdating ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Timeline</h2>
              {timeline.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== timeline.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.status === "Created"
                                    ? "bg-blue-500"
                                    : event.status === "Approved"
                                      ? "bg-green-500"
                                      : event.status === "Rejected"
                                        ? "bg-red-500"
                                        : event.status === "Changes Requested"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                                }`}
                              >
                                {event.status === "Created" ? (
                                  <FileText className="h-5 w-5 text-white" />
                                ) : event.status === "Approved" ? (
                                  <CheckCircle className="h-5 w-5 text-white" />
                                ) : event.status === "Rejected" ? (
                                  <XCircle className="h-5 w-5 text-white" />
                                ) : event.status === "Changes Requested" ? (
                                  <MessageCircle className="h-5 w-5 text-white" />
                                ) : (
                                  <Clock className="h-5 w-5 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">
                                  {event.status}{" "}
                                  {event.department && (
                                    <span className="font-medium text-gray-900">by {event.department}</span>
                                  )}
                                </p>
                                {event.notes && <p className="text-sm text-gray-500 mt-1">{event.notes}</p>}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={event.created_at}>
                                  {new Date(event.created_at).toLocaleDateString()} at{" "}
                                  {new Date(event.created_at).toLocaleTimeString()}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No timeline events available.</p>
              )}
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="bg-gray-50 rounded-md p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{attachment.file_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(attachment.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <a
                            href={attachment.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
