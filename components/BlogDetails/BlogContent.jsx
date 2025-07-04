import React from 'react'

function BlogContent({blogContent}) {
  return (
  <div className='min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col'>
    <img
      src={blogContent.image}
      alt='#'
      className='p-2 m-2 w-full h-80 sm:h-100 object-cover'
    />
    <pre className='p-2 m-2 w-full h-full flex text-wrap font-sans  text-justify'>
      {blogContent.content}
    </pre>
  </div>
  )
}

export default BlogContent