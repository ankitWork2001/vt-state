import Link from "next/link"
import BlogCard from "@/components/common/BlogCard"

// Mock data - replace with your actual data
const mockBlogs = [
  {
    id: 1,
    title: "How to Crack UPSC in First Attempt",
    category: "Strategy",
    image: "/images/tempImage.jpg",
    excerpt: "Learn the proven strategies that helped toppers crack UPSC in their first attempt...",
    author: "Priya Sharma",
    publishedDate: "2024-01-15",
    readTime: "8 min reading",
  },
  {
    id: 2,
    title: "Daily Current Affairs - January 2024",
    category: "Current Affairs",
    image: "/images/tempImage.jpg",
    excerpt: "Stay updated with the latest current affairs that are important for UPSC preparation...",
    author: "Rajesh Kumar",
    publishedDate: "2024-01-14",
    readTime: "5 min reading",
  },
  {
    id: 3,
    title: "Motivational Stories from UPSC Toppers",
    category: "Motivational",
    image: "/images/tempImage.jpg",
    excerpt: "Read inspiring stories from UPSC toppers who overcame challenges to achieve their dreams...",
    author: "Anita Singh",
    publishedDate: "2024-01-13",
    readTime: "6 min reading",
  },
]

export default function TrendingBlogs() {
  return (
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending</h2>
        <Link href="/trending">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">View All</button>
        </Link>
      </div>

      <BlogCard blogs={mockBlogs} showBorder={false} />
    </section>
  )
}
