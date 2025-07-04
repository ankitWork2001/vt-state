"use client"
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog-listings", label: "Blog list" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white px-4 sm:px-10 md:px-20 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50  border-b border-[#E5E8EB] max-w-[1240px] w-full h-[80px] mx-auto">
      <div className="text-black font-bold text-xl flex items-center">
        <span className="mr-2 text-2xl">♦</span>
        Mindful Path
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium text-base transition-colors duration-200 ${
              isActive(link.href)
                ? "text-[#FF914D]"
                : "text-[#1F3C5F] hover:text-[#FF914D]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button className="bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-2 transition-all duration-200">
          Sign In
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl text-[#1F3C5F] focus:outline-none"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            menuOpen ? "opacity-40" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Slide-in menu */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg flex flex-col p-6 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-xl font-bold text-[#151515]">
              <span className="mr-2 text-2xl">♦</span> Mindful Path
            </div>
            <button
              className="text-2xl text-[#1F3C5F]"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "bg-[#FF914D]/10 text-[#FF914D]"
                    : "text-[#1F3C5F] hover:bg-[#FF914D]/10 hover:text-[#FF914D]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 my-6" />
          <button className="w-full bg-[#f1f1f2] text-[#FF914D] rounded-xl flex items-center justify-center hover:bg-[#1F3C5F] hover:text-white font-medium text-base px-4 py-3 transition-all duration-200">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;