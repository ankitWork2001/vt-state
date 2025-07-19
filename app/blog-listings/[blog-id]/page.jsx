'use client';

import React, { useEffect, useState, useRef } from 'react';
import BlogHeader from '@/components/BlogDetails/BlogHeader';
import AuthorProfile from '@/components/BlogDetails/AuthorProfile';
import BlogContent from '@/components/BlogDetails/BlogContent';
import CommentSection from '@/components/BlogDetails/CommentSection';
import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';
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
  const [commentsDetails, setCommentsDetails] = useState(null);
  const [error, setError] = useState('');

  // Track visit state
  const visitIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const activeDurationRef = useRef(0);
  const lastActiveRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const isActiveRef = useRef(true);

  const fetchBlog = async () => {
    try {
      setError('');
      if (!slug) {
        setError('Blog ID is missing');
        return;
      }

      const token = localStorage.getItem('token');
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = localUser.userid;
      console.log('userId from localStorage:', userId);

      const res = await axiosInstance.get(`/blogs/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('Blog details response:', res.data);

      const blog = res.data.blog;
      const likedByUser = blog.likes?.some(like => like._id === userId) || false;
      const bookmarkedByUser = blog.bookmarks?.some(bookmark => bookmark._id === userId) || false;

      setBlogDetails({
        ...blog,
        likedByUser,
        bookmarkedByUser,
      });
      console.log('Set blogDetails:', { likedByUser, bookmarkedByUser });
    } catch (e) {
      setError(e?.message || 'Something went wrong while fetching blog');
    }
  };

  const fetchComments = async () => {
    try {
      setError('');
      if (!slug) {
        setError('Blog ID is missing');
        return;
      }

      const res = await axiosInstance.get(`/comments/${slug}`, {
        params: { blogId: slug },
      });
      console.log('Comments response:', res.data);
      setCommentsDetails(res.data);
    } catch (e) {
      setError(e?.message || 'Something went wrong while fetching comments');
    }
  };

  // Track page visit
  useEffect(() => {
    if (!slug) return;

    // Generate or retrieve sessionId
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('sessionId', sessionId);
      console.log('Generated new sessionId:', sessionId);
    } else {
      console.log('Using existing sessionId:', sessionId);
    }

    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localUser.userid || null;

    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

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
        console.log('Visit started:', { sessionId, articleId: slug, userId, visitId: res.data.data.id });
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
          duration, // Send active duration
        });
        console.log('Visit ended:', { sessionId, articleId: slug, duration });
        visitIdRef.current = null;
        isActiveRef.current = false;
        activeDurationRef.current = 0;
      } catch (err) {
        console.error('End visit error:', err.message);
      }
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isActiveRef.current && visitIdRef.current) {
          // Resume tracking
          isActiveRef.current = true;
          lastActiveRef.current = Date.now();
          console.log('Tab visible, resuming visit:', { sessionId, articleId: slug });
        }
      } else {
        // Tab hidden, end visit
        if (isActiveRef.current) {
          activeDurationRef.current += (Date.now() - lastActiveRef.current) / 1000;
          endVisit();
          console.log('Tab hidden, visit ended:', { sessionId, articleId: slug, activeDuration: activeDurationRef.current });
        }
      }
    };

    // Handle inactivity
    const resetInactivityTimer = () => {
      lastActiveRef.current = Date.now();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          activeDurationRef.current += (Date.now() - lastActiveRef.current) / 1000;
          endVisit();
          console.log('Inactivity timeout, visit ended:', { sessionId, articleId: slug, activeDuration: activeDurationRef.current });
        }
      }, INACTIVITY_TIMEOUT);
    };

    // Start visit
    startVisit();

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', endVisit);
    ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Initialize inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      endVisit();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', endVisit);
      ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [slug]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [slug]);

  if (error) {
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
          <CommentSection commentsDetails={commentsDetails} refetchComments={fetchComments} />
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
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <pre className="text-sm text-red-500">{error}</pre>
    </div>
  );
};

function BlogDetailsSkeleton() {
  return (
    <>
      <div className="mx-auto flex w-[95%] flex-col sm:flex-row">
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
            <Skeleton className="w-full h-80 sm:h-100 my-2" />
            <div className="w-full space-y-2 p-2">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </div>
          <div className="min-w-60 w-full flex flex-col">
            <Skeleton className="h-6 w-60 my-3" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 my-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-[30%] mx-auto">
          <div className="min-w-60 w-full flex flex-col">
            <Skeleton className="h-10 w-full my-3" />
            <Skeleton className="h-6 w-40 my-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full my-2" />
            ))}
            <Skeleton className="h-6 w-40 mt-8 mb-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full my-2" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}