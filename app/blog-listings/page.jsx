"use client"

import { useState, useEffect, useMemo } from "react"
import FilterTabs from "@/components/BlogListing/FilterTabs"
import BlogViewControls from "@/components/BlogListing/BlogViewControls"
import FilteredBlogs from "@/components/BlogListing/FilteredBlogs"
import NavigationMenu from "@/components/common/NavigationMenu"
import { axiosInstance } from "@/lib/axios"

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [error, setError] = useState(null)

  const breadcrumbPath = [{ label: "Home", href: "/" }, { label: "Blog" }]

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
        console.log("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch blogs when filters change
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true)

        const params = new URLSearchParams({
          page: "1",
          limit: "10",
        })

        if (activeCategory && activeCategory !== "all") {
          params.append("category", activeCategory)
        }

        if (selectedSubCategory) {
          params.append("subcategory", selectedSubCategory)
        }

        // Add sorting parameter if your API supports it
        if (sortBy) {
          params.append("sort", sortBy)
        }

        const response = await axiosInstance.get(`/blogs?${params.toString()}`)

        if (response.data.blogs) {
          setBlogs(response.data.blogs)
        }
      } catch (err) {
        setError("Failed to fetch blogs")
        console.log("Error fetching blogs:", err)
      } finally {
        setBlogsLoading(false)
      }
    }

    // Only fetch blogs if categories are loaded (to avoid unnecessary API calls)
    if (!loading) {
      fetchBlogs()
    }
  }, [activeCategory, selectedSubCategory, sortBy, loading])

  // Reset subcategory when main category changes
  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory)
    setSelectedSubCategory("") // Reset subcategory when main category changes
  }

  // Sort blogs client-side if needed (in case API doesn't support sorting)
  const sortedBlogs = useMemo(() => {
    if (!blogs || blogs.length === 0) return []

    const sorted = [...blogs].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return sorted
  }, [blogs, sortBy])

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <NavigationMenu path={breadcrumbPath} />
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#1F3C5F] text-white rounded hover:bg-[#2a4a6b]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <NavigationMenu path={breadcrumbPath} />

      <FilterTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        selectedSubCategory={selectedSubCategory}
        onSubCategoryChange={setSelectedSubCategory}
        loading={loading}
      />

      <BlogViewControls sortBy={sortBy} onSortChange={setSortBy} />

      <FilteredBlogs blogs={sortedBlogs} loading={blogsLoading} />
    </div>
  )
}
