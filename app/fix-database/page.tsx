"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function FixDatabasePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const goToDiagnostic = () => {
    setLoading(true)
    router.push("/database-diagnostic")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Database Issue Detected</h1>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
            <p className="font-medium">There appears to be an issue with your database schema.</p>
            <p className="mt-2">
              The error message indicates that the "recipient" column is missing from the transactions table.
            </p>
          </div>

          <p className="text-gray-600">
            Our diagnostic tool can help identify and fix this issue. Click the button below to run the database
            diagnostic tool.
          </p>

          <button
            onClick={goToDiagnostic}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Run Database Diagnostic Tool"}
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <p className="font-medium">What will this do?</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check your current database schema</li>
              <li>Show you what tables and columns exist</li>
              <li>Provide options to fix any issues</li>
              <li>Help you get your application working again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
