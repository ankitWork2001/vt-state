"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import BlogCard from "@/components/common/BlogCard"
import { axiosInstance } from "@/lib/axios"

export default function TrendingBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/blogs?page=1&limit=3")
        if (response.data.blogs) {
          setBlogs(response.data.blogs)
        }
      } catch (err) {
        setError("Failed to fetch trending blogs")
        console.error("Error fetching trending blogs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingBlogs()
  }, [])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("en-GB", options)
  }

  // Transform blog data for BlogCard component
  const transformedBlogs = blogs.map((blog) => ({
    id: blog._id,
    title: blog.title,
    category: blog.categoryId?.name || "General",
    image: blog.thumbnail || "/placeholder.svg",
    excerpt: blog.content ? blog.content.substring(0, 150) + "..." : "Read more about this topic...",
    author: blog.author?.username || "Anonymous",
    publishedDate: formatDate(blog.createdAt),
    readTime: "5 min reading",
  }))

  if (error) {
    return (
      <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center py-12 text-red-500">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending</h2>
        <Link href="/blog-listings">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">View All</button>
        </Link>
      </div>

      <BlogCard blogs={transformedBlogs} showBorder={false} loading={loading} />
    </section>
  )
}
