import Image from "next/image"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <div className="relative w-full aspect-[3/1] sm:aspect-[16/9] lg:aspect-[3/1]">
      <Image 
        src="/images/HeroBanner.png" 
        alt="Hero Banner" 
        fill 
        className="object-cover" 
        quality={100} 
      />

      {/* Green text overlay - responsive positioning */}
      <div className="absolute bg-[#35590E] text-white flex flex-col justify-center px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-md sm:rounded-lg top-4 left-4 sm:top-6 sm:left-6 lg:top-10 lg:left-10 max-w-[280px] sm:max-w-[320px]">
        <p className="text-sm sm:text-base lg:text-xl font-semibold leading-tight">
          "You are one step closer
          <br />
          to your dream"
        </p>
      </div>

      {/* Start Reading button - responsive positioning */}
      <Link href="/blog-listings" className="absolute inset-0">
        <div className="absolute bg-[#FF914D] text-white flex items-center justify-center rounded-md sm:rounded-lg cursor-pointer hover:bg-[#e8823d] transition-colors bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8 lg:bottom-16 w-28 h-10 sm:w-32 sm:h-11 lg:w-36 lg:h-12">
          <span className="text-sm sm:text-base font-medium">Start Reading</span>
        </div>
      </Link>
    </div>
  )
}
