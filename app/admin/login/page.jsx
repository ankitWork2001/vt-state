"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { axiosInstance } from "@/lib/axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)          // for login submission
  const [checkingAuth, setCheckingAuth] = useState(true) // for initial token check/
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setCheckingAuth(false)
        return
      }

      try {
        const response = await axiosInstance.get("/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const isValidUser = response?.data?.user
        if (isValidUser) {
          toast.success("Already logged in")
          router.push("/admin/dashboard")
        } else {
          setCheckingAuth(false)
        }
      } catch (error) {
        console.log("Token invalid or expired:", error.response?.data?.message)
        setCheckingAuth(false)
      }
    }

    verifyToken()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      const response = await axiosInstance.post("/auth/admin/login", {
        email,
        password,
      })

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        toast.success("Login successful! Welcome back.")
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <AuthLoginSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mindful Path</h1>
        </div>

        <div className="bg-[#E9EBF8] rounded-lg shadow-md p-8">
          <div>
            <h2 className="text-center text-lg font-semibold text-gray-900 mb-2">Admin Dashboard Access</h2>
            <p className="text-center text-sm text-gray-600 mb-6">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter Phone / Email ID"
                  className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#8BC54B] hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200"
              >
                {loading ? "Logging in..." : "Continue"}
              </button>
            </form>

            {/* Uncomment if needed */}
            {/* <div className="mt-6 flex justify-between text-sm">
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Create account
              </Link>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthLoginSkeleton() {
  return (
    <div className="bg-[#E9EBF8] rounded-lg shadow-md p-8 animate-pulse w-full max-w-md">
      <div>
        <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>

        <div className="space-y-4">
          <div className="h-12 bg-gray-300 rounded w-full"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
          <div className="h-12 bg-gray-400 rounded w-full"></div>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}
