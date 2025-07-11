"use client"

import { useState } from "react"
import ArticleCard from "./ArticleCard"
import EmptyState from "./EmptyState"

export default function ArticleList({ likedBlogs = [], savedBlogs = [] }) {
  const [activeTab, setActiveTab] = useState("All")
  const [showAll, setShowAll] = useState(false)

  // Transform API data to match component structure
  const transformBlogData = (blogs) => {
    return blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      slug: blog._id,
      category: blog.categoryId?.name || "General",
      image: blog.thumbnail || "/placeholder.svg?height=100&width=100",
      createdAt: blog.createdAt, // Keep the original createdAt for formatting
    }))
  }

  // Remove duplicates by creating a Map with blog ID as key
  const getUniqueArticles = (liked, saved) => {
    const articleMap = new Map()

    // Add liked articles
    liked.forEach((article) => {
      articleMap.set(article.id, article)
    })

    // Add saved articles (won't overwrite if already exists)
    saved.forEach((article) => {
      if (!articleMap.has(article.id)) {
        articleMap.set(article.id, article)
      }
    })

    return Array.from(articleMap.values())
  }

  const likedArticles = transformBlogData(likedBlogs)
  const bookmarkedArticles = transformBlogData(savedBlogs)
  const allArticles = getUniqueArticles(likedArticles, bookmarkedArticles)

  let visibleArticles = []

  if (activeTab === "Liked") {
    visibleArticles = likedArticles
  } else if (activeTab === "Bookmarked") {
    visibleArticles = bookmarkedArticles
  } else {
    visibleArticles = showAll ? allArticles : allArticles.slice(0, 3)
  }

  return (
    <div className="px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Liked", "Bookmarked"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setShowAll(false)
            }}
            className={`px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
              activeTab === tab
                ? "bg-[#6594CD] text-white border-[#6594CD]"
                : "bg-white border-[#6594CD] text-[#6594CD] hover:bg-[#6594CD] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {visibleArticles.length === 0 ? (
          <EmptyState />
        ) : (
          visibleArticles.map((article) => <ArticleCard key={article.id} article={article} />)
        )}
      </div>

      {/* View All Button */}
      {activeTab === "All" && !showAll && allArticles.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="text-[#6594CD] hover:text-white border border-[#6594CD] hover:bg-[#6594CD] px-6 py-2 rounded-lg text-sm font-medium transition-all"
          >
            View All ({allArticles.length - 3} more)
          </button>
        </div>
      )}
    </div>
  )
}
