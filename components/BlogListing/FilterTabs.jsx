"use client"

import { useState, useRef, useEffect } from "react"

export default function FilterTabs({
  activeCategory,
  onCategoryChange,
  categories,
  selectedSubCategory,
  onSubCategoryChange,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0 })
  const tabRefs = useRef({})
  const dropdownRef = useRef(null)

  // Get subcategories for the active category
  const currentCategory = categories.find((cat) => cat.slug === activeCategory)
  const subCategories = currentCategory?.subcategories || []

  useEffect(() => {
    if (activeCategory !== "all" && subCategories.length > 0) {
      setShowDropdown(true)
      // Position dropdown below the active tab
      const activeTabRef = tabRefs.current[activeCategory]
      if (activeTabRef) {
        const rect = activeTabRef.getBoundingClientRect()
        const containerRect = activeTabRef.closest(".max-w-\\[1240px\\]")?.getBoundingClientRect()
        if (containerRect) {
          setDropdownPosition({ left: rect.left - containerRect.left })
        }
      }
    } else {
      setShowDropdown(false)
    }
  }, [activeCategory, subCategories.length])

  // Auto-close dropdown when mouse leaves
  const handleMouseLeave = () => {
    setShowDropdown(false)
  }

  const handleMouseEnter = () => {
    if (activeCategory !== "all" && subCategories.length > 0) {
      setShowDropdown(true)
    }
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-4 border-b border-gray-200 relative">
      <div className="flex gap-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.slug}
            ref={(el) => (tabRefs.current[category.slug] = el)}
            onClick={() => onCategoryChange(category.slug)}
            onMouseEnter={handleMouseEnter}
            className={`whitespace-nowrap pb-2 px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === category.slug ? "text-white rounded" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{
              backgroundColor: activeCategory === category.slug ? "#1F3C5F" : "transparent",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Dropdown Menu - Auto-close on mouse leave */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-60 overflow-y-auto"
          style={{ left: `${dropdownPosition.left}px` }}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setShowDropdown(true)}
        >
          {subCategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => {
                onSubCategoryChange(selectedSubCategory === subcategory ? "" : subcategory)
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                selectedSubCategory === subcategory
                  ? "bg-blue-50 text-blue-[#1F3C5F] font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
