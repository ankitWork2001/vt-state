"use client"
import { useEffect, useState } from "react"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import Image from "next/image"
import { axiosInstance } from "@/lib/axios"

const PostDetail = ({ post, onBack }) => {
  const [fullPost, setFullPost] = useState(post)
  const [comments, setComments] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [showFullContent, setShowFullContent] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        const [blogRes, commentRes, analyticsres] = await Promise.all([
          axiosInstance.get(`/blogs/${post.id}`),
          axiosInstance.get(`/comments/${post.id}`),
          axiosInstance.get(`/analytics/article/${post.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        if (blogRes.data?.blog) setFullPost(blogRes.data.blog)
        console.log("ress", blogRes.data.blog)
        if (analyticsres.data) setAnalytics(analyticsres.data.data)

        if (commentRes.data?.comments) setComments(commentRes.data.comments)
      } catch (error) {
        console.error("Error fetching post or comments:", error)
      }
    }

    fetchDetails()
  }, [post.id])

  if (!fullPost) return <div className="text-center py-10 text-gray-500">Post not found.</div>

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        &larr; Back to Posts
      </button>

      <h2 className="text-2xl font-semibold text-[#1F3C5F] mb-4">Performance Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card title="Views" value={analytics.views || 0} sub="28 more than usual" />
        <Card
          title="Time Spent (hours)"
          value={((analytics.avgReadTime ?? 84) / 60).toFixed(2)}
          sub="24% more than previous 28 days"
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{fullPost.title}</h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        {new Date(post.Date).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>

      {fullPost.thumbnail && (
        <div className="mb-4 text-center">
          <Image
            src={fullPost.thumbnail || "/placeholder.svg"}
            alt={fullPost.title}
            width={20}
            height={10}
            className="mx-auto w-full max-w-[430px] h-[277px] sm:w-auto rounded-md bg-red-200 object-cover"
          />
        </div>
      )}

      <div className="flex justify-center gap-6 text-gray-700 mb-6 flex-wrap">
        <div className="flex items-center gap-1">
          <Heart className="text-red-500" size={18} /> {fullPost.likes?.length || 0}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={18} /> {comments.length || 0}
        </div>
        <div className="flex items-center gap-1">
          <Bookmark size={18} /> {fullPost.bookmarks?.length || 0}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{fullPost.title}</h3>
      <div
        className={`text-gray-700 leading-relaxed mb-4 prose prose-sm sm:prose-base max-w-none ${
          showFullContent ? "text-[17px]" : "text-base"
        }`}
        dangerouslySetInnerHTML={{
          __html: showFullContent ? fullPost.content : (fullPost.content?.slice(0, 250) || "") + "...",
        }}
      />

      <div className="text-right">
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="px-4 py-2 text-red border border-red-300 rounded hover:bg-red-600 hover:text-white transition"
        >
          {showFullContent ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  )
}

const Card = ({ title, value, sub }) => (
  <div className="border p-4 rounded-md bg-gray-50 h-[150px] shadow-sm">
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className="text-2xl font-bold text-[#1F3C5F] mt-1">{value}</p>
    {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
  </div>
)

export default PostDetail
