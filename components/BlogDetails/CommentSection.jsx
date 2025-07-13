'use client';

import React from 'react';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

function CommentSection({ commentsDetails, refetchComments }) {
  const comments = commentsDetails?.comments || [];

  return (
    <div id="comment-section" className="min-w-60 h-auto w-full max-w-full flex flex-col">
      <h2 className="p-1 m-1 my-5 text-xl font-semibold border-l-2 border-slate-700 px-2">
        {`${comments.length} thought${comments.length !== 1 ? 's' : ''} on this blog`}
      </h2>

      {comments.map((data, id) => (
        <div key={id}>
          <CommentCard comment={data} refetchComments={refetchComments} />
        </div>
      ))}

      <CommentForm refetchComments={refetchComments} />
    </div>
  );
}

export default CommentSection;