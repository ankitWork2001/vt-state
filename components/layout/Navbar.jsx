"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white px-4 sm:px-8 lg:px-20 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100 h-[70px] sm:h-[80px]">
      {/* Logo */}
      <div className="text-black font-bold text-lg sm:text-xl flex items-center">
        <span className="mr-2 text-xl sm:text-2xl">♦</span>
        <span className="hidden sm:inline">Mindful Path</span>
        <span className="sm:hidden">Mindful Path</span>
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
        <button className="bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-2 transition-all duration-200">
          Sign In
        </button>
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
            <button
              className="bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-3 mt-2 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
