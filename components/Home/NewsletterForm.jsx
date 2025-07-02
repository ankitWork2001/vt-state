import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
function NewsletterForm() {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our news letter</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Stay Updated!</h3>
          <p className="text-gray-600 mb-8">No spam. Weekly resources for your journey</p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input type="email" placeholder="Your Email" className="flex-1" />
              <Button className="bg-[#FF914D] hover:bg-[#e8823d] text-white px-8">Subscribe</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )

}

export default NewsletterForm