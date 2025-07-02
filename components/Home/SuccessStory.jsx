import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function SuccessStory() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Success Stories</h2>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 w-150 lg:h-auto">
            <Image
              src="/images/SuccessStory.png"
              alt="Success Story"
              fill
              className="object-cover ml-2"
            />
          </div>
          <CardContent className="p-8 flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Seetha</h3>
              <p className="text-sm text-gray-600 mb-4">IAS | All India Rank 1, UPSC CSE 2017</p>
            </div>
            <blockquote className="text-lg text-gray-700 mb-6 italic">"One stop for every UPSC need!"</blockquote>
            <p className="text-gray-600 leading-relaxed">
              "I cleared UPSC and became an IAS officer in just my second attempt. This blog's crisp notes, daily
              quizzes, and target strategies really helped me stay focused. The answer writing sessions and a
              game-changer for my Mains prep. I always recommend this blog to serious aspirants."
            </p>
          </CardContent>
        </div>
      </Card>
    </section>
  )
}
