import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function NewsletterForm() {
  return (
    <section className="py-12 px-4  mx-auto">
      <Card className="border border-[#1F3C5F] rounded-none shadow-none">
        <CardContent className="p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3C5F] mb-1">
            Subscribe to our news letter
          </h2>
          <h3 className="text-xl sm:text-3xl font-bold text-[#1F3C5F] mb-4">
            Stay Updated!
          </h3>
          <p className="text-[#151515] text-md  mb-10">
            No spam. Weekly resources for your journey
          </p>

          {/* Input and button on same row */}
          <form className="max-w-md mx-auto w-full">
  <div className="flex flex-col gap-4 justify-center">
    <input
      type="email"
      placeholder="Your Email"
      className="flex-1 border-0 border-b border-gray-300 focus:ring-0 focus:outline-none py-2 placeholder-[#1F3C5F] placeholder:font-bold text-[#1F3C5F] font-bold"
    />
    <Button className="bg-[#FF914D] hover:bg-[#e8823d] text-white px-6 py-2 rounded-md font-semibold w-30 mx-auto">
      Subscribe
    </Button>
  </div>
</form>

        </CardContent>
      </Card>
    </section>
  )
}

export default NewsletterForm
