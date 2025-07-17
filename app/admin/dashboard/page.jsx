"use client"

import {axiosInstance} from "@/lib/axios"
import { useState, useEffect } from "react"
import Posts from "@/components/Admin/posts/Posts"
import PostForm from "@/components/Admin/addPost/PostForm"
import Analytics from "@/components/Admin/Analytics"
import StatCards from "@/components/Admin/dashboard/StatCards"
import RecentPosts from "@/components/Admin/dashboard/RecentPosts"
import AdminPanel from "@/components/common/AdminPanel"
import Header from "@/components/Admin/Header"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const userString = localStorage.getItem("user")
        let token = ""
        if (userString) {
          try {
            const user = JSON.parse(userString)

            token = localStorage.getItem("token") || ""
          } catch (e) {
            console.error("Failed to parse user string from localStorage:", e)
          }
        }

        if (!token) {
          console.warn("Authentication token not found in localStorage. API calls might fail.")
        }

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const summaryResponse = await axiosInstance.get("/analytics/summary", {
          headers,
        })
        if (summaryResponse.data.success) {
          const summaryData = summaryResponse.data.data
          setStats({
            "Total Posts": summaryData.totalPosts,
            "Active Users": summaryData.activeUsers,
            "Avg. Read Time": summaryData.avgReadTime + " Min",
            "Newsletter Subscribers": summaryData.newsletters,
          })
        } else {
          console.error("Failed to fetch summary:", summaryResponse.data.message)
        }

        const postsResponse = await axiosInstance.get("/analytics/blogs?page=1&limit=5", { headers })
        if (postsResponse.data.success) {
          setPosts(
            postsResponse.data.data.blogs.map((blog) => ({
              id: blog.id,
              title: blog.title,
              category: blog.category,
              date: new Date(blog.Date).toLocaleDateString(),
              views: blog.views,
            })),
          )
        } else {
          console.error("Failed to fetch posts:", postsResponse.data.message)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderTab = () => {
    const commonNav = (currentTabName) => (
      <nav className="bg-[#F4F6F9] max-w-[1240px] mx-auto h-10 text-sm text-[#6C757D] flex items-center font-normal px-6 py-4">
        <div>
          <span className="hover:underline cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            {"Dashboard"}
          </span>
          <span className="mx-1 font-medium">{">"}</span>
          <span className="text-[#6C757D]">{currentTabName}</span>
        </div>
      </nav>
    )

    switch (activeTab) {
      case "posts":
        return (
          <>
            {commonNav("Posts")}
            <Posts setActiveTab={setActiveTab} />
          </>
        )

      case "postForm":
        return (
          <>
            {commonNav("Add New Post")}
            <PostForm setActiveTab={setActiveTab} />
          </>
        )

      

      case "dashboard":
      default:
        return (
          <>
            {commonNav("")}
            <div>
              <h1 className="text-3xl text-[#1F3C5F] font-semibold mt-8">Dashboard</h1>
              {loading ? (
                <div className="text-center mt-10 text-gray-500 animate-pulse">
                  <StatCards loading={true} />
                </div>
              ) : (
                stats && <StatCards stats={stats} />
              )}
              {loading ? (
                <div className="text-center mt-10 text-gray-500 animate-pulse">Loading recent posts...</div>
              ) : (
                <RecentPosts
                  posts={posts.slice(0, 5)}
                  onUpdate={(updatedPost) => {
                    setPosts((prev) =>
                      prev.map((p) => ((p.id || p._id) === (updatedPost.id || updatedPost._id) ? updatedPost : p)),
                    )
                  }}
                  onDelete={(deletedId) => {
                    setPosts((prev) => prev.filter((p) => (p.id || p._id) !== deletedId))
                  }}
                />
              )}
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AdminPanel onSelect={setActiveTab} activeKey={activeTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 bg-[#F9FBFD]">{renderTab()}</main>
      </div>
    </div>
  )
}

export default DashboardPage
