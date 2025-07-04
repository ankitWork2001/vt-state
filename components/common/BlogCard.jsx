import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function BlogCard({ blogs, showBorder = true }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No blogs found for this category.</p>
        <p className="text-sm mt-2">Try selecting a different category or check back later.</p>
      </div>
    )
  }

  const containerClass = showBorder ? "border border-gray-200 rounded-lg p-6 bg-white" : ""

  return (
    <div className={containerClass} >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {blogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48 w-full">
              <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
                  #{blog.category.replace(" ", "")}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <Link href={`/blog/${blog.slug}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">{blog.title}</h3>
              </Link>

              <p className="text-xs text-gray-500 mb-3">{blog.publishedDate}</p>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {blog.excerpt}
                <Link href={`/blog/${blog.slug}`} className="text-blue-600 hover:text-blue-800 ml-1 font-medium">
                  Read more
                </Link>
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {blog.author}</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
