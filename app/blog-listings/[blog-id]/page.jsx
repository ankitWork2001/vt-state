'use client';
import React from 'react';
import BlogHeader from '@/components/BlogDetails/BlogHeader';
import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
import BlogContent from '@/components/BlogDetails/BlogContent';
import CommentSection from '@/components/BlogDetails/CommentSection';
import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';
import InteractionBar from '@/components/BlogDetails/InteractionBar';
import NavigationMenu from '@/components/common/NavigationMenu';

const BlogDetails = () => {
  return (
    <div className="bg-white">
      <NavigationMenu />
      <BlogHeader />
      <AuthorProfile />
      <BlogContent />
      <InteractionBar />
      <RelatedArticleCard />
      <CommentSection />
    </div>
  );
};

export default BlogDetails;
