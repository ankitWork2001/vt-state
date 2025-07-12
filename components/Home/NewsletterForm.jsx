"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { axiosInstance } from "@/lib/axios"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to subscribe")
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post(
        "/newsletter/subscribe",
        { email: email.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.message) {
        toast.success(response.data.message)
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error(error.response?.data?.message || "Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-8 sm:py-12 px-4 mx-auto">
      <div className="border border-[#1F3C5F] rounded-none shadow-none">
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F3C5F] mb-1">
            Subscribe to our news letter
          </h2>
          <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#1F3C5F] mb-4">Stay Updated!</h3>
          <p className="text-[#151515] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
            No spam. Weekly resources for your journey
          </p>

          <form onSubmit={handleSubmit} className="max-w-sm sm:max-w-md mx-auto w-full">
            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
              <input
                type="email"
                placeholder="Your Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:outline-none py-2 sm:py-3 placeholder-[#1F3C5F] placeholder:font-bold text-[#1F3C5F] font-bold text-sm sm:text-base disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF914D] hover:bg-[#e8823d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 sm:py-3 rounded-md font-semibold w-full sm:w-auto sm:mx-auto transition-colors"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
