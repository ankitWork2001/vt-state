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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   ">
        {blogs.map((blog) => (
         <Card
  key={blog.id}
  className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer rounded-none border border-gray-200"
>
  <div className="p-5 bg-white">
   <div className="relative w-full h-48">
  <Image
    src={blog.image || "/placeholder.svg"}
    alt={blog.title}
    fill
    className="object-cover"
  />

  <div className="absolute top-2 left-2">
    <Badge className="bg-white text-green-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
      #{blog.category.replace(" ", "")}
    </Badge>
  </div>
</div>

  </div>

  <div className="p-5 pt-3">
    <Link href={`/blog/${blog.id}`}>
      <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-[#1F3C5F] line-clamp-2">
        {blog.title}
      </h3>
    </Link>

    <p className="text-xs text-gray-500 mb-2">{blog.publishedDate}</p>

    <p className="text-[#335A8A] text-sm mb-4 line-clamp-3">
      {blog.excerpt}
      <Link href={`/blog-listings/${blog.id}`} className="text-[#335A8A] hover:text-[#1F3C5F] ml-1 font-medium underline">
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
