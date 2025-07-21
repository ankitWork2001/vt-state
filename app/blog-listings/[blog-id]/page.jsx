'use client';

import React, { useEffect, useState, useRef } from 'react';
import BlogHeader from '@/components/BlogDetails/BlogHeader';
import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
import BlogContent from '@/components/BlogDetails/BlogContent';
import CommentSection from '@/components/BlogDetails/CommentSection';
import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard';
import NavigationMenu from '@/components/common/NavigationMenu';
import { useParams } from 'next/navigation';
import { axiosInstance } from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

// Generate a unique sessionId
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2) + '_' + Date.now();
};

const BlogDetails = () => {
  const params = useParams();
  const slug = params['blog-id'];

  const [blogDetails, setBlogDetails] = useState(null);
  const [commentsDetails, setCommentsDetails] = useState({ comments: [], total: 0, page: 1, pages: 0 });
  const [error, setError] = useState('');

  // Refs for analytics tracking
  const visitIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const activeDurationRef = useRef(0);
  const lastActiveRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!slug) {
      setError('Blog ID is missing');
      return;
    }

    // --- Analytics Setup ---
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localUser.userid || null;
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

    const startVisit = async () => {
      try {
        const res = await axiosInstance.post('/analytics/visit/start', {
          sessionId,
          page: `/blog/${slug}`,
          articleId: slug,
          userId,
          deviceInfo: navigator.userAgent,
        });
        visitIdRef.current = res.data.data.id;
        startTimeRef.current = Date.now();
        lastActiveRef.current = Date.now();
        isActiveRef.current = true;
        console.log('Visit started:', { visitId: res.data.data.id });
      } catch (err) {
        console.error('Start visit error:', err.message);
      }
    };

    const endVisit = async () => {
      if (!visitIdRef.current || !isActiveRef.current) return;

      try {
        const currentTime = Date.now();
        const duration = (currentTime - startTimeRef.current) / 1000; // Duration in seconds
        await axiosInstance.post('/analytics/visit/end', {
          sessionId,
          articleId: slug,
          duration,
        });
        console.log('Visit ended:', { duration });
        visitIdRef.current = null;
        isActiveRef.current = false;
        activeDurationRef.current = 0;
      } catch (err) {
        console.error('End visit error:', err.message);
      }
    };

    const resetInactivityTimer = () => {
      lastActiveRef.current = Date.now();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          activeDurationRef.current += (Date.now() - lastActiveRef.current) / 1000;
          endVisit();
          console.log('Inactivity timeout, visit ended.');
        }
      }, INACTIVITY_TIMEOUT);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (isActiveRef.current) {
          activeDurationRef.current += (Date.now() - lastActiveRef.current) / 1000;
          endVisit();
          console.log('Tab hidden, visit ended.');
        }
      } else {
        if (!isActiveRef.current && visitIdRef.current) {
          isActiveRef.current = true;
          lastActiveRef.current = Date.now();
          console.log('Tab visible, resuming visit.');
        }
      }
    };

    // --- Consolidated Data Fetching ---
    const fetchBlogAndComments = async () => {
      try {
        setError('');
        setBlogDetails(null);
        setCommentsDetails({ comments: [], total: 0, page: 1, pages: 0 });

        const token = localStorage.getItem('token');

        // Fetch blog (stop if this fails)
        const blogRes = await axiosInstance.get(`/blogs/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Process blog details
        const blog = blogRes.data.blog;
        const likedByUser = blog.likes?.some(like => like._id === userId) || false;
        const bookmarkedByUser = blog.bookmarks?.some(bookmark => bookmark._id === userId) || false;
        setBlogDetails({ ...blog, likedByUser, bookmarkedByUser });

        // Fetch initial comments (only if blog fetch succeeds)
        const commentsRes = await axiosInstance.get(`/comments/${slug}?page=1&limit=5`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setCommentsDetails({
          comments: commentsRes.data.comments || [],
          total: commentsRes.data.total || 0,
          page: commentsRes.data.page || 1,
          pages: commentsRes.data.pages || 0,
        });

        // Start analytics visit AFTER data has successfully been fetched
        await startVisit();
        resetInactivityTimer();

      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Something went wrong');
        setCommentsDetails({ comments: [], total: 0, page: 1, pages: 0 });
      }
    };

    fetchBlogAndComments();

    // --- Event Listeners Setup ---
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', endVisit);
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // --- Cleanup Function ---
    return () => {
      endVisit();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', endVisit);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [slug]);

  // Handle new comment addition locally
  const handleNewComment = (newComment) => {
    setCommentsDetails((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
      total: prev.total + 1,
    }));
  };

  // Refetch comments (e.g., after deletion)
  const refetchComments = async (page = 1, isReset = false) => {
    try {
      if (!slug) return;
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get(`/comments/${slug}?page=${page}&limit=5`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCommentsDetails((prev) => ({
        ...prev,
        comments: isReset ? res.data.comments : [
          ...prev.comments,
          ...(res.data.comments || []).filter(c => !prev.comments.some(pc => pc._id === c._id)),
        ],
        total: res.data.total || prev.total,
        page: res.data.page || page,
        pages: res.data.pages || prev.pages,
      }));
    } catch (e) {
      console.error('Failed to refetch comments:', e);
      setCommentsDetails((prev) => ({ ...prev, comments: [], total: 0, page: 1, pages: 0 }));
    }
  };

  if (error && !blogDetails) {
    return <NotFound error={error} />;
  }

  if (!blogDetails) {
    return <BlogDetailsSkeleton />;
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
          <BlogHeader title={blogDetails?.title} date={blogDetails?.updatedAt} />
          <AuthorProfile
            author={blogDetails?.author}
            comments={commentsDetails?.total || 0}
            bookmarks={blogDetails?.bookmarks?.length || 0}
            likes={blogDetails?.likes?.length || 0}
            likedByUser={blogDetails?.likedByUser || false}
            bookmarkedByUser={blogDetails?.bookmarkedByUser || false}
          />
          <BlogContent content={blogDetails?.content} thumbnail={blogDetails?.thumbnail} />
          <CommentSection commentsDetails={commentsDetails} refetchComments={refetchComments} handleNewComment={handleNewComment} />
        </div>
        <div className="w-full sm:w-[30%] mx-auto">
          <RelatedArticleCard
            categoryId={blogDetails?.categoryId?._id}
            subcategoryId={blogDetails?.subcategoryId?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

const NotFound = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 text-center bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-4">We couldn't find the blog post you were looking for.</p>
        <pre className="text-sm text-red-500 bg-red-100 p-2 rounded">{typeof error === 'string' ? error : JSON.stringify(error)}</pre>
      </div>
    </div>
  );
};

function BlogDetailsSkeleton() {
  return (
    <>
      <div className="mx-auto flex w-[95%] flex-col sm:flex-row animate-pulse">
        <div className="p-1 mx-auto w-full max-w-4xl flex flex-col gap-4">
          <div className="min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col">
            <Skeleton className="w-20 h-20 rounded-full my-2" />
            <Skeleton className="h-4 w-32 mt-2" />
            <Skeleton className="h-3 w-40 mt-1" />
            <div className="flex gap-8 py-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
          <div className="min-w-60 h-auto w-full max-w-full flex flex-col items-center">
            <Skeleton className="w-full h-80 sm:h-96 my-2" />
            <div className="w-full space-y-2 p-2">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </div>
          <div className="min-w-60 w-full flex flex-col mt-4">
            <Skeleton className="h-6 w-48 my-3" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 my-3 border-t pt-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-[30%] mx-auto mt-4 sm:mt-0">
          <div className="min-w-60 w-full flex flex-col">
            <Skeleton className="h-8 w-full my-3" />
            <Skeleton className="h-6 w-40 my-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full my-2" />
            ))}
            <Skeleton className="h-6 w-40 mt-8 mb-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full my-2" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}