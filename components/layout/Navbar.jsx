"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Function to check and update user state
  const checkUserAuth = () => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    // Check user auth on mount
    checkUserAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        checkUserAuth()
      }
    }

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkUserAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("authChange", handleAuthChange)

    // Check auth state periodically (in case localStorage changes)
    const interval = setInterval(checkUserAuth, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authChange", handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleSignOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setIsProfileMenuOpen(false)
    toggleMenu();
    toast.success("Signed out successfully")
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"))
    router.push("/")
  }

  const handleSignIn = () => {
    router.push("/auth/login")
  }

  const handleProfile = () => {
    setIsProfileMenuOpen(false)
    toggleMenu();
    router.push("/profile")
  }

  // const handleSettings = () => {
  //   setIsProfileMenuOpen(false)
  //   router.push("/settings")
  // }

  return (
    <nav className="bg-white px-4 sm:px-8 lg:px-20 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100 h-[70px] sm:h-[80px]">
      {/* Logo */}
      <div className="text-black font-bold text-lg sm:text-xl flex items-center">
        <span className="mr-2 text-xl sm:text-2xl">♦</span>
        <Link href="/" className="hover:text-[#FF914D] transition-colors">
          <span className="hidden sm:inline">Mindful Path</span>
          <span className="sm:hidden">Mindful Path</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
        <Link
          href="/"
          className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/blog-listings"
          className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base transition-colors duration-200"
        >
          Blog list
        </Link>
        <Link
          href="/about"
          className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base transition-colors duration-200"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base transition-colors duration-200"
        >
          Contact
        </Link>

        {/* Authentication Section */}
        {user ? (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Image
                src={user.profilePic || "/placeholder.svg?height=40&width=40"}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-gray-200"
              />
              
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {user.isAdmin && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={handleProfile}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>

                {/* <button
                  onClick={handleSettings}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button> */}

                <hr className="my-1" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-2 transition-all duration-200"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 text-[#1F3C5F] hover:text-[#FF914D] transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="flex flex-col space-y-1 p-4">
            <Link
              href="/"
              className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base py-3 px-2 transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog-listings"
              className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base py-3 px-2 transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog list
            </Link>
            <Link
              href="/about"
              className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base py-3 px-2 transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[#1F3C5F] hover:text-[#FF914D] font-medium text-base py-3 px-2 transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Authentication Section */}
            {user ? (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-3 px-2 py-3">
                  <Image
                    src={user.profilePic || "/placeholder.svg?height=40&width=40"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    {user.isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleProfile}
                  className="w-full flex items-center px-2 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>

                {/* <button
                  onClick={handleSettings}
                  className="w-full flex items-center px-2 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button> */}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-2 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-3 mt-2 transition-all duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close profile menu */}
      {isProfileMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />}
    </nav>
  )
}
