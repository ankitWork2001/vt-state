"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import blogData from "@/lib/blog"
import BlogCard from "@/components/common/BlogCard"

export default function CategoryCard() {
  const [activeCategory, setActiveCategory] = useState("all")

  // Map category to color
  const categoryColors = {
    motivational: "#1F3C5F",
    essay: "#2B6CB0",
    strategy: "#D69E2E",
    "current affairs": "#38A169",
    all: "#E5E7EB", // default neutral
  }

  const currentColor = categoryColors[activeCategory] || "#1F3C5F"

  const getFilteredBlogs = () => {
    if (activeCategory === "all") {
      return blogData.blogs.slice(0, 6)
    }
    return blogData.blogs
      .filter((blog) => blog.category.toLowerCase() === activeCategory.toLowerCase())
      .slice(0, 6)
  }

  const isActive = (name) => activeCategory === name.toLowerCase()

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        <Link href="/categories">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0">
            View All
          </Button>
        </Link>
      </div>

      {/* Category Cards */}
      <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4 sm:gap-2 gap-4 justify-center items-center ">
        {blogData.categories.map((category) => {
          const active = isActive(category.name)
          const borderColor = active ? categoryColors[category.name.toLowerCase()] : "#e5e7eb"

          return (
           <div
            key={category.id}
            onClick={() => setActiveCategory(category.name.toLowerCase())}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 pt-2 rounded-t-lg rounded-b-none
 pb-10 ${
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
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className={`text-xs font-medium ${active ? "text-xs-black font-bold" : "text-gray-700"}`}>
                {category.name}
              </p>
            </div>
          )
        })}
      </div>

      {/* Blog Section Background Change */}
      <div className={`${activeCategory !== "all" ? "bg-[#E9EBF8]" : ""} p-6 rounded-lg rounded-t-none`}>
        <BlogCard blogs={getFilteredBlogs()} showBorder={false} categoryColor={currentColor} />
      </div>
    </section>
  )
}
