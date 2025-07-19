import { Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import BlogSkeleton from "./BlogSkeleton"
import DOMPurify from 'isomorphic-dompurify';

export default function FilteredBlogs({ blogs, loading = false }) {
  if (loading) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

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
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Link key={blog.id || blog._id} href={`/blog-listings/${blog.id || blog._id}`} className="block">
            <div className="bg-white border border-black p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Centered Image */}
                <div className="flex-shrink-0 w-full sm:w-48 flex items-center justify-center">
                  <Image
                    src={blog.thumbnail || "/placeholder.svg?height=150&width=200"}
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
                      #{blog.categoryId?.name || "General"}
                    </span>
                  </div>

                  {/* content */}
                  <div className="text-[#060606] text-sm sm:text-base mb-3 leading-relaxed">
   {blog.content || blog.description ? (
    <>
            {blog.content && blog.content.length > 300 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `${truncateText(blog.content, 300)}... <span class='text-[#060606] hover:text-[#1F3C5F] font-medium underline'>Read more</span>`
                  ),
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `${blog.content || blog.description} <span class='text-[#060606] hover:text-[#1F3C5F] font-medium underline'>Read more</span>`
                  ),
                }}
              />
            )}
    </>
  ) : (
    <span className="text-[#060606] hover:text-[#1F3C5F] font-medium underline">Read more</span>
  )}
</div>


                  {/* Author & Meta */}
                  <div className="flex flex-col">
                    <div>
                      <span className="text-[#060606] underline">By {blog.author?.username || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center text-[#060606] mt-2 gap-2">
                      <span className="font-semibold mr-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{blog.readTime || "5 Min Reading"}</span>
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
