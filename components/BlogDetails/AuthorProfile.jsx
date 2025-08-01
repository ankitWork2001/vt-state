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
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !localUser.userid) {
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
    setLike(likedByUser);
    setBookmark(bookmarkedByUser);
    setLikeCount(likes);
    setBookmarkCount(bookmarks);
  }, [likedByUser, bookmarkedByUser, likes, bookmarks]);

  const handleLike = async () => {
    if (!isValidUser || !blogid) {
      setHideComment(true);
      return;
    }

    const prevLikeState = like;
    const newLikeState = !prevLikeState;
    setLike(newLikeState);
    setLikeCount(prevCount => newLikeState ? prevCount + 1 : prevCount - 1);

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
    } catch (e) {
      console.error('Like error:', e?.response?.data?.message || e.message);
      // Revert UI on error
      setLike(prevLikeState);
      setLikeCount(prevCount => newLikeState ? prevCount - 1 : prevCount + 1);
    }
  };

  const handleBookmark = async () => {
    if (!isValidUser || !blogid) {
      setHideComment(true);
      return;
    }

    const prevBookmarkState = bookmark;
    const newBookmarkState = !prevBookmarkState;
    setBookmark(newBookmarkState);
    setBookmarkCount(prevCount => newBookmarkState ? prevCount + 1 : prevCount - 1);

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
    } catch (e) {
      console.error('Bookmark error:', e?.response?.data?.message || e.message);
      // Revert UI on error
      setBookmark(prevBookmarkState);
      setBookmarkCount(prevCount => newBookmarkState ? prevCount - 1 : prevCount + 1);
    }
  };


  const handleComment = () => {
    const commentSection = document.getElementById('comment-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
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