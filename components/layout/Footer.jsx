import { Instagram, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1F3C5F] text-white p-6 sm:p-8 mt-12 mx-4 sm:mx-8 lg:mx-20 rounded-t-lg">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Quick Links */}
          <div>
            <p className="mb-4 font-semibold text-lg">Quick Links</p>
            <div className="space-y-2">
              <a href="#home" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Home
              </a>
              <a href="#trending" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Trending
              </a>
              <a href="#tools" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Useful Tools
              </a>
              <a href="#success" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Success Stories
              </a>
              <a href="#about" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                About Us
              </a>
              <a href="#contact" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="mb-4 font-semibold text-lg">Categories</p>
            <div className="space-y-2">
              <a href="#upsc" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                UPSC
              </a>
              <a href="#bpsc" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                BPSC
              </a>
              <a href="#essay" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Essay Writing
              </a>
              <a href="#motivation" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Motivation
              </a>
              <a href="#strategy" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Strategy
              </a>
              <a href="#current" className="block text-sm text-white hover:text-[#FF914D] transition-colors">
                Current Affairs
              </a>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <p className="mb-4 font-semibold text-lg">Customer Support</p>
            <div className="space-y-2">
              <p className="text-sm text-white">Live Chat Support</p>
              <p className="text-sm text-white">Email: support@upscblog.com</p>
              <p className="text-sm text-white">Phone: +91 XXXXX XXXXX</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="mb-4 font-semibold text-lg">Social Media</p>
            <div className="flex space-x-4">
              <a href="#instagram" className="hover:text-[#FF914D] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#facebook" className="hover:text-[#FF914D] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#youtube" className="hover:text-[#FF914D] transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">© 2024 Mindful Path. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
