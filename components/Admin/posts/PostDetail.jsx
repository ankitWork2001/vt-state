"use client";
import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Bookmark, } from "lucide-react";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";

const PostDetail = ({ post }) => {
  const [fullPost, setFullPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [showFullContent, setShowFullContent] = useState(false);

  // Fetch latest blog with likes, and fetch comments
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [blogRes, commentRes] = await Promise.all([
          axiosInstance.get(`/blogs/${post._id}`),
          axiosInstance.get(`/comments/${post._id}`),
        ]);

        if (blogRes.data?.blog) setFullPost(blogRes.data.blog);
        if (commentRes.data?.comments) setComments(commentRes.data.comments);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      }
    };

    fetchDetails();
  }, [post._id]);

  if (!fullPost)
    return (
      <div className="text-center py-10 text-gray-500">Post not found.</div>
    );

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#1F3C5F] mb-4">
        Performance Overview
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card title="Views" value={fullPost.views || 246} sub="28 more than usual" />
        <Card title="Time Spent (hours)" value={fullPost.readTime || 1.4} sub="24% more than previous 28 days" />
      </div>

      {/* Title & Date */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {fullPost.title}
      </h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        {new Date(fullPost.createdAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>

      {/* Thumbnail */}
      {fullPost.thumbnail && (
        <div className="mb-4 text-center">
          <Image
            src={fullPost.thumbnail}
            alt={fullPost.title}
            width={20}
            height={10}
            className="mx-auto w-full max-w-[430px] h-[277px] sm:w-auto rounded-md bg-red-200 object-cover"
          />
        </div>
      )}

      {/* Engagement Icons */}
      <div className="flex justify-center gap-6 text-gray-700 mb-6 flex-wrap">
        <div className="flex items-center gap-1">
          <Heart className="text-red-500" size={18} /> {fullPost.likes?.length || 0}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={18} /> {comments.length || 0}
        </div>
        <div className="flex items-center gap-1">
          <Bookmark size={18} /> {fullPost.bookmarks?.length || 0} 
                </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">{fullPost.title}</h3>
      <p
        className={`text-gray-700 leading-relaxed mb-4 ${
          showFullContent ? "text-[17px]" : "text-base"
        }`}
      >
        {showFullContent
          ? fullPost.content
          : (fullPost.content?.slice(0, 250) || "") + "..."}
      </p>

      {/* Toggle Read More */}
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

// Card Component
const Card = ({ title, value, sub }) => (
  <div className="border p-4 rounded-md bg-gray-50 h-[150px] shadow-sm">
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className="text-2xl font-bold text-[#1F3C5F] mt-1">{value}</p>
    {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
  </div>
);

export default PostDetail;
