import { Button } from "@/components/ui/button"
import Link from "next/link"
import blogData from "@/lib/blog.js"
import BlogCard from "@/components/common/BlogCard"

export default function TrendingBlogs() {
  const trendingBlogs = blogData.blogs.slice(0, 3)

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Trending</h2>
        <Link href="/trending">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0">
            View All
          </Button>
        </Link>
      </div>

      <BlogCard blogs={trendingBlogs} showBorder={false} />
    </section>
  )
}
