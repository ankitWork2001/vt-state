"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { axiosInstance } from "@/lib/axios"
import OtpInput from "@/components/auth/OtpInput"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      await axiosInstance.post("/auth/forgot-password", {
        email,
      })

      toast.success("OTP sent to your email successfully!")
      setStep("otp")
      setTimer(60)
    } catch (error) {
      console.error("Forgot password error:", error)
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpComplete = async (otpValue) => {
    if (loading || otpValue.length !== 6) return

    setLoading(true)

    try {
      // Verify OTP first
      const verifyResponse = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: otpValue,
      })

      if (verifyResponse.data.success) {
        toast.success("OTP verified successfully!")
        setOtp(otpValue)
        setStep("reset")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
      })

      toast.success("Password reset successful!")

      // Auto login after password reset
      const loginResponse = await axiosInstance.post("/auth/login", {
        email,
        password: newPassword,
      })

      if (loginResponse.data.token && loginResponse.data.user) {
        localStorage.setItem("token", loginResponse.data.token)
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user))

        toast.success("Welcome back! You're now logged in.")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error(error.response?.data?.message || "Password reset failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (loading || timer > 0) return

    setLoading(true)

    try {
      await axiosInstance.post("/auth/forgot-password", {
        email,
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
          {step === "email" && (
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-900 mb-2">Reset your password</h2>
              <p className="text-center text-sm text-gray-600 mb-6">Enter your email to receive OTP</p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#8BC54B] hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {step === "otp" && (
            <OtpInput onComplete={handleOtpComplete} onResend={handleResendOtp} timer={timer} loading={loading} />
          )}

          {step === "reset" && (
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-900 mb-6">Set new password</h2>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent font-medium"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#8BC54B] hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
