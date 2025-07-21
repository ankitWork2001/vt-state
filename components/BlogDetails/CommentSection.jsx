'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import { axiosInstance } from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function CommentSection({ commentsDetails, refetchComments, handleNewComment }) {
  const [comments, setComments] = useState(commentsDetails?.comments || []);
  const [total, setTotal] = useState(commentsDetails?.total || 0);
  const [page, setPage] = useState(commentsDetails?.page || 1);
  const [hasMore, setHasMore] = useState(commentsDetails?.pages > 1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const { 'blog-id': blogId } = useParams();
  const loader = useRef(null);

  // Sync with parent commentsDetails
  useEffect(() => {
    setComments(commentsDetails?.comments || []);
    setTotal(commentsDetails?.total || 0);
    setPage(commentsDetails?.page || 1);
    setHasMore(commentsDetails?.pages > page);
    setFetchError(false);
  }, [commentsDetails]);

  const fetchComments = useCallback(
    async (pageNum = 1, isReset = false) => {
      if (!blogId || fetchError) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get(`/comments/${blogId}?page=${pageNum}&limit=5`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const newComments = res.data.comments || [];
        setComments((prev) => {
          const existingIds = new Set(prev.map(c => c._id));
          const filteredNew = newComments.filter(c => !existingIds.has(c._id));
          return isReset ? newComments : [...prev, ...filteredNew];
        });
        setTotal(res.data.total || 0);
        setPage(res.data.page || pageNum);
        setHasMore(res.data.pages > pageNum);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [blogId, fetchError]
  );

  // Fetch comments when page changes
  useEffect(() => {
    if (page > 1) {
      fetchComments(page);
    }
  }, [page, fetchComments]);

  // Set up infinite scroll observer
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading && !fetchError) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading, fetchError]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  // Skeleton component for loading comments
  const CommentSkeleton = () => (
    <div className="p-1 m-1 my-3 min-w-fit h-auto w-full flex justify-start flex-col border-1 border-slate-700">
      <div className="flex items-center">
        <Skeleton className="p-1 m-1 size-10 rounded-full" />
        <div className="flex flex-col flex-grow">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="p-1 m-1 h-5 w-5" />
      </div>
      <div className="p-1 m-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    </div>
  );

  return (
    <div id="comment-section" className="min-w-60 h-auto w-full max-w-full flex flex-col">
      <CommentForm handleNewComment={handleNewComment} />
      <h2 className="p-1 m-1 my-5 text-xl font-semibold border-l-2 border-slate-700 px-2">
        {`${total} thought${total !== 1 ? 's' : ''} on this blog`}
      </h2>

      {isLoading && !comments.length ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={`initial-skeleton-${i}`} />
          ))}
        </div>
      ) : (
        <>
          {comments.map((data) => (
            <div key={data._id}>
              <CommentCard comment={data} refetchComments={refetchComments} />
            </div>
          ))}
          {isLoading && (
            <div className="space-y-3 mt-4">
              {[...Array(3)].map((_, i) => (
                <CommentSkeleton key={`loading-skeleton-${i}`} />
              ))}
            </div>
          )}
        </>
      )}

      <div ref={loader} className="flex justify-center items-center py-6"></div>
    </div>
  );
}

export default CommentSection;