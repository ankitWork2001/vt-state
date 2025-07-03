import React from 'react'

function CommentCard({comment}) {
  return (
  <div className='p-1 m-1 my-3 min-w-fit h-auto w-full flex justify-start flex-col border-1 border-slate-700'>
    <div className='flex'>
      <img 
        src={comment.image} 
        alt={comment.username}
        className='p-1 m-1 size-10 object-cover'
      />
      <div className='flex flex-col'>
        <p className=''>{comment.username}</p>
        <p className='text-xs text-slate-40'>{comment.date}</p>
      </div>
    </div>
    <article className='p-1 m-2'>
      {comment.massage}
    </article>
  </div>
  )
}

export default CommentCard