"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
// Make sure we're importing the X and Loader2 icons in the transaction form
import { Plus } from "lucide-react"

import { TransactionForm } from "@/components/transaction-form"
import { AdminTransactionApproval } from "@/components/admin-transaction-approval"

export function DashboardClient({ pendingTransactions, recentActivity, notifications }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [isInitializingDb, setIsInitializingDb] = useState(false)
  const [dbInitMessage, setDbInitMessage] = useState(null)

  const handleCreateTransaction = () => {
    setShowTransactionForm(true)
  }

  const handleTransactionSuccess = (newTransaction) => {
    setShowTransactionForm(false)
    router.refresh() // Refresh the page to show the new transaction
  }

  const initializeDatabase = async () => {
    setIsInitializingDb(true)
    setDbInitMessage(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (response.ok) {
        setDbInitMessage({ type: "success", text: "Database initialized successfully" })
      } else {
        setDbInitMessage({ type: "error", text: data.error || "Failed to initialize database" })
      }
    } catch (error) {
      setDbInitMessage({ type: "error", text: "Error connecting to the server" })
    } finally {
      setIsInitializingDb(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.first_name}</h1>
        <div className="flex gap-4">
          {user?.role === "admin" && (
            <button
              onClick={initializeDatabase}
              disabled={isInitializingDb}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {isInitializingDb ? "Initializing..." : "Initialize Database"}
            </button>
          )}
          <button
            onClick={handleCreateTransaction}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create Transaction
          </button>
        </div>
      </div>

      {dbInitMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${dbInitMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {dbInitMessage.text}
        </div>
      )}

      {/* Admin Transaction Approval Section */}
      {user?.role === "admin" && <AdminTransactionApproval />}

      {/* Rest of the dashboard content */}
      {/* ... */}

      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} onSuccess={handleTransactionSuccess} />
      )}
    </>
  )
}

export function NewTransactionButton() {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const handleSuccess = (transaction) => {
    // Close the form
    setShowForm(false)

    // Refresh the page to show the new transaction
    router.refresh()

    // Show a success message (you could implement a toast notification here)
    alert(`Transaction ${transaction.id} created successfully!`)
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Transaction
      </button>

      {showForm && <TransactionForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />}
    </>
  )
}

export function TransactionCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border bg-card p-6 shadow-sm cursor-pointer hover:border-green-500 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Create Transaction</h3>
        <Plus className="h-5 w-5 text-green-500" />
      </div>
      <p className="text-sm text-muted-foreground mt-4">Submit a new transaction</p>
    </div>
  )
}
