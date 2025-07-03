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
    <div className="max-w-[1240px] mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 min-w-[100px] justify-between"
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

        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
      </div>
    </div>
  )
}
