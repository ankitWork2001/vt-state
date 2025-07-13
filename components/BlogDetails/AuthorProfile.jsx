'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, MessageSquare, Bookmark } from 'lucide-react';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { axiosInstance } from '@/lib/axios';

function AuthorProfile({ author, comments = 0, bookmarks = 0, likes = 0, likedByUser = false, bookmarkedByUser = false }) {
  const router = useRouter();
  const params = useParams();
  const blogid = params['blog-id'];

  const [user, setUser] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [like, setLike] = useState(likedByUser);
  const [bookmark, setBookmark] = useState(bookmarkedByUser);
  const [likeCount, setLikeCount] = useState(likes);
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks);
  const [hideComment, setHideComment] = useState(false);

  useEffect(() => {
    console.log('axiosInstance:', axiosInstance);
    console.log('blogid:', blogid);
    console.log('Props:', { likedByUser, bookmarkedByUser, likes, bookmarks, isValidUser });

    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !localUser.userid) {
        setIsValidUser(false);
        setIsLoading(false);
        return;
      }

      if (!axiosInstance || typeof axiosInstance.get !== 'function') {
        console.error('axiosInstance is not properly initialized:', axiosInstance);
        setIsValidUser(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get('/auth/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const serverUser = data.user;

        if (localUser.userid === serverUser.userId && !serverUser.isAdmin) {
          setIsValidUser(true);
          setUser(localUser);
        } else {
          setIsValidUser(false);
        }
      } catch (err) {
        console.error('Token validation failed:', err.message);
        setIsValidUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Sync states with props
  useEffect(() => {
    console.log('Updating states with props:', { likedByUser, bookmarkedByUser, likes, bookmarks });
    setLike(likedByUser);
    setBookmark(bookmarkedByUser);
    setLikeCount(likes);
    setBookmarkCount(bookmarks);
  }, [likedByUser, bookmarkedByUser, likes, bookmarks]);

  const handleLike = async () => {
    if (!isValidUser) {
      setHideComment(true);
      return;
    }

    if (!blogid) {
      console.error('Cannot like: blogid is undefined');
      setHideComment(true);
      return;
    }

    const prevLikeState = like;
    const prevLikeCount = likeCount;
    setLike(!prevLikeState); // Optimistic update
    setLikeCount(prevLikeState ? prevLikeCount - 1 : prevLikeCount + 1);
    console.log('handleLike triggered:', { prevLikeState, prevLikeCount, newLikeState: !prevLikeState });

    try {
      await axiosInstance.post(
        `/blogs/${blogid}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token || localStorage.getItem('token')}`,
          },
        }
      );
      // Refetch to sync with backend
      const res = await axiosInstance.get(`/blogs/${blogid}`, {
        headers: {
          Authorization: `Bearer ${user.token || localStorage.getItem('token')}`,
        },
      });
      console.log('Refetched blog after like:', res.data);
      setLike(res.data.blog.likes?.some(like => like._id === user.userid) || false);
      setLikeCount(res.data.blog.likes?.length || 0);
    } catch (e) {
      console.error('Like error:', e?.response?.data?.message || e.message);
      setLike(prevLikeState);
      setLikeCount(prevLikeCount);
    }
  };

  const handleBookmark = async () => {
    if (!isValidUser) {
      setHideComment(true);
      return;
    }

    if (!blogid) {
      console.error('Cannot bookmark: blogid is undefined');
      setHideComment(true);
      return;
    }

    const prevBookmarkState = bookmark;
    const prevBookmarkCount = bookmarkCount;
    setBookmark(!prevBookmarkState);
    setBookmarkCount(prevBookmarkState ? prevBookmarkCount - 1 : prevBookmarkCount + 1);
    console.log('handleBookmark triggered:', { prevBookmarkState, prevBookmarkCount, newBookmarkState: !prevBookmarkState });

    try {
      await axiosInstance.post(
        `/blogs/${blogid}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token || localStorage.getItem('token')}`,
          },
        }
      );
      // Refetch to sync with backend
      const res = await axiosInstance.get(`/blogs/${blogid}`, {
        headers: {
          Authorization: `Bearer ${user.token || localStorage.getItem('token')}`,
        },
      });
      console.log('Refetched blog after bookmark:', res.data);
      setBookmark(res.data.blog.bookmarks?.some(bookmark => bookmark._id === user.userid) || false);
      setBookmarkCount(res.data.blog.bookmarks?.length || 0);
    } catch (e) {
      console.error('Bookmark error:', e?.response?.data?.message || e.message);
      setBookmark(prevBookmarkState);
      setBookmarkCount(prevBookmarkCount);
    }
  };

  const handleComment = () => {
    const commentSection = document.getElementById('comment-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
      console.log('Scrolled to comment-section');
    } else {
      console.error('Comment section not found');
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col">
      <div
        className="cursor-pointer mx-auto w-40 h-30"
        onClick={() =>
          author?.username === 'xyz'
            ? router.push('/profile')
            : router.push('/blog-listings')
        }
      >
        <img
          src={author?.profilePic}
          alt={author?.username}
          width={40}
          height={40}
          className="object-cover place-self-center w-30 h-30 p-1 my-1 rounded-full"
        />
      </div>

      <div className="font-semibold text-md">{author?.username}</div>
      <h5 className="py-2 w-45 text-sm text-center text-gray-500">
        {author?.heading}
      </h5>

      <div className="flex gap-8 text-center py-2 text-slate-400">
        <div
          className={`flex flex-col items-center ${isValidUser && blogid ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={isValidUser && blogid ? handleLike : undefined}
        >
          {like && isValidUser ? (
            <FaHeart className="text-red-500 text-xl mt-1" />
          ) : (
            <Heart className="text-red-400" />
          )}
          <p>{likeCount}</p>
        </div>

        <div className="flex flex-col items-center cursor-pointer" onClick={handleComment}>
          <MessageSquare className="text-green-400" />
          <p>{comments}</p>
        </div>

        <div
          className={`flex flex-col items-center ${isValidUser && blogid ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={isValidUser && blogid ? handleBookmark : undefined}
        >
          {bookmark && isValidUser ? (
            <FaBookmark className="text-yellow-600 text-xl mt-1" />
          ) : (
            <Bookmark className="text-yellow-500" />
          )}
          <p>{bookmarkCount}</p>
        </div>
      </div>

      {hideComment && !isValidUser && (
        <p className="text-sm text-red-500 mt-2">Please log in to like or bookmark.</p>
      )}
      {hideComment && isValidUser && !blogid && (
        <p className="text-sm text-red-500 mt-2">Invalid blog ID.</p>
      )}
    </div>
  );
}

export default AuthorProfile;