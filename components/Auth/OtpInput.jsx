"use client"

import { useState, useRef, useEffect } from "react"

export default function OtpInput({ onComplete, onResend, timer, loading }) {
  const [otp, setOtp] = useState(new Array(6).fill(""))
  const [hasCompleted, setHasCompleted] = useState(false)
  const inputRefs = useRef([])

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete and call onComplete only once
    const otpValue = newOtp.join("")
    if (otpValue.length === 6 && !hasCompleted && !loading) {
      setHasCompleted(true)
      onComplete(otpValue)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus()
        newOtp[index - 1] = ""
      } else {
        newOtp[index] = ""
      }
      setOtp(newOtp)

      // Reset completion state if user is editing
      if (hasCompleted) {
        setHasCompleted(false)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text")
    const pasteArray = pasteData.slice(0, 6).split("")

    if (pasteArray.every((char) => !isNaN(Number(char)))) {
      const newOtp = [...otp]
      pasteArray.forEach((char, index) => {
        if (index < 6) newOtp[index] = char
      })
      setOtp(newOtp)

      // Focus last filled input or next empty one
      const lastIndex = Math.min(pasteArray.length - 1, 5)
      inputRefs.current[lastIndex]?.focus()

      // Check if OTP is complete after paste
      const otpValue = newOtp.join("")
      if (otpValue.length === 6 && !hasCompleted && !loading) {
        setHasCompleted(true)
        onComplete(otpValue)
      }
    }
  }

  // Reset completion state when loading changes
  useEffect(() => {
    if (!loading) {
      setHasCompleted(false)
    }
  }, [loading])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleManualSubmit = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6 && !hasCompleted && !loading) {
      setHasCompleted(true)
      onComplete(otpValue)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">OTP Verification</h2>
      <p className="text-sm text-gray-600 mb-6 text-center px-4">
        Enter the 6-digit code we have sent to your Email ID / Phone
      </p>

      <div className="text-lg font-semibold mb-6 text-center">{formatTime(timer)}</div>

      <div className="flex justify-center gap-2 mb-6 px-4">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 border-2 border-gray-300 rounded text-center text-lg font-semibold focus:border-blue-500 focus:outline-none bg-white"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={loading}
          />
        ))}
      </div>

      <div className="mb-6 text-center">
        <span className="text-sm text-gray-600">Didn't receive OTP? </span>
        <button
          onClick={onResend}
          disabled={timer > 0 || loading}
          className={`text-sm underline ${
            timer > 0 || loading ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
          }`}
        >
          Resend
        </button>
      </div>

      <button
        onClick={handleManualSubmit}
        disabled={loading || otp.join("").length !== 6 || hasCompleted}
        className="cursor-pointer p-3 text-white bg-[#8BC54B] hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded h-12 w-full max-w-[280px] font-semibold text-sm"
      >
        {loading ? "VERIFYING..." : "SUBMIT"}
      </button>
    </div>
  )
}
