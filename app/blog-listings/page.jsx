"use client"

import { useState, useMemo } from "react"
import FilterTabs from "@/components/BlogListing/FilterTabs"
import BlogViewControls from "@/components/BlogListing/BlogViewControls"
import FilteredBlogs from "@/components/BlogListing/FilteredBlogs"
import NavigationMenu from "@/components/common/NavigationMenu"
import blogData from "@/lib/bloglistings"

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")

  const breadcrumbPath = [{ label: "Home", href: "/" }, { label: "Blog" }]

  // Reset subcategory when main category changes
  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory)
    setSelectedSubCategory("") // Reset subcategory when main category changes
  }

  // Filter and sort blogs based on current selections
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = blogData.blogs

    // Filter by main category
    if (activeCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category.toLowerCase().replace(/\s+/g, "-") === activeCategory)
    }

    // Filter by sub-category
    if (selectedSubCategory) {
      filtered = filtered.filter((blog) => blog.subCategory === selectedSubCategory)
    }

    // Sort blogs
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.timestamp - b.timestamp
        case "popular":
          // For demo purposes, sort by readTime (assuming shorter = more popular)
          return Number.parseInt(a.readTime) - Number.parseInt(b.readTime)
        case "newest":
        default:
          return b.timestamp - a.timestamp
      }
    })

    return sorted
  }, [activeCategory, sortBy, selectedSubCategory])

  return (
    <div className="bg-white min-h-screen">
      <NavigationMenu path={breadcrumbPath} />

      <FilterTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categories={blogData.categories}
        selectedSubCategory={selectedSubCategory}
        onSubCategoryChange={setSelectedSubCategory}
      />

      <BlogViewControls sortBy={sortBy} onSortChange={setSortBy} />

      <FilteredBlogs blogs={filteredAndSortedBlogs} />
    </div>
  )
}
