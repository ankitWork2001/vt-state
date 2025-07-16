"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, X } from "lucide-react";
import Papa from "papaparse";
import PostDetails from "./PostDetail";
import NavigationMenu from "@/components/common/NavigationMenu";
import { axiosInstance } from "@/lib/axios";
import { ClipLoader } from "react-spinners";
import EditBlogForm from "./EditBlogForm";

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const blogRes = await axiosInstance.get("/blogs");
        if (blogRes.data?.blogs) {
          setBlogs(blogRes.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || post.categoryId?.name === selectedCategory;
    return matchTitle && matchCategory;
  });

  const handleExportCSV = () => {
    const csvData = filteredPosts.map((post) => ({
      ID: post._id,
      Title: post.title,
      Category: post.categoryId?.name || "Uncategorized",
      PublishedDate: new Date(post.createdAt).toLocaleDateString(),
      Author: post.author?.username || "Unknown",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "posts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (id) => {
    const post = blogs.find((p) => p._id === id);
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  const handleEdit = (id) => {
    const post = blogs.find((b) => b._id === id);
    setEditingPost(post);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    await axiosInstance.delete(`/blogs/${id}`);
    setBlogs((prev) => prev.filter((post) => post._id !== id));
  } catch (err) {
    console.error("Failed to delete post:", err);
  }
};


  if (selectedPost) {
    return <PostDetails post={selectedPost} onBack={handleBackToList} />;
  }

  return (
    <div className="bg-gray-50 shadow rounded-xl p-6">
      <NavigationMenu
        path={[
          { label: "Home", href: "/" },
          { label: "posts", href: "/posts" },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#1F3C5F]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#1F3C5F]"
        >
          <option value="All">All Categories</option>
          {Array.from(new Set(blogs.map((post) => post.categoryId?.name).filter(Boolean))).map(
            (name) => (
              <option key={name} value={name}>
                {name}
              </option>
            )
          )}
        </select>
      </div>

            {loading ? (
        <div className="flex justify-center items-center h-60">
          <ClipLoader size={60} color="#1F3C5F" loading={true} />
        </div>
      ) : (

        <>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-[#A2DD62] text-white">
                <tr>
                  <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Title</th>
                  <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Category</th>
                  <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Date</th>
                  <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Author</th>
                  <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-t border-gray-200 hover:bg-gray-100 text-[16px]"
                  >
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">{post.categoryId?.name || "Uncategorized"}</td>
                    <td className="px-6 py-4">
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">{post.author?.username || "Unknown"}</td>
                    <td className="px-6 py-4 flex gap-3 items-center">
                      <button
                        onClick={() => handleView(post._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="text-green-600 hover:text-green-800 cursor-pointer" 
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="p-6 text-center text-gray-500">No posts found.</div>
          )}
        </>
      )}

      <div className="mt-6 text-right">
        <button
          onClick={handleExportCSV}
          className="bg-[#1F3C5F] text-white px-6 py-2 rounded-lg hover:bg-[#153050] transition"
        >
          Export CSV
        </button>
      </div>

   {editingPost && (
<div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-lg">
    <div
      className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl relative animate-fadeIn form-animate" // Add the form-animate class
    >
      <button
        onClick={() => setEditingPost(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={24} />
      </button>
      <EditBlogForm
        post={editingPost}
        onCancel={() => setEditingPost(null)}
        onSuccess={(updatedPost) => {
          setBlogs((prev) =>
            prev.map((b) => (b._id === updatedPost._id ? updatedPost : b))
          );
          setEditingPost(null);
        }}
      />
    </div>
  </div>
)}

    </div>
  );
};

export default Posts;
