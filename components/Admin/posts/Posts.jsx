"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, X } from "lucide-react";
import Papa from "papaparse";
import PostDetails from "./PostDetail";
import NavigationMenu from "@/components/common/NavigationMenu";
import { axiosInstance } from "@/lib/axios";
import { Circles } from "react-loader-spinner";
import EditBlogForm from "./EditBlogForm";

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlogs = async (pageNum = 1) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/analytics/blogs?page=${pageNum}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newBlogs = res.data.data.blogs || [];

      if (pageNum === 1) {
        setBlogs(newBlogs);
      } else {
        setBlogs((prev) => [...prev, ...newBlogs]);
      }

      if (newBlogs.length < 6) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 90 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const filteredPosts = blogs.filter((post) => {
    const matchTitle = post.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchTitle && matchCategory;
  });

  const handleExportCSV = () => {
    const csvData = filteredPosts.map((post) => ({
      ID: post.id || post._id,
      Title: post.title,
      Category: post.category || "Uncategorized",
      PublishedDate: new Date(post.date || post.createdAt).toLocaleDateString(),
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
    const post = blogs.find((p) => (p.id || p._id) === id);
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  const handleEdit = (id) => {
    const post = blogs.find((b) => (b.id || b._id) === id);
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
      setBlogs((prev) => prev.filter((post) => (post.id || post._id) !== id));
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
          { label: "Posts", href: "/posts" },
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
          {Array.from(
            new Set(blogs.map((post) => post.category).filter(Boolean))
          ).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[#A2DD62] text-white">
            <tr>
              <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Title</th>
              <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Category</th>
              <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Date</th>
              <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Views</th>
              <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredPosts.map((post) => (
              <tr
                key={post._id || post.id}
                className="border-t border-gray-200 hover:bg-gray-100 text-[16px]"
              >
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4">
                  {post.category?.name ||
                    post.categoryId?.name ||
                    post.category ||
                    "Uncategorized"}
                </td>
                <td className="px-6 py-4">
                  {new Date(post.createdAt || post.Date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </td>
                <td className="px-6 py-4">
                  {post.views !== undefined && post.views !== null
                    ? post.views
                    : 0}
                </td>

                <td className="px-6 py-4 flex gap-3 items-center">
                  <button
                    onClick={() => handleView(post.id || post._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(post.id || post._id)}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id || post._id)}
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

      {filteredPosts.length === 0 && !loading && (
        <div className="p-6 text-center text-gray-500">No posts found.</div>
      )}

      {loading && (
        <div className="flex justify-center mt-4">
          <Circles height="40" width="40" color="#1F3C5F" ariaLabel="loading" />
        </div>
      )}

      {!hasMore && !loading && blogs.length > 0 && (
        <div className="text-center p-4 text-gray-400">
          No more posts to load.
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-lg">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl relative animate-fadeIn">
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
                const updatedId = updatedPost.id || updatedPost._id;
                setBlogs((prevBlogs) =>
                  prevBlogs.map((b) =>
                    (b.id || b._id) === updatedId ? updatedPost : b
                  )
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