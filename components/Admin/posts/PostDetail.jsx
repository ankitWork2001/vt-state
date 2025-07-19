'use client';

import { useEffect, useState, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { axiosInstance } from '@/lib/axios';
import DOMPurify from 'isomorphic-dompurify';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/formatDate';

const PostDetail = ({ post, onBack }) => {
  const [fullPost, setFullPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

  const fetchDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const [blogRes, commentRes, analyticsRes] = await Promise.all([
        axiosInstance.get(`/blogs/${post.id}`),
        axiosInstance.get(`/comments/${post.id}`, {
          params: { page: 1, limit: 10 },
        }),
        axiosInstance.get(`/analytics/article/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (blogRes.data?.blog) setFullPost(blogRes.data.blog);
      console.log('ress', blogRes.data.blog);
      if (analyticsRes.data) setAnalytics(analyticsRes.data.data);
      if (commentRes.data?.comments) {
        setComments(commentRes.data.comments);
        setHasMore(commentRes.data.page < commentRes.data.pages);
      }
    } catch (error) {
      console.error('Error fetching post or comments:', error);
    }
  };

  const fetchMoreComments = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/comments/${post.id}`, {
        params: { page: page + 1, limit: 10 },
      });
      const newComments = res.data.comments || [];
      setComments((prev) => [...prev, ...newComments]);
      setPage((prev) => prev + 1);
      setHasMore(res.data.page < res.data.pages);
    } catch (error) {
      console.error('Error fetching more comments:', error);
      toast.error('Failed to load more comments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [post.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMoreComments();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, isLoading]);

  if (!fullPost) return <div className="text-center py-10 text-gray-500">Post not found.</div>;

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        &larr; Back to Posts
      </button>

      <h2 className="text-2xl font-semibold text-[#1F3C5F] mb-4">Performance Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card title="Views" value={analytics?.views ?? 'Loading...'} />
        <Card
          title="Time Spent (hours)"
          value={analytics?.avgReadTime != null ? (analytics.avgReadTime / 60).toFixed(2) : 'Loading...'}
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{fullPost.title}</h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        {new Date(fullPost.createdAt).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </p>

      {fullPost.thumbnail && (
        <div className="mb-4 text-center">
          <Image
            src={fullPost.thumbnail || '/placeholder.svg'}
            alt={fullPost.title}
            width={430}
            height={277}
            className="mx-auto w-full max-w-[430px] h-[277px] sm:w-auto rounded-md bg-red-200 object-cover"
          />
        </div>
      )}

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

      <h3 className="text-lg font-semibold mb-2">{fullPost.title}</h3>
      <div
        className={`text-gray-700 leading-relaxed mb-4 prose prose-sm sm:prose-base max-w-none ${
          showFullContent ? 'text-[17px]' : 'text-base'
        }`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            showFullContent ? fullPost.content || '' : (fullPost.content?.slice(0, 250) || '') + '...'
          ),
        }}
      />

      <div className="text-right">
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="px-4 py-2 text-red border border-red-300 rounded hover:bg-red-600 hover:text-white transition"
        >
          {showFullContent ? 'Show Less' : 'Read More'}
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Comments</h3>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              refetchComments={fetchDetails}
            />
          ))
        ) : (
          <p className="text-gray-600">No comments yet.</p>
        )}
        <div ref={observerRef} className="h-10" />
        {isLoading && <div className="text-center text-gray-600">Loading more comments...</div>}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="border p-4 rounded-md bg-gray-50 h-[100px] shadow-sm">
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className="text-2xl font-bold text-[#1F3C5F] mt-1">{value}</p>
  </div>
);

const CommentCard = ({ comment, refetchComments }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !localUser.userid) {
        setIsOwner(false);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get('/auth/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const serverUser = data.user;
        setIsAdmin(serverUser.isAdmin || false);
        setIsOwner(localUser.userid === comment.userId._id);
      } catch (err) {
        console.error('Token validation failed:', err.message);
        setIsOwner(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [comment.userId._id]);

  const handleDelete = async () => {
    if (!isOwner && !isAdmin) {
      toast.error('You are not authorized to delete this comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Comment deleted successfully!');
      refetchComments();
    } catch (err) {
      console.error('Delete comment error:', err?.response?.data?.message || err.message);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-1 m-1 my-3 min-w-fit h-auto w-full flex justify-start flex-col border-1 border-slate-700">
      <div className="flex items-center">
        <img
          src={comment?.userId.profilePic}
          alt={comment?.userId.username}
          className="p-1 m-1 size-10 object-cover"
        />
        <div className="flex flex-col flex-grow">
          <p className="">{comment?.userId.username}</p>
          <p className="text-xs text-slate-400">{formatDate(comment.createdAt)}</p>
        </div>
        {(isOwner || isAdmin) && (
          <button
            onClick={handleDelete}
            className="p-1 m-1 text-red-500 hover:text-red-700"
            title="Delete comment"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
      <article className="p-1 m-2">{comment.comment}</article>
    </div>
  );
};

export default PostDetail;