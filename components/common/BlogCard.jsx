"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import DOMPurify from 'isomorphic-dompurify';


// Blog skeleton component
function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-full">
          <Card className="h-full flex flex-col overflow-hidden rounded-none border border-gray-200 animate-pulse">
            <div className="p-5 bg-white">
              <div className="relative w-full h-48 bg-gray-300 rounded"></div>
            </div>
            <div className="flex flex-col flex-grow px-5 pt-0 pb-5 bg-white">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="flex items-center justify-between mt-auto">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default function BlogCard({ blogs, showBorder = true, loading = false }) {
  if (loading) {
    return (
      <div className={showBorder ? "border border-gray-200 rounded-lg p-6 bg-white" : ""}>
        <BlogSkeleton />
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No  blogs found for this category.</p>
        <p className="text-sm mt-2">Try selecting a different category or check back later.</p>
      </div>
    )
  }

  const containerClass = showBorder ? "border border-gray-200 rounded-lg p-6 bg-white" : ""

  return (
    <div className={containerClass}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog-listings/${blog.id}`} passHref>
            <div className="h-full">
              <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg cursor-pointer rounded-none border border-gray-200">
                {/* Image Section */}
                <div className="p-5 bg-white">
                  <div className="relative w-full h-48">
                    <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white text-green-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                        #{blog.category.replace(" ", "")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow px-5 pt-0 pb-5 bg-white">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-[#1F3C5F] line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{blog.publishedDate}</p>

                  <p className="text-[#335A8A] text-sm mb-4 line-clamp-3">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            `${blog.excerpt || ""} <span class='text-[#335A8A] hover:text-[#1F3C5F] ml-1 font-medium underline'>Read more</span>`
                          ),
                        }}
                      />
                    </p>


                  {/* Footer aligned at bottom */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <span>By {blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
