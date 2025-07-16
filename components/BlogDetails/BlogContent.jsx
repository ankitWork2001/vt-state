// BlogContent.jsx

'use client'; // if using in Next.js app directory

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

function BlogContent({ content, thumbnail }) {
  const cleanHTML = DOMPurify.sanitize(content);

  return (
    <div className='min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col'>
      <img
        src={thumbnail}
        alt='Blog Thumbnail'
        className='p-2 m-2 w-full h-80 sm:h-100 object-cover'
      />
      <div
        className='p-2 m-2 w-full h-full flex text-wrap font-sans text-justify flex-col'
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </div>
  );
}

export default BlogContent;
