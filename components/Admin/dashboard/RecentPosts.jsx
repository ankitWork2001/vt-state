"use client"
import { useState } from "react"
import {  Trash2, Eye } from "lucide-react"
import PostDetails from "@/components/Admin/posts/PostDetail"

import { axiosInstance } from "@/lib/axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast" // Changed to react-hot-toast for consistency

const RecentPosts = ({ posts = [], onUpdate = () => {}, onDelete = () => {} }) => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [editingPostId, setEditingPostId] = useState(null)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [postToDeleteId, setPostToDeleteId] = useState(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const handleView = (id) => {
    const post = posts.find((p) => (p.id || p._id) === id)
    setSelectedPost(post)
  }


  const handleDeleteClick = (id) => {
    setPostToDeleteId(id)
    setShowDeleteConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!postToDeleteId) return

    try {
      await axiosInstance.delete(`/blogs/${postToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      onDelete(postToDeleteId)
      toast.success("Post deleted successfully!")
    } catch (err) {
      console.error("Error deleting post:", err)
      toast.error("Failed to delete post.")
    } finally {
      setShowDeleteConfirmDialog(false)
      setPostToDeleteId(null)
    }
  }

 

  if (selectedPost) {
    return <PostDetails post={selectedPost} onBack={() => setSelectedPost(null)} />
  }

 

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden mt-6 w-full">
      <h2 className="text-2xl font-semibold text-[#1F3C5F] bg-[#EDF0FB] px-4 py-3">Recent Posts</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#A2DD62] h-[56px] text-white">
            <tr>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Title</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Category</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Date</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Views</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {posts.map((post) => (
              <tr
                key={post.id || post._id}
                className="border-b border-gray-200 hover:bg-gray-50 text-[16px] sm:text-[18px]"
              >
                <td className="px-4 py-4">{post.title}</td>
                <td className="px-4 py-4">{post.category?.name || post.category || "Uncategorized"}</td>
                <td className="px-4 py-4">{post.date || post.Date}</td>
                <td className="px-4 py-4">{post.views ?? 0}</td>
                <td className="px-4 py-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleView(post.id || post._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                   
                    <button
                      onClick={() => handleDeleteClick(post.id || post._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && <div className="p-4 text-center text-gray-500">No recent posts available.</div>}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RecentPosts
