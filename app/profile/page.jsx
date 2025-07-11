"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { axiosInstance } from "@/lib/axios"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ArticleList from "@/components/Profile/ArticleList"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Please login to view your profile")
        return
      }

      const response = await axiosInstance.get("/auth/user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUser(response.data)
    } catch (err) {
      console.error("Error fetching user profile:", err)
      setError("Failed to load profile")
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (updatedData) => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Please login to update your profile")
        return
      }

      const formData = new FormData()
      formData.append("username", updatedData.username)
      
      if (updatedData.profilePic) {
        formData.append("profilePic", updatedData.profilePic)
      }

      const response = await axiosInstance.patch("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })

      if (response.data.message) {
        toast.success(response.data.message)
        
        // Update user state with new data
        setUser(prev => ({
          ...prev,
          username: response.data.user.username,
          profilePic: response.data.user.profilePic
        }))

        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const updatedUser = {
          ...storedUser,
          username: response.data.user.username,
          profilePic: response.data.user.profilePic
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        
        // Dispatch event to update navbar
        window.dispatchEvent(new Event("authChange"))
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error(err.response?.data?.message || "Failed to update profile")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto  px-4">
        <ProfileHeader loading={true} />
        <div className="mt-6">
          <div className="w-full px-4 pb-8 h-auto min-w-fit max-w-full border">
            <div className="h-6 bg-gray-300 rounded mb-6 animate-pulse"></div>
            <div className="px-6 max-w-5xl mx-auto">
              <div className="flex gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-300 p-4 rounded animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-28 h-20 bg-gray-300 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto  px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchUserProfile}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="pb-8 px-4">
      <ProfileHeader 
        profile={{
          name: user?.username || "User",
          email: user?.email || "",
          profilePic: user?.profilePic,
          subtitles1: user?.isAdmin ? "Admin" : "User",
          subtitles2: "Member"
        }}
        onUpdate={handleProfileUpdate}
      />
      <div className="mt-6">
        <div className="w-full px-4 py-8 h-auto min-w-fit max-w-full border">
          <h1 className="text-2xl font-bold mb-6">Saved Articles and Likes</h1>
          <ArticleList 
            likedBlogs={user?.likedBlogs || []}
            savedBlogs={user?.savedBlogs || []}
          />
        </div>
      </div>
    </div>
  )
}
