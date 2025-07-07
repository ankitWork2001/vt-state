'use client';
import { useState } from 'react';
import ArticleCard from '@/components/Profile/ArticleCard';
import EmptyState from './EmptyState';

const dummyArticles = {
  liked: [
    {
      id: 1,
      title: "How to Stay Motivated During UPSC Preparation",
      slug: "stay-motivated-upsc-preparation",
      excerpt: "...",
      author: "Rajesh Kumar",
      readTime: "8 Min Reading",
      publishedDate: "2025-06-20",
      category: "Motivational",
      subCategory: "Social Issues",
      image: "/images/tempImage.jpg",
      timestamp: new Date("2025-06-20").getTime(),
    },
    {
      id: 2,
      title: "From Failure to Success: My UPSC Journey",
      slug: "failure-to-success-upsc-journey",
      excerpt: "...",
      author: "Rohit Sharma",
      readTime: "12 Min Reading",
      publishedDate: "2025-06-10",
      category: "Motivational",
      subCategory: "Social Issues",
      image: "/images/tempImage.jpg",
      timestamp: new Date("2025-06-10").getTime(),
    },
  ],
  bookmarked: [
    {
      id: 3,
      title: "Ethics Case Studies for UPSC",
      slug: "ethics-case-studies-upsc",
      excerpt: "...",
      author: "IAS Mentor",
      readTime: "9 Min Reading",
      publishedDate: "2025-06-22",
      category: "Ethics",
      subCategory: "Integrity",
      image: "/images/tempImage.jpg",
      timestamp: new Date("2025-06-22").getTime(),
    },
    {
      id: 4,
      title: "Current Affairs Analysis",
      slug: "current-affairs-analysis",
      excerpt: "...",
      author: "Prelims Master",
      readTime: "10 Min Reading",
      publishedDate: "2025-06-25",
      category: "Current Affairs",
      subCategory: "Economy",
      image: "/images/tempImage.jpg",
      timestamp: new Date("2025-06-25").getTime(),
    },
  ],
};


export default function ArticleList() {
  const [activeTab, setActiveTab] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const allArticles = [...dummyArticles.liked, ...dummyArticles.bookmarked];
  const likedArticles = dummyArticles.liked;
  const bookmarkedArticles = dummyArticles.bookmarked;

  let visibleArticles = [];

  {
    if (activeTab === 'Liked') {
      visibleArticles = likedArticles;
    } else if (activeTab === 'Bookmarked') {
      visibleArticles = bookmarkedArticles;
    } else {
      visibleArticles = showAll ? allArticles : allArticles.slice(0, 3);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="flex gap-4 mb-6">
        {['All', 'Liked', 'Bookmarked'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false); 
            }}
            className={`px-4 py-2 border rounded ${
              activeTab === tab ? 'bg-blue-400 text-white' : 'bg-white text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visibleArticles.length === 0 ? (
          <EmptyState/>
        ) : (
          visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {activeTab === 'All' && !showAll && allArticles.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}