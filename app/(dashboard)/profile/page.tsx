"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Shield, Calendar, Edit, Save, X, Activity } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activityLog, setActivityLog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    department: "",
    role: "",
    bio: "",
  })

  const { user } = useAuth()

  useEffect(() => {
    // Set form data from user
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        role: user.role || "",
        bio: user.bio || "",
      })
    }

    const fetchActivityLog = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${user.id}/activity-log`)
        const data = await response.json()
        setActivityLog(data)
      } catch (error) {
        console.error("Error fetching activity log:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchActivityLog()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Profile updated successfully")
        setIsEditing(false)
      } else {
        alert("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating your profile")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-green-600 hover:text-green-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              )}
            </div>

            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Department cannot be changed</p>
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Role cannot be changed</p>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">
                            {formData.first_name} {formData.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{formData.phone || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{formData.location || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Work Information</h2>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <Building className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Department</p>
                          <p className="font-medium text-gray-900">{formData.department}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Role</p>
                          <p className="font-medium text-gray-900">{formData.role}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Joined</p>
                          <p className="font-medium text-gray-900">
                            {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Bio</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-600 text-sm">{formData.bio || "No bio provided."}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
            </div>

            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {activityLog.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== activityLog.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <Activity className="h-5 w-5 text-gray-500" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">{activity.action}</p>
                              {activity.details && <p className="text-sm text-gray-500 mt-1">{activity.details}</p>}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={activity.created_at}>
                                {new Date(activity.created_at).toLocaleString()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
