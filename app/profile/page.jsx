'use client';

import ProfileTabs from "@/components/Profile/ProfileTabs";
import { useEffect, useState } from "react";
import EmptyState from "@/components/Profile/EmptyState";
import ArticleList from "@/components/Profile/ArticleList";

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


export default function ProfilePage() {

  return (
    <div className="w-full px-4 py-8 h-auto min-w-fit max-w-full border">
      <h1 className="text-2xl font-bold mb-6">Saved Articles and Likes</h1>
        <ArticleList/> 
    </div>
  );
}
