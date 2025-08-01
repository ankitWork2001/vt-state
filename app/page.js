import React from 'react';
import HeroBanner from '@/components/Home/HeroBanner';
import CategoryCard from '@/components/Home/CategoryCard';
import TrendingBlogs from '@/components/Home/TrendingBlogs';
import ToolButton from '@/components/Home/ToolButton';
import SuccessStory from '@/components/Home/SuccessStory';
import NewsletterForm from '@/components/Home/NewsletterForm';


const Home = () => {
  return (
    <div className="bg-white lg:mx-20 md:mx-10 sm:mx-5 mx-2">
      <HeroBanner />
      <CategoryCard />
      <TrendingBlogs />
      <ToolButton />
      <SuccessStory />
      <NewsletterForm />
    </div>
  );
};

export default Home;
