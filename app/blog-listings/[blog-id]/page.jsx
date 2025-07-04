'use client';

import React from 'react';
import BlogHeader from '@/components/BlogDetails/BlogHeader';
import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
import BlogContent from '@/components/BlogDetails/BlogContent';
import CommentSection from '@/components/BlogDetails/CommentSection';
import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';
import NavigationMenu from '@/components/common/NavigationMenu';
import { useParams } from 'next/navigation';

const BlogDetails = () => {
  const params = useParams();

  const heading = 'How to Write a Good Essay in UPSC Mains 2025— Strategy Explained';
  const date = ' May 8, 2024';
  
  const profileDetails = {
    image: 'https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp',
    name: 'Anup Durshetty',
    heading: 'IAS | All India Rank 1, UPSC CSE 2017',
    social: {
      like: '30',
      comment: '40',
      share: '3',
      saved: '40',
    },
  };

  const blogContent = {
    image: 'https://tse3.mm.bing.net/th/id/OIP.JwiUo05ANXLuYk6nMZE9UwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    content: `Novelist Stephen King put it beautifully when he said, “I write to find out what I think.”

Writing is a window to your thought process. What you write on paper will tell the reader how you think, how you argue and the way you substantiate your viewpoint. This is why for most competitive examinations and academic entrance tests, essay is mandatory.

In the Civil Services Exam too, we have a paper worth 250 marks, equivalent to a General Studies paper.

Despite its importance, essay paper often does not get the attention it deserves from aspirants. First timers think they will write an excellent essay in the final exam itself, whereas experienced aspirants believe that since they had already studied a ton for GS, it will alone be enough to write a good essay.

This is a fatal miscalculation. I was one of those who made these errors in the past, and it is not a coincidence that I scored only 100 in CSE 2015. But in 2017, I devoted adequate time to this paper. I collected useful quotes, prepared notes and even made rough essay drafts for frequently asked topics. All this effort in essay paper helped me score 155.

What UPSC says about the essay paper:

“Candidates may be required to write essays on multiple topics. They will be expected to keep closely to the subject of the essay, to arrange their ideas in an orderly fashion, and to write concisely. Credit will be given for effective and exact expression.”

Essay distinguishes itself from GS in the sense that in GS, marks will be awarded purely for content. But in essay, examiners will pay special attention to not just the content, but also the language, coherence and the way you organise your write-up.

So you must take adequate care to arrange your ideas properly and not commit any fundamental spelling or grammatical errors.

How and from where to prepare?

Most of the content you write in Essay will come from your GS preparation. Apart from this, the following sources will help:`,
  };

  return (
    <div className="bg-white w-full">
      <NavigationMenu
        path={[
          { label: 'Home', href: '/' },
          { label: 'Blog Listings', href: '/blog-listings' },
          { label: 'Blog Details', href: `/blog/${params?.slug || ''}` },
        ]}
      />
      <div className="mx-auto flex w-[95%] flex-col sm:flex-row">
        <div className="p-1 mx-auto w-full max-w-4xl flex flex-col gap-4">
          <BlogHeader heading={heading} date={date} />
          <AuthorProfile profileDetails={profileDetails} />
          <BlogContent blogContent={blogContent} />
          <CommentSection />
        </div>
        <div className="w-full sm:w-[30%] mx-auto ">
          <RelatedArticleCard/>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;













// 'use client';
// import React from 'react';
// import BlogHeader from '@/components/BlogDetails/BlogHeader';
// import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
// import BlogContent from '@/components/BlogDetails/BlogContent';
// import CommentSection from '@/components/BlogDetails/CommentSection';
// import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';
// import InteractionBar from '@/components/BlogDetails/InteractionBar';
// import NavigationMenu from '@/components/common/NavigationMenu';
// import { useParams } from 'next/navigation';

// const BlogDetails = () => {
//   const param = useParams();


//   const heading = "How to Write a Good Essay in UPSC Mains 2025— Strategy Explained";
//   const date = "| May 8 2024";
//   const profileDetails = {
//     image:'https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp',
//     name:'Anup Durshetty',
//     heading:'IAS | All India Rank 1, UPSC CSE 2017',
//     social:{
//       like:'30',
//       comment:'40',
//       share:'3'
//     }
//   }
//   const blogContent = {
//     image:'https://tse3.mm.bing.net/th/id/OIP.JwiUo05ANXLuYk6nMZE9UwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
//     content:`Novelist Stephen King put it beautifully when he said, “I write to find out what I think.”
//             Writing is a window to your thought process. What you write on paper will tell the reader how you think, how you argue and the way you substantiate your viewpoint. This is why for most competitive examinations and academic entrance tests, essay is mandatory.
//             In the Civil Services Exam too, we have a paper worth 250 marks, equivalent to a General Studies paper.
//             Despite its importance, essay paper often does not get the attention it deserves from aspirants. First timers think they will write an excellent essay in the final exam itself, whereas experienced aspirants believe that since they had already studied a ton for GS, it will alone be enough to write a good essay.
//             This is a fatal miscalculation.I was one of those who made these errors in the past, and it is not a coincidence that I scored only 100 in CSE 2015. But in 2017, I devoted adequate time to this paper. I collected useful quotes, prepared notes and even made rough essay drafts for frequently asked topics. All this effort in essay paper helped me score 155.
//             What UPSC says about the essay paper
//             “Candidates may be required to write essays on multiple topics. They will be expected to keep closely to the subject of the essay, to arrange their ideas in an orderly fashion, and to write concisely. Credit will be given for effective and exact expression.”
//             Essay distinguishes itself from GS in the sense that in GS, marks will be awarded purely for content. But in essay, examiners will pay special attention to not just the content, but also the language, coherence and the way you organise your write-up.
//             So you must take adequate care to arrange your ideas properly and not commit any fundamental spelling or grammatical errors.
//             How and from where to prepare?
//             Most of the content you write in Essay will come from your GS preparation. Apart from this, the following sources will help:`
//   }

//   return (
//     <div className="bg-white w-full">
//       <NavigationMenu  path={[{ label: "Home", href: "/" }, { label: "blog-listings", href:"/blog-listings" }, { label: "BlogDetails", href:`/${param}` }]}/>
//       <div className='flex w-full flex-col sm:flex-row'>
//         <div className='p-1 m-2 w-[90%] h-full gap-2'>
//           <BlogHeader heading={heading} date={date}/>
//           <AuthorProfile profileDetails={profileDetails}/>
//           <BlogContent blogContent={blogContent}/>
//           <InteractionBar />
//           <CommentSection />
//         </div>
//         <div>
//           <RelatedArticleCard />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;


