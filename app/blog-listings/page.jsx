"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import FilterTabs from "@/components/BlogListing/FilterTabs"
import BlogViewControls from "@/components/BlogListing/BlogViewControls"
import FilteredBlogs from "@/components/BlogListing/FilteredBlogs"
import NavigationMenu from "@/components/common/NavigationMenu"
import { axiosInstance } from "@/lib/axios"
import { Circles } from "react-loader-spinner"

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [reFetching, setRefetching] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const loader = useRef(null)

  const fetchBlogs = useCallback(
    async (pageNum = 1, isReset = false) => {
      try {
        if(pageNum !== 1){
          setRefetching(true)
        }
        if (isReset || pageNum === 1) {
          setLoading(true)
        } else {
          setBlogsLoading(true)
        }

        let url = `/blogs?page=${pageNum}&limit=5`

        if (activeCategory !== "all") url += `&category=${activeCategory}`
        if (selectedSubCategory && selectedSubCategory !== "All")
          url += `&subcategory=${selectedSubCategory}`
        if (sortBy && sortBy !== "All") url += `&sort=${sortBy}`

        const res = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log(res.data.blogs)
        const newBlogs = res.data.blogs || []

        if (isReset || pageNum === 1) {
          setBlogs(newBlogs)
        } else {
          setBlogs((prev) => {
            const existingIds = new Set(prev.map((b) => b._id || b.id))
            const filteredNew = newBlogs.filter((b) => !existingIds.has(b._id || b.id))
            return [...prev, ...filteredNew]
          })}

        setHasMore(newBlogs.length > 0)
      } catch (err) {
        console.error("Error fetching blogs:", err)
        setError("Failed to fetch blogs")
      } finally {
        setLoading(false)
        setBlogsLoading(false)
        setRefetching(false)
      }
    },
    [activeCategory, selectedSubCategory, sortBy, token]
  )

  useEffect(() => {
    setPage(1)
    fetchBlogs(1, true)
  }, [activeCategory, selectedSubCategory, sortBy, fetchBlogs])

  useEffect(() => {
    if (page === 1) return
    fetchBlogs(page)
  }, [page, fetchBlogs])

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !blogsLoading && !loading) {
        setPage((prev) => prev + 1)
      }
    },
    [hasMore, blogsLoading, loading]
  )

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    }

    const observer = new IntersectionObserver(handleObserver, options)
    if (loader.current) observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [handleObserver])

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

  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory)
    setSelectedSubCategory("") // Reset subcategory when main category changes
  }

  const sortedBlogs = useMemo(() => {
    if (!blogs || blogs.length === 0) return []
    return [...blogs].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
  }, [blogs, sortBy])

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <NavigationMenu path={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
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
      <NavigationMenu path={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

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

      {/* Loader for infinite scroll */}
        {reFetching && (
          <div className="flex justify-center mt-4">
            <Circles height="40" width="40" color="#1F3C5F" ariaLabel="loading" />
          </div>
        )}
      
      <div ref={loader} className="flex justify-center items-center py-6"></div>
    </div>
  )
}
