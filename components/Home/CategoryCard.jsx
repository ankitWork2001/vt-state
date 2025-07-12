"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import BlogCard from "@/components/common/BlogCard"
import { axiosInstance } from "@/lib/axios"

// Category skeleton component
function CategorySkeleton() {
  return (
    <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4 sm:gap-2 gap-4 justify-center items-center">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center justify-center pt-2 pb-10 animate-pulse">
          <div className="w-20 h-20 bg-gray-300 rounded-lg mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

export default function CategoryCard() {
  const [activeCategory, setActiveCategory] = useState(null) // null means show all blogs
  const [categories, setCategories] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Map category to color
  const categoryColors = {
    motivational: "#1F3C5F",
    essay: "#2B6CB0",
    strategy: "#D69E2E",
    "current affairs": "#38A169",
    all: "#E5E7EB",
  }

  const currentColor = activeCategory ? categoryColors[activeCategory.toLowerCase()] || "#1F3C5F" : "#E5E7EB"

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/categories")
        if (response.data.success && response.data.data) {
          setCategories(response.data.data)
        }
      } catch (err) {
        setError("Failed to fetch categories")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch blogs when category changes
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true)

        let url = "/blogs?page=1&limit=6"
        if (activeCategory) {
          const selectedCategory = categories.find((cat) => cat.name.toLowerCase() === activeCategory.toLowerCase())
          if (selectedCategory) {
            url = `/blogs?category=${selectedCategory.id}&page=1&limit=6`
          }
        }

        const response = await axiosInstance.get(url)
        if (response.data.blogs) {
          setBlogs(response.data.blogs)
        }
      } catch (err) {
        console.error("Error fetching blogs:", err)
        setBlogs([])
      } finally {
        setBlogsLoading(false)
      }
    }

    // Only fetch blogs if categories are loaded
    if (!loading) {
      fetchBlogs()
    }
  }, [activeCategory, categories, loading])

  const isActive = (categoryName) => {
    if (!activeCategory && !categoryName) return true
    return activeCategory && activeCategory.toLowerCase() === categoryName.toLowerCase()
  }

  const handleCategoryClick = (categoryName) => {
    // If clicking the same category, reset to show all
    if (activeCategory && activeCategory.toLowerCase() === categoryName.toLowerCase()) {
      setActiveCategory(null)
    } else {
      setActiveCategory(categoryName)
    }
  }

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
      <section className="py-8 px-4 max-w-7xl mx-auto">
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
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        <Link href="/blog-listings">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0">
            View All
          </Button>
        </Link>
      </div>

      {/* Category Cards */}
      {loading ? (
        <CategorySkeleton />
      ) : (
        <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4 sm:gap-1 gap-4 justify-center items-center">
          {/* Dynamic Categories Only */}
          {categories.map((category) => {
            const active = isActive(category.name)
            const borderColor = active ? categoryColors[category.name.toLowerCase()] || "#1F3C5F" : "#e5e7eb"

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 pt-2 rounded-t-lg rounded-b-none pb-10 ${
                  active ? "bg-[#E9EBF8]" : "bg-white"
                }`}
              >
                <div
                  className="w-20 h-20 relative mb-2 border-2 rounded-lg overflow-hidden"
                  style={{
                    borderColor: borderColor,
                  }}
                >
                  <Image
                    src={category.categoryImage || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className={`text-xs font-medium ${active ? "text-black font-bold" : "text-gray-700"}`}>
                  {category.name}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Blog Section Background Change */}
      <div className={`${activeCategory ? "bg-[#E9EBF8]" : ""} p-6 rounded-lg rounded-t-none`}>
        <BlogCard blogs={transformedBlogs} showBorder={false} categoryColor={currentColor} loading={blogsLoading} />
      </div>
    </section>
  )
}
