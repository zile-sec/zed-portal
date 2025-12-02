"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function DatabaseDiagnosticPage() {
  const [status, setStatus] = useState("idle")
  const [schema, setSchema] = useState(null)
  const [error, setError] = useState("")
  const [fixStatus, setFixStatus] = useState("idle")
  const [fixError, setFixError] = useState("")
  const [fixResult, setFixResult] = useState(null)

  const checkSchema = async () => {
    try {
      setStatus("loading")
      setError("")
      setSchema(null)

      const response = await fetch("/api/database-diagnostic")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setSchema(data)
      } else {
        setStatus("error")
        setError(data.error || "Failed to check database schema")
      }
    } catch (err) {
      setStatus("error")
      setError(err.message || "An unexpected error occurred")
    }
  }

  const fixSchema = async (method) => {
    try {
      setFixStatus("loading")
      setFixError("")
      setFixResult(null)

      const response = await fetch(`/api/database-fix?method=${method}`)
      const data = await response.json()

      if (response.ok) {
        setFixStatus("success")
        setFixResult(data)
        // Refresh schema after fix
        checkSchema()
      } else {
        setFixStatus("error")
        setFixError(data.error || "Failed to fix database schema")
      }
    } catch (err) {
      setFixStatus("error")
      setFixError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Diagnostic Tool</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Check Database Schema</h2>

          <button
            onClick={checkSchema}
            disabled={status === "loading"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              "Check Database Schema"
            )}
          </button>

          {status === "error" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <p className="font-medium">Error checking schema:</p>
              <p>{error}</p>
            </div>
          )}

          {schema && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Database Tables</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exists
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(schema.tables).map(([tableName, exists]) => (
                      <tr key={tableName}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tableName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {exists ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {schema.transactionsColumns && (
                <>
                  <h3 className="text-lg font-medium mt-6 mb-2">Transactions Table Columns</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Column Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Is Nullable
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {schema.transactionsColumns.map((column) => (
                          <tr key={column.column_name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {column.column_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{column.data_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {column.is_nullable === "YES" ? "Yes" : "No"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Fix Database Schema</h3>
                <p className="text-yellow-700 mb-4">Choose one of the following options to fix the database schema:</p>

                <div className="space-y-3">
                  <button
                    onClick={() => fixSchema("add-column")}
                    disabled={fixStatus === "loading"}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {fixStatus === "loading" && fixResult?.method === "add-column" ? (
                      <>
                        <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                        Adding column...
                      </>
                    ) : (
                      "Add Missing Column (Safe)"
                    )}
                  </button>

                  <button
                    onClick={() => fixSchema("recreate-table")}
                    disabled={fixStatus === "loading"}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {fixStatus === "loading" && fixResult?.method === "recreate-table" ? (
                      <>
                        <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                        Recreating table...
                      </>
                    ) : (
                      "Recreate Transactions Table (Will Delete Existing Transactions)"
                    )}
                  </button>

                  <button
                    onClick={() => fixSchema("full-reset")}
                    disabled={fixStatus === "loading"}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {fixStatus === "loading" && fixResult?.method === "full-reset" ? (
                      <>
                        <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                        Resetting database...
                      </>
                    ) : (
                      "Full Database Reset (Will Delete ALL Data)"
                    )}
                  </button>
                </div>

                {fixStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                    <p className="font-medium">Error fixing schema:</p>
                    <p>{fixError}</p>
                  </div>
                )}

                {fixStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                    <p className="font-medium">Schema fixed successfully!</p>
                    <p>{fixResult?.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Transaction Creation</h2>
          <p className="mb-4">After fixing the schema, you can test creating a transaction to verify the fix worked:</p>
          <a
            href="/transactions"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Go to Transactions Page
          </a>
        </div>
      </div>
    </div>
  )
}
