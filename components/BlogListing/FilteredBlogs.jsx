import { Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FilteredBlogs({ blogs }) {
  if (blogs.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-6 py-8 text-center">
        <p className="text-gray-500">No blogs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-4">
      <div className="">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border border-gray-200  p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 p-4">
              <div className="flex-shrink-0">
                <Link href={`/blog-listings/${blog.id}`}>
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    width={200}
                    height={150}
                    className="w-48 h-36 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/blog-listings/${blog.id}`}>
                      <h3 className="text-lg font-semibold text-[#060606] mb-2 line-clamp-2 hover:text-[#1F3C5F] transition-colors cursor-pointer">
                        {blog.title}
                      </h3>
                    </Link>

                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-md font-medium text-[#35590E] bg-#FFFFFF rounded">
                        #{blog.category.replace(/\s+/g, "")}
                      </span>
                    </div>

                    <p className="text-[#060606] text-sm mb-3 line-clamp-3">
                      {blog.excerpt}...{" "}
                      <Link
                        href={`/blog-listings/${blog.id}`}
                        className="text-[#060606] hover:text-[#1F3C5F] font-medium underline"
                      >
                        Read more
                      </Link>
                    </p>

                    <div className="flex flex-col">
                      <div>
                      <span className='text-[#060606] underline'>By {blog.author}</span>
                      </div>
                      <div className="flex items-center text-[#060606]  mt-2 gap-2">
                      
                      <span className="font-semibold mr-2">{blog.publishedDate}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <button className="flex-shrink-0 p-2 hover:bg-gray-100 rounded">
                    <Bookmark className="w-5 h-5 text-[#000000]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
