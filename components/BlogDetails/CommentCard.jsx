'use client';

import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-hot-toast';

function CommentCard({ comment, refetchComments }) {
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = useMemo(() => {
    return localUser.userid && !localUser.isAdmin && localUser.userid === comment.userId._id;
  }, [localUser.userid, comment.userId._id]);

  const handleDelete = async () => {
    if (!isOwner) {
      toast.error('You are not authorized to delete this comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Comment deleted successfully!');
      refetchComments(1, true); // Reset to page 1 on deletion
    } catch (err) {
      console.error('Delete comment error:', err?.response?.data?.message || err.message);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

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
        {isOwner && (
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
}

export default CommentCard;