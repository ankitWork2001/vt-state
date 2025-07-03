import React from 'react'

function BlogHeader({heading,date}) {
  return (
    <div className='min-w-60 w-full max-w-full h-auto flex justify-center text-center'>
      <h1 className='text-2xl font-semibold '>{heading}
        <p className='px-2 inline text-sm font-normal'>{date}</p>
      </h1>
    </div>
  )
}

export default BlogHeader