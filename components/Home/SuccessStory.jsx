import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function SuccessStory() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Success Stories</h2>

      <Card className=" shadow-none border-none">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
          <div className="relative w-full h-[430.88px]">
            <Image
              src="/images/SuccessStory.png" // Generic image if you don't have Seetha's photo
              alt="Success Story"
              fill
              className="object-cover"
            />
          </div>

          <CardContent className="p-8 flex flex-col justify-around ">
            <div>
            <h3 className="text-2xl font-semibold text-gray-900">Seetha</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              IAS | All India Rank 1, UPSC CSE 2017
            </p>
            </div>
              
            <div>
            <p className="text-lg font-semibold italic text-gray-800 mb-4">
              "One stop for every <span className="italic font-bold">UPSC need!</span>"
            </p>
              

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              "I cleared UPSC and became an IAS officer in just my second attempt. This blog's crisp notes, daily
              quizzes, and topper strategies really helped me stay focused. The answer writing practice was a game changer
              for my Mains prep. I always recommend this blog to serious aspirants."
            </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  )
}