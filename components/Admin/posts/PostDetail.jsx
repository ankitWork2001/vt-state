// components/PostDetail.js
'use client';
import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

const PostDetail = ({ post }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  if (!post)
    return (
      <div className="text-center py-10 text-gray-500">Post not found.</div>
    );

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#1F3C5F] mb-4">
        Performance Overview
      </h2>

      {/* Analytics-style Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card
          title="Views"
          value={post.views || 246}
          sub="28 more than usual"
        />
        <Card
          title="Time Spent (hours)"
          value={post.readTime || 1.4}
          sub="24% more than previous 28 days"
        />
      </div>

      {/* Title & Date */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {post.title}
      </h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        {post.publishedDate}
      </p>

      {/* Image */}
      {post.image && (
        <div className="mb-4 text-center">
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={300}
            className="mx-auto w-full sm:w-auto rounded-md bg-red-200 object-cover"
          />
        </div>
      )}

      {/* Icons */}
      <div className="flex justify-center gap-6 text-gray-700 mb-6 flex-wrap">
        <div className="flex items-center gap-1">
          <Heart className="text-red-500" size={18} /> {post.likes || 210}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={18} /> {post.comments || 30}
        </div>
        <div className="flex items-center gap-1">
          <Share2 size={18} /> {post.shares || 36}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">What is Lorem Ipsum?</h3>
      <p
        className={`text-gray-700 leading-relaxed mb-4 ${
          showFullContent ? "text-[17px]" : "text-base"
        }`}
      >
        {showFullContent
          ? post.content ||
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
          : (post.content?.slice(0, 250) || "Lorem Ipsum is dummy text...") +
            "..."}
      </p>

      {/* Toggle Button */}
      <div className="text-right">
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="px-4 py-2 text-red border border-red-300 rounded hover:bg-red-600 hover:text-white transition"
        >
          {showFullContent ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
};

// Reusable Card component
const Card = ({ title, value, sub }) => (
  <div className="border p-4 rounded-md bg-gray-50 h-[150px] shadow-sm">
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className="text-2xl font-bold text-[#1F3C5F] mt-1">{value}</p>
    {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
  </div>
);

export default PostDetail;
