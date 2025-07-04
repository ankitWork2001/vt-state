import { Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FilteredBlogs({ blogs }) {
  if (blogs.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-gray-500">No blogs found matching your criteria.</p>
      </div>
    )
  }

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim()
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4">
      <div>
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog-listings/${blog.id}`} className="block">
            <div className="bg-white border border-black p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Centered Image */}
                <div className="flex-shrink-0 w-full sm:w-48 flex items-center justify-center">
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    width={200}
                    height={150}
                    className="object-cover rounded w-full sm:w-48 h-48 sm:h-36"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold text-[#060606] line-clamp-2 hover:text-[#1F3C5F] transition-colors">
                      {blog.title}
                    </h3>

                    {/* Bookmark */}
                    <button className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors ml-2">
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-[#000000]" />
                    </button>
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-sm font-medium text-[#35590E] bg-gray-50 rounded">
                      #{blog.category.replace(/\s+/g, "")}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <div className="text-[#060606] text-sm sm:text-base mb-3 leading-relaxed">
                    {blog.excerpt && blog.excerpt.length > 300 ? (
                      <>
                        {truncateText(blog.excerpt, 300)}...{" "}
                        <span className="text-[#060606] hover:text-[#1F3C5F] font-medium underline">
                          Read more
                        </span>
                      </>
                    ) : (
                      <>
                        {blog.excerpt}{" "}
                        {blog.excerpt && (
                          <span className="text-[#060606] hover:text-[#1F3C5F] font-medium underline">
                            Read more
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Author & Meta */}
                  <div className="flex flex-col">
                    <div>
                      <span className="text-[#060606] underline">By {blog.author}</span>
                    </div>
                    <div className="flex items-center text-[#060606] mt-2 gap-2">
                      <span className="font-semibold mr-2">{blog.publishedDate}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
