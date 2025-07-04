import Image from "next/image"

export default function SuccessStory() {
  return (
    <section className="py-6 sm:py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Success Stories</h2>

      <div className="shadow-none border-none">
        <div className="flex flex-col lg:grid lg:grid-cols-[40%_60%] gap-0">
          <div className="relative w-full h-64 sm:h-80 lg:h-[430.88px]">
            <Image src="/images/SuccessStory.png" alt="Success Story" fill className="object-cover" />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Seetha</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-3 sm:mb-4">
                IAS | All India Rank 1, UPSC CSE 2017
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg font-semibold italic text-gray-800">
                "One stop for every <span className="italic font-bold">UPSC need!</span>"
              </p>

              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                "I cleared UPSC and became an IAS officer in just my second attempt. This blog's crisp notes, daily
                quizzes, and topper strategies really helped me stay focused. The answer writing practice was a game
                changer for my Mains prep. I always recommend this blog to serious aspirants."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
