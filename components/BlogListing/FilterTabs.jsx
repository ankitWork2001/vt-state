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
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 })
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const tabRefs = useRef({})
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Get subcategories for the hovered or active category
  const targetCategory = hoveredCategory || activeCategory
  const currentCategory = categories.find((cat) => cat.slug === targetCategory)
  const subCategories = currentCategory?.subcategories || []

  useEffect(() => {
    if (
      targetCategory !== "all" &&
      subCategories.length > 0 &&
      (hoveredCategory || activeCategory === targetCategory)
    ) {
      setShowDropdown(true)

      // Position dropdown below the target tab
      const targetTabRef = tabRefs.current[targetCategory]
      const containerElement = containerRef.current

      if (targetTabRef && containerElement) {
        const tabRect = targetTabRef.getBoundingClientRect()
        const containerRect = containerElement.getBoundingClientRect()

        // Calculate position relative to container
        const leftPosition = tabRect.left - containerRect.left
        const topPosition = tabRect.bottom - containerRect.top + 8 // 8px gap below tab

        setDropdownPosition({
          left: Math.max(0, Math.min(leftPosition, containerRect.width - 256)), // Ensure dropdown stays within container
          top: topPosition,
        })
      }
    } else {
      setShowDropdown(false)
    }
  }, [targetCategory, subCategories.length, hoveredCategory, activeCategory])

  const handleMouseEnter = (categorySlug) => {
    const category = categories.find((cat) => cat.slug === categorySlug)
    if (category && category.subcategories && category.subcategories.length > 0) {
      setHoveredCategory(categorySlug)
    }
  }

  const handleMouseLeave = () => {
    // Add small delay to prevent flickering when moving to dropdown
    setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover")) {
        setHoveredCategory(null)
        setShowDropdown(false)
      }
    }, 100)
  }

  const handleDropdownMouseEnter = () => {
    setShowDropdown(true)
  }

  const handleDropdownMouseLeave = () => {
    setShowDropdown(false)
    setHoveredCategory(null)
  }

  return (
    <div ref={containerRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 border-b border-gray-200 relative">
      {/* Category Tabs */}
      <div className="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-2 sm:gap-4 lg:gap-6 justify-items-center items-center">
        {categories.map((category) => (
          <button
            key={category.slug}
            ref={(el) => (tabRefs.current[category.slug] = el)}
            onClick={() => onCategoryChange(category.slug)}
            onMouseEnter={() => handleMouseEnter(category.slug)}
            onMouseLeave={handleMouseLeave}
            className={`whitespace-nowrap pb-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors rounded w-full text-center ${
              activeCategory === category.slug
                ? "text-white bg-[#1F3C5F]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategory Dropdown - Always positioned below */}
      {showDropdown && subCategories.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute w-48 sm:w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          style={{
            left: `${dropdownPosition.left}px`,
            top: `${dropdownPosition.top}px`,
          }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {subCategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => {
                onSubCategoryChange(selectedSubCategory === subcategory ? "" : subcategory)
                setShowDropdown(false)
                setHoveredCategory(null)
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedSubCategory === subcategory
                  ? "bg-blue-50 text-[#1F3C5F] font-medium"
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
