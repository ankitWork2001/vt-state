"use client"
import { useState, useEffect } from "react"
import { Menu, UserCircle2, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
const Header = ({ onMenuClick }) => {
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user")
      if (userString) {
        try {
          const user = JSON.parse(userString)
          setUserData(user)
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e)
        }
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.clear() // Clear all local storage data
      router.push("/admin/login") // Redirect to login page
    }
  }

  return (
    <header className="bg-[#CED9E6] py-3 h-[97px] px-6 flex justify-between items-center rounded-md shadow relative z-40">
      {/* Mobile Menu Button */}
      <button className="sm:hidden bg-[#FAFAFA] p-2 rounded-md" onClick={onMenuClick}>
        <Menu size={24} className="text-[#1F3C5F]" />
      </button>

      {/* User Profile - Now visible on all screen sizes */}
      <div className="flex items-center gap-2 ml-auto">
        {" "}
        {/* Use ml-auto to push to right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="w-14 h-14 border-2 border-[#1F3C5F]">
              {userData?.profilePic ? (
                <AvatarImage src={userData.profilePic || "/placeholder.svg"} alt={userData.username || "User"} />
              ) : (
                <AvatarFallback className="bg-[#FAFAFA]">
                  <UserCircle2 size={24} className="text-gray-700" />
                </AvatarFallback>
              )}
            </Avatar>
              {/* Display "Admin 322" or dynamic username if available */}
              <span className="text-sm font-medium text-[#1F3C5F] hidden sm:block">{userData?.username || "Admin"}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center gap-2">
              <LogOut size={16} /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
