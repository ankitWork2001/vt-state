"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function BlogViewControls({ sortBy, onSortChange }) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
  ]

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center  gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 min-w-[120px] justify-between"
            >
              {sortOptions.find((option) => option.value === sortBy)?.label || "Newest"}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setShowSortDropdown(false)
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
         <div className="flex items-center justify-center relative top-1 right-2">
        <button className="text-sm text-[#000000] hover:text-[#1F3C5F] font-medium self-start sm:self-auto underline ">
          View All
        </button>
         </div>
          
      </div>
    </div>
  )
}
