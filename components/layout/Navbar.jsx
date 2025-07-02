import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="bg-white px-20 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100 h-[80px]">
      <div className="text-black font-bold text-xl flex items-center">
        <span className="mr-2 text-2xl">♦</span>
        Mindful Path
      </div>

      <div className="flex space-x-8 items-center">
        <Link
          href="/home"
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
    </nav>
  )
}

export default Navbar
