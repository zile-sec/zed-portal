"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Send, User, LogOut, Menu, X, ChevronDown, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { NotificationPanel } from "./notification-panel"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true
    }
    return false
  }

  return (
    <>
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-green-600 rounded-full mr-2"></div>
                <span className="font-bold text-xl">Zambia Digital Portal</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Notification Bell */}
                <NotificationPanel />

                {/* Profile Dropdown */}
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <Link href="/profile">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                      </div>
                    </Link>
                    <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                      {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500 hidden md:block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileMenu(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 px-2 space-y-1">
                <Link
                  href="/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home
                    className={`mr-3 h-6 w-6 ${
                      isActive("/dashboard") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  DASHBOARD
                </Link>
                <Link
                  href="/transactions"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/transactions")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Send
                    className={`mr-3 h-6 w-6 ${
                      isActive("/transactions") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  TRANSACTIONS
                </Link>
                <Link
                  href="/documents"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/documents")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FileText
                    className={`mr-3 h-6 w-6 ${
                      isActive("/documents") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  DOCUMENTS
                </Link>
                <Link
                  href="/profile"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/profile")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User
                    className={`mr-3 h-6 w-6 ${
                      isActive("/profile") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  PROFILE
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800">
                <LogOut className="mr-3 h-5 w-5" />
                <span>LOG OUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  href="/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Home
                    className={`mr-3 h-6 w-6 ${
                      isActive("/dashboard") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  DASHBOARD
                </Link>
                <Link
                  href="/transactions"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/transactions")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Send
                    className={`mr-3 h-6 w-6 ${
                      isActive("/transactions") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  TRANSACTIONS
                </Link>
                <Link
                  href="/documents"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/documents")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FileText
                    className={`mr-3 h-6 w-6 ${
                      isActive("/documents") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  DOCUMENTS
                </Link>
                <Link
                  href="/profile"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/profile")
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User
                    className={`mr-3 h-6 w-6 ${
                      isActive("/profile") ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  PROFILE
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800">
                <LogOut className="mr-3 h-5 w-5" />
                <span>LOG OUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
