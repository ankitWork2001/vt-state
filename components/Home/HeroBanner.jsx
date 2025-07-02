import Image from "next/image"
import Link from "next/link"

const HeroBanner = () => {
  return (
    <div className="relative w-full" style={{ paddingTop: "33.03%" }}>
      <Image src="/images/HeroBanner.png" alt="Hero Banner" fill className="object-cover" quality={100} />

      {/* Green text overlay */}
      <div
        className="absolute bg-[#35590E] text-white flex flex-col justify-center px-6 py-4"
        style={{
          width: "320px",
          height: "80px",
          top: "40px",
          left: "40px",
          borderRadius: "8px",
        }}
      >
        <p className="text-xl font-semibold leading-tight">
          "You are one step closer
          <br />
          to your dream"
        </p>
      </div>

      {/* Start Reading button */}
      <Link href="/start-reading">
        <div
          className="absolute bg-[#FF914D] text-white flex items-center justify-center rounded-lg cursor-pointer hover:bg-[#e8823d] transition-colors"
          style={{
            width: "140px",
            height: "45px",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="text-base font-medium">Start Reading</span>
        </div>
      </Link>
    </div>
  )
}

export default HeroBanner
