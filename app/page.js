import React from 'react';
import HeroBanner from '@/components/Home/HeroBanner';
import CategoryCard from '@/components/Home/CategoryCard';
import TrendingBlogs from '@/components/Home/TrendingBlogs';
import BlogSection from '@/components/Home/BlogSection';
import ToolButton from '@/components/Home/ToolButton';
import SuccessStory from '@/components/Home/SuccessStory';
import NewsletterForm from '@/components/Home/NewsletterForm';

const Home = () => {
  return (
    <div className="bg-white">
      <HeroBanner />
      <CategoryCard />
      <TrendingBlogs />
      <BlogSection />
      <ToolButton />
      <SuccessStory />
      <NewsletterForm />
    </div>
  );
};

export default Home;
