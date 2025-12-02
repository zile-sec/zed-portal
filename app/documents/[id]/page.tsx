"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Download,
  MessageSquare,
  Send,
  User,
  Calendar,
  Clock,
  Building,
  FileType,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function DocumentDetails({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    const fetchDocumentData = async () => {
      try {
        setIsLoading(true)

        // Fetch document details
        const documentRes = await fetch(`/api/documents/${params.id}`)
        const documentData = await documentRes.json()

        // Fetch comments
        const commentsRes = await fetch(`/api/documents/${params.id}/comments`)
        const commentsData = await commentsRes.json()

        setDocument(documentData)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching document data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentData()
  }, [isAuthenticated, params.id, router])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/documents/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment, userId: user.id }),
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments([newCommentData, ...comments])
        setNewComment("")
      } else {
        alert("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("An error occurred while adding the comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this document?")) return

    try {
      setIsApproving(true)
      const response = await fetch(`/api/documents/${params.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved", userId: user.id }),
      })

      if (response.ok) {
        const updatedDocument = await response.json()
        setDocument(updatedDocument)
        alert("Document approved successfully")
      } else {
        alert("Failed to approve document")
      }
    } catch (error) {
      console.error("Error approving document:", error)
      alert("An error occurred while approving the document")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this document?")) return

    try {
      setIsRejecting(true)
      const response = await fetch(`/api/documents/${params.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected", userId: user.id }),
      })

      if (response.ok) {
        const updatedDocument = await response.json()
        setDocument(updatedDocument)
        alert("Document rejected successfully")
      } else {
        alert("Failed to reject document")
      }
    } catch (error) {
      console.error("Error rejecting document:", error)
      alert("An error occurred while rejecting the document")
    } finally {
      setIsRejecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Document Not Found</h1>
          <p className="text-gray-600 mb-6">
            The document you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/documents" className="text-green-600 hover:text-green-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Documents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/documents" className="text-green-600 hover:text-green-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    document.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : document.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : document.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>

              <div className="p-6">
                {/* Document Preview Placeholder */}
                <div className="bg-gray-100 rounded-md p-4 flex flex-col items-center justify-center min-h-[500px]">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Preview not available. Please download the document to view its contents.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <Download className="h-5 w-5 mr-2" />
                    Download Document
                  </button>
                </div>

                {/* Document Actions */}
                {document.status === "pending" && (
                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-4">
                    <button
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isRejecting ? "Rejecting..." : "Reject Document"}
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isApproving ? "Approving..." : "Approve Document"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Details and Comments */}
          <div className="lg:col-span-1">
            {/* Document Details */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Document Details</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{document.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <FileType className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">{document.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Author</p>
                      <p className="font-medium text-gray-900">
                        {document.first_name} {document.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Priority</p>
                      <p
                        className={`font-medium ${
                          document.priority === "high"
                            ? "text-red-600"
                            : document.priority === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {document.priority.charAt(0).toUpperCase() + document.priority.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium text-gray-900">{new Date(document.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">{new Date(document.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Comments</h2>
              </div>

              <div className="p-6">
                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    ></textarea>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className="text-center py-4">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {comment.first_name} {comment.last_name}
                              </p>
                              <p className="text-xs text-gray-500">{comment.department}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
