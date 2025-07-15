"use client"

import { useState, useEffect } from "react"
import AdminPanel from "@/components/common/AdminPanel"
import Header from "@/components/Admin/Header"

// Dashboard Sections
import RecentPosts from "@/components/Admin/dashboard/RecentPosts"
import StatCards from "@/components/Admin/dashboard/StatCards"
import NavigationMenu from "@/components/common/NavigationMenu"

// Other Tab Pages
import Posts from "@/components/Admin/posts/Posts"
import PostForm from "@/components/Admin/addPost/PostForm"
import Analytics from "@/components/Admin/Analytics"
import { axiosInstance } from "@/lib/axios"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true) // Add loading state


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Retrieve token from localStorage
        // Assuming the token is stored under 'authToken'. Adjust if your key is different.
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
          
          // Optionally, redirect to login or show an error
        }

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        // Fetch summary data
        const summaryResponse = await axiosInstance.get("/analytics/summary", { headers })
        if (summaryResponse.data.success) {
          const summaryData = summaryResponse.data.data
          setStats({
            "Total Posts": summaryData.totalPosts,
            "Active Users": summaryData.activeUsers,
            "Avg. Read Time": summaryData.avgReadTime + " Min", // Assuming it comes as a number, format as string
            "Newsletter Subscribers": summaryData.newsletters, // Map newsletters to this card
          })
        } else {
          console.error("Failed to fetch summary:", summaryResponse.data.message)
        }

        // Fetch recent posts
        const postsResponse = await axiosInstance.get("/analytics/blogs?page=1&limit=5", { headers })
        if (postsResponse.data.success) {
          setPosts(
            postsResponse.data.data.blogs.map((blog) => ({
              id: blog.id,
              title: blog.title,
              category: blog.category,
              date: new Date(blog.Date).toLocaleDateString(), // Format date
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

    if (activeTab === "dashboard") {
      fetchData()
    }
  }, [activeTab])

  const renderTab = () => {
    switch (activeTab) {
      case "posts":
        return <Posts />

      case "postForm":
        return <PostForm />

      case "analytics":
        return <Analytics />

      case "dashboard":
      default:
        return (
          <>
            <div className="ml-5">
              <NavigationMenu
                path={[
                  { label: "Home", href: "/" },
                  { label: "Dashboard", href: "/dashboard" },
                ]}
              />

              <h1 className="text-3xl text-[#1F3C5F] font-semibold mt-8">Dashboard</h1>
              {/* Dashboard overview cards */}
              {loading ? (
                <div className="text-center mt-10 text-gray-500 animate-pulse">Loading stats...</div>
              ) : (
                stats && <StatCards stats={stats} />
              )}
              {/* Recent posts fetched from API */}
              {loading ? (
                <div className="text-center mt-10 text-gray-500 animate-pulse">Loading recent posts...</div>
              ) : (
                <RecentPosts posts={posts} />
              )}
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar with tab selection */}
      <AdminPanel onSelect={setActiveTab} activeKey={activeTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main dashboard content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 bg-[#F9FBFD]">{renderTab()}</main>
      </div>
    </div>
  )
}

export default DashboardPage
