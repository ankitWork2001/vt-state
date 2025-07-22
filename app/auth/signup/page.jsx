"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { axiosInstance } from "@/lib/axios"
import OtpInput from "@/components/Auth/OtpInput"

export default function SignupPage() {
  const [step, setStep] = useState("signup")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (loading || otpSent) return

    // Validation
    if (!formData.username.trim()) {
      toast.error("Username is required")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post("/auth/request-otp", {
        email: formData.email,
      })

      if (response.data.message) {
        toast.success("OTP sent to your email successfully!")
        setStep("otp")
        setTimer(60)
        setOtpSent(true)
      }
    } catch (error) {
      console.error("OTP request error:", error)
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpComplete = async (otpValue) => {
    if (loading || otpValue.length !== 6) return

    setLoading(true)

    try {
      // Register with OTP
      await axiosInstance.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp: otpValue,
      })

      toast.success("Registration successful!")

      // Auto login after successful registration
      const loginResponse = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      if (loginResponse.data.token && loginResponse.data.user) {
        localStorage.setItem("token", loginResponse.data.token)
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user))

        toast.success("Welcome! You're now logged in.")
        router.push("/")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (loading || timer > 0) return

    setLoading(true)

    try {
      await axiosInstance.post("/request-otp", {
        email: formData.email,
      })

      toast.success("OTP resent successfully!")
      setTimer(60)
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mindful Path</h1>
        </div>

        <div className="bg-[#E9EBF8] rounded-lg shadow-md p-8">
          {step === "signup" ? (
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-900 mb-6">Create your account</h2>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpSent}
                  className="w-full py-3 px-4 bg-[#8BC54B] hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          ) : (
            <OtpInput onComplete={handleOtpComplete} onResend={handleResendOtp} timer={timer} loading={loading} />
          )}
        </div>
      </div>
    </div>
  )
}
