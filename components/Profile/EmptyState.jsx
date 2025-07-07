import React from 'react'
import Link from 'next/link'

const EmptyState = () => {
  return (
    <div className='h-auto min-w-fit w-full max-w-[80%] mx-auto pt-10 flex justify-center items-center flex-col border-t-1 border-slate-400'>
      <div className='h-60 w-full max-w-90 bg-[#E9D5C9] border border-[#E9D5C9] flex justify-center items-center mb-6'>
      <div className='w-35 h-[80%] bg-white text-[#E9D5C9] flex items-center justify-center'>
      </div>
    </div>

    <div className='my-2 font-semibold'>You haven’t saved anything yet.</div>
    <div className='my-2 font-normal'>Explore our Library Articles</div>

    <Link href="/blog-listings">
      <button className='px-6 py-2 mt-4 border-2 text-[#C0392B] border-[#C0392B] hover:bg-[#C0392B] hover:text-white transition-all duration-200'>
        Start Exploring
      </button>
    </Link>

    </div>
  )
}

export default EmptyState