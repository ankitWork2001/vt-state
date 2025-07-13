"use client";
import { useState } from "react";
import blogData from "@/lib/blog";
import { Pencil, Trash2, Eye } from "lucide-react";
import Papa from "papaparse";
import PostDetails from "./PostDetail";
import NavigationMenu from "@/components/common/NavigationMenu";

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = blogData.blogs.filter((post) => {
    const matchTitle = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchTitle && matchCategory;
  });

  // func for export csv
  const handleExportCSV = () => {
    const csvData = filteredPosts.map(
      ({ id, title, category, publishedDate, author }) => ({
        ID: id,
        Title: title,
        Category: category,
        PublishedDate: publishedDate,
        Author: author,
      })
    );
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "posts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // view details blog
  const handleView = (id) => {
    const post = blogData.blogs.find((p) => p.id === id);
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  // edit a blog
  const handleEdit = (id) => {
    console.log(`Edit post with ID: ${id}`);
  };

  // delete a blog

  const handleDelete = (id) => {
    console.log(`Delete post with ID: ${id}`);
  };

  if (selectedPost) {
    return <PostDetails post={selectedPost} onBack={handleBackToList} />;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4">
        <NavigationMenu
                path={[
                  { label: "Home", href: "/" },
                  { label: "posts", href: "/posts" },
                ]}
              />

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 mt-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4"
        >
          <option value="All">All Categories</option>
          {blogData.categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Posts Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#A2DD62] text-white">
            <tr>
              <th className="px-4 py-3 text-[#1F3C5F] text-[16px]">Title</th>
              <th className="px-4 py-3 text-[#1F3C5F] text-[16px]">Category</th>
              <th className="px-4 py-3 text-[#1F3C5F] text-[16px]">Date</th>
              <th className="px-4 py-3 text-[#1F3C5F] text-[16px]">Author</th>
              <th className="px-4 py-3 text-[#1F3C5F] text-[16px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredPosts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-gray-200 hover:bg-gray-50 text-[18px] font-normal mt-3"
              >
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.publishedDate}</td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3 flex gap-3 whitespace-nowrap">
                  <button
                    onClick={() => handleView(post.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className="p-4 text-center text-gray-500">No posts found.</div>
        )}
      </div>

      {/* Export Button */}
      <div className="mt-4 text-right">
        <button
          onClick={handleExportCSV}
          className="bg-[#1F3C5F] text-white px-4 py-2 rounded hover:bg-[#153050]"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default Posts;
