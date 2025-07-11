"use client"

import Image from "next/image"
import Link from "next/link"

export default function ArticleCard({ article }) {
  // Format date from createdAt
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("en-GB", options)
  }

  return (
    <>
      {/* Mobile Layout - Vertical Stack */}
      <div className="block lg:hidden border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="relative w-full h-48">
          <Image src={article.image || "/placeholder.svg"} alt="thumb" fill className="object-cover" />
        </div>
        <div className="p-4 sm:flex sm:flex-col sm:items-start">
          <p className="text-sm text-gray-600 mb-2">📝 {article.category}</p>
          <h3 className="font-medium text-lg mb-3 leading-tight text-gray-900">{article.title}</h3>
          {article.createdAt && <p className="text-xs text-gray-500 mb-4">{formatDate(article.createdAt)}</p>}
          <div className="flex justify-center w-full">
          <Link href={`/blog-listings/${article.id}`} className="inline-block">
            <button className="text-red-600 border border-red-500 px-6 py-2 rounded hover:bg-red-50 text-sm font-medium transition-colors">
              Read
            </button>
          </Link>
          </div>
            
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden lg:block border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center p-4 gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <Image
              src={article.image || "/placeholder.svg"}
              alt="thumb"
              width={150}
              height={100}
              className="rounded object-cover w-[150px] h-[100px]"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 mb-1">📝 {article.category}</p>
            <h3 className="font-medium text-lg mb-2 leading-tight text-gray-900">{article.title}</h3>
            {article.createdAt && <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>}
          </div>

          {/* Read Button */}
          <div className="flex-shrink-0">
            <Link href={`/blog-listings/${article.id}`}>
              <button className="text-red-600 border border-red-500 px-6 py-2 rounded hover:bg-red-50 text-sm font-medium transition-colors">
                Read
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
