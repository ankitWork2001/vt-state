import DOMPurify from 'dompurify';
import React from 'react';

function BlogContent({ content, thumbnail }) {
  const safeHTML = DOMPurify.sanitize(content);
  
  return (
    <div className='min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col'>
      <img
        src={thumbnail}
        alt='Blog Thumbnail'
        className='p-2 m-2 w-full h-80 sm:h-100 object-cover'
      />
      <div
        className='p-2 m-2 w-full h-full flex text-wrap font-sans text-justify flex-col'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default BlogContent;
