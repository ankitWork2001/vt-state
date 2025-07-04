export default function NewsletterForm() {
  return (
    <section className="py-8 sm:py-12 px-4 mx-auto">
      <div className="border border-[#1F3C5F] rounded-none shadow-none">
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F3C5F] mb-1">
            Subscribe to our news letter
          </h2>
          <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#1F3C5F] mb-4">Stay Updated!</h3>
          <p className="text-[#151515] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
            No spam. Weekly resources for your journey
          </p>

          <form className="max-w-sm sm:max-w-md mx-auto w-full">
            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:outline-none py-2 sm:py-3 placeholder-[#1F3C5F] placeholder:font-bold text-[#1F3C5F] font-bold text-sm sm:text-base"
              />
              <button className="bg-[#FF914D] hover:bg-[#e8823d] text-white px-6 py-2 sm:py-3 rounded-md font-semibold w-full sm:w-auto sm:mx-auto transition-colors">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
