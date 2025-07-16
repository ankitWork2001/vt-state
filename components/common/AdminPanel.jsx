"use client"
import { useRouter } from "next/navigation"
import { Home, FileText, Edit3, BarChart2, X } from "lucide-react" // Removed UserCircle2, LogOut
import Image from "next/image"
// Removed DropdownMenu, Avatar imports

const AdminPanel = ({ onSelect, activeKey, isOpen, setIsOpen }) => {
  const router = useRouter()
  // Removed userData state and useEffect for fetching it
  // Removed handleSignOut function

  const menuItems = [
    { icon: <Home size={18} />, label: "Dashboard", key: "dashboard" },
    { icon: <FileText size={18} />, label: "Posts", key: "posts" },
    { icon: <Edit3 size={18} />, label: "Post Form", key: "postForm" },
    { icon: <BarChart2 size={18} />, label: "Analytics", key: "analytics" },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed sm:relative top-0 left-0 h-screen w-60 bg-[#F8FAFC] shadow-md transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}
      >
        {/* Close button on mobile */}
        <div className="sm:hidden flex justify-end px-4 pt-4">
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-[#1F3C5F]" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-6">
          <div className="w-[75px] h-[57px] rounded-xl bg-[#A6C2E5] flex items-center justify-center">
            <Image src="/admin.png" alt="Admin Logo" width={60} height={30} />
          </div>
          <span className="text-[18px] font-bold text-[#171412] hidden sm:block">Mindful Path</span>
        </div>

        {/* Removed User Profile for larger screens */}

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-4 mt-4 flex-1">
          <h1 className="text-[#555555] font-light text-sm uppercase mb-2">Menu</h1>
          {menuItems.map((item, index) => {
            const isActive = activeKey === item.key
            return (
              <div
                key={index}
                onClick={() => {
                  onSelect(item.key)
                  setIsOpen(false) // close on mobile
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive ? "bg-[#1F3C5F] text-white" : "hover:bg-[#E2E8F0] text-[#1F3C5F]"
                }`}
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 400,
                  fontSize: "19px",
                  lineHeight: "100%",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Placeholder for "1 Issue" or other footer content */}
        
      </aside>
    </>
  )
}

export default AdminPanel
