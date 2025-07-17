"use client";
import { useState } from "react";
import { Pencil, Trash2, Eye, X } from "lucide-react";
import PostDetails from "@/components/Admin/posts/PostDetail";
import EditBlogForm from "@/components/Admin/posts/EditBlogForm";
import { axiosInstance } from "@/lib/axios";

const RecentPosts = ({
  posts = [],
  onUpdate = () => {},
  onDelete = () => {},
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const token = localStorage.getItem("token");

  const handleView = (id) => {
    const post = posts.find((p) => (p.id || p._id) === id);
    setSelectedPost(post);
  };

  const handleEdit = (id) => {
    const post = posts.find((p) => (p.id || p._id) === id);
    setEditingPost(post);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(id);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (selectedPost) {
    return (
      <PostDetails post={selectedPost} onBack={() => setSelectedPost(null)} />
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden mt-6 w-full">
      <h2 className="text-2xl font-semibold text-[#1F3C5F] bg-[#EDF0FB] px-4 py-3">
        Recent Posts
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#A2DD62] h-[56px] text-white">
            <tr>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">
                Title
              </th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">
                Category
              </th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">
                Date
              </th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">
                Views
              </th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {posts.map((post) => (
              <tr
                key={post.id || post._id}
                className="border-b border-gray-200 hover:bg-gray-50 text-[16px] sm:text-[18px]"
              >
                <td className="px-4 py-4">{post.title}</td>
                <td className="px-4 py-4">
                  {post.category?.name || post.category || "Uncategorized"}
                </td>
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
                      onClick={() => handleEdit(post.id || post._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id || post._id)}
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

        {posts.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No recent posts available.
          </div>
        )}
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-lg">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl relative">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <EditBlogForm
              postId={editingPost.id || editingPost._id}
              onCancel={() => setEditingPost(null)}
              onSuccess={(updatedPost) => {
                onUpdate(updatedPost); // Tell parent to update post list
                setEditingPost(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
