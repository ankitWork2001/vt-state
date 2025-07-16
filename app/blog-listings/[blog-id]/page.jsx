'use client';

import React, { useEffect, useState } from 'react';
import BlogHeader from '@/components/BlogDetails/BlogHeader';
import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
import BlogContent from '@/components/BlogDetails/BlogContent';
import CommentSection from '@/components/BlogDetails/CommentSection';
import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';
import NavigationMenu from '@/components/common/NavigationMenu';
import { useParams } from 'next/navigation';
import { axiosInstance } from '@/lib/axios';

const BlogDetails = () => {
  const params = useParams();
  const slug = params?.slug;

  const [blogDetails, setBlogDetails] = useState(null);
  const [commentsDetails, setCommentsDetails] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setError('');
        if (!slug) return;

        const res = await axiosInstance.get(`/blogs/${slug}`);
        setBlogDetails(res.data.blog);
      } catch (e) {
        setError(e?.message || 'Something went wrong while fetching blog');
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setError('');
        if (!slug) return;

        const res = await axiosInstance.get(`/comments/${slug}`, {
          params: { blogId: slug }
        });
        setCommentsDetails(res.data);
      } catch (e) {
        setError(e?.message || 'Something went wrong while fetching comments');
      }
    };

    fetchComments();
    
  }, [slug]);


  if (error) {
    return <NotFound error={error} />;
  }

  return (
    <div className="bg-white w-full">
      <NavigationMenu
        path={[
          { label: 'Home', href: '/' },
          { label: 'Blog Listings', href: '/blog-listings' },
          { label: 'Blog Details', href: `/blog/${slug || ''}` },
        ]}
      />
      <div className="mx-auto flex w-[95%] flex-col sm:flex-row">
        <div className="p-1 mx-auto w-full max-w-4xl flex flex-col gap-4">
          <BlogHeader 
            title={blogDetails?.title} 
            date={blogDetails?.updatedAt} 
          />

          <AuthorProfile 
            author={blogDetails?.author} 
            comments={commentsDetails?.total}
            bookmarks={blogDetails?.bookmarks?.length || 0} 
            likes={blogDetails?.likes?.length || 0} 
          />

          <BlogContent 
            content={blogDetails?.content} 
            thumbnail={blogDetails?.thumbnail}
          />

          <CommentSection commentsDetails={commentsDetails}/>
        </div>
        <div className="w-full sm:w-[30%] mx-auto">
          <RelatedArticleCard/>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

const NotFound = ({ error }) => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <pre className="text-sm text-red-500">{error}</pre>
    </div>
  );
};
