import React from 'react'

function CommentForm() {
  return (
        <div className="p-1 m-1 my-3 min-w-fit h-auto w-full flex flex-col justify-start">
          <h2 className="p-1 m-5">&larr; Order Comment</h2>

          <h3 className="p-1 m-1 my-3 text-xl font-semibold border-l-2 border-slate-700 px-2">
            Leave a Comment
          </h3>

          <div className="relative w-full">
            <textarea
              className="w-full min-h-[120px] border border-slate-700 p-2 rounded resize-y"
              placeholder="Write a comment"
            ></textarea>

            <button
              className="absolute bottom-2 right-2 p-2 m-1 bg-slate-200 hover:bg-slate-100 border border-slate-700 rounded"
            >
              Comment
            </button>
          </div>
        </div>
  )
}

export default CommentForm