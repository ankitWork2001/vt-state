import { Calendar, FileText, Bell } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    id: 1,
    name: "Time Table Generator",
    icon: <Calendar size={18} className="mr-2 sm:mr-3" />,
    link: "/tools/timetable",
  },
  {
    id: 2,
    name: "Master Essay",
    icon: <FileText size={18} className="mr-2 sm:mr-3" />,
    link: "/tools/essay",
  },
  {
    id: 3,
    name: "Weekly Updates",
    icon: <Bell size={18} className="mr-2 sm:mr-3" />,
    link: "/tools/updates",
  },
]

export default function ToolsSection() {
  return (
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Useful tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.link} className="w-full">
            <div className="bg-[#1F3C5F] hover:bg-[#16314d] text-white rounded-md px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-center font-medium transition duration-200 text-sm sm:text-base">
              {tool.icon}
              {tool.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
