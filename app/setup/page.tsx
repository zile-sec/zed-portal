"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [details, setDetails] = useState("")

  const initializeDatabase = async (force = false) => {
    try {
      setStatus("loading")
      setMessage("Initializing database...")
      setError("")
      setDetails("")

      const url = force ? "/api/init-db?force=true" : "/api/init-db"
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Database initialized successfully")
      } else {
        setStatus("error")
        setError(data.error || "Failed to initialize database")
        setDetails(data.details || "")
      }
    } catch (err) {
      setStatus("error")
      setError("An unexpected error occurred")
      setDetails(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Database Setup</h1>

        <div className="space-y-4">
          {status === "loading" && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin mr-2" />
              <p>{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              <p className="font-medium">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              <p className="font-medium">{error}</p>
              {details && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Technical Details</summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs">{details}</pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-3 mt-6">
            <button
              onClick={() => initializeDatabase(false)}
              disabled={status === "loading"}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Initialize Database
            </button>

            <button
              onClick={() => initializeDatabase(true)}
              disabled={status === "loading"}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Reset & Initialize Database
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p className="font-medium">What does this do?</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Creates all necessary database tables if they don't exist</li>
              <li>Verifies table columns and adds missing ones</li>
              <li>Creates demo users if they don't exist</li>
              <li>The "Reset" option will drop all tables first (use with caution!)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
