"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

function CommentForm() {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 'blog-id': blogId } = useParams(); 


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !localUser.userid) {
        setIsValidUser(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get("/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const serverUser = data.user;

        // Match user ID and check if not admin
        if (localUser.userid === serverUser.userId && !serverUser.isAdmin) {
          setIsValidUser(true);
        } else {
          setIsValidUser(false);
        }
      } catch (err) {
        console.error("Token validation failed:", err.message);
        setIsValidUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (!blogId) {
      toast.error("Invalid blog ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `/comments/${blogId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Comment posted successfully!");
      setComment(''); 
    } catch (err) {
      console.error("Failed to post comment:", err.message);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[120px] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isValidUser) {
    return <></>;
  }

  return (
    <div className="p-1 m-1 my-3 min-w-fit h-auto w-full flex flex-col justify-start">
    

      <h3 className="p-1 m-1 my-3 text-xl font-semibold border-l-2 border-slate-700 px-2">
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit} className="relative w-full">
        <textarea
          className="w-full min-h-[120px] border border-slate-700 p-2 rounded resize-y"
          placeholder="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        ></textarea>

        <button
          type="submit"
          className="absolute bottom-2 right-2 p-2 m-1 bg-slate-200 hover:bg-slate-100 border border-slate-700 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Comment'}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;