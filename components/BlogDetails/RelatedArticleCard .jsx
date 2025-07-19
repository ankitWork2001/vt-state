'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

function RelatedArticleCard({ categoryId, subcategoryId }) {
  const [post, setPost] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [filteredRecentPosts, setFilteredRecentPosts] = useState([]);
  const [filteredPopularPosts, setFilteredPopularPosts] = useState([]);
  const router = useRouter();

  const changeHandle = (e) => {
    setPost(e.target.value);
  };

  const fetchPosts = async () => {
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        page: '1',
        limit: '4',
      });
      if (categoryId) params.append('category', categoryId);
      if (subcategoryId) params.append('subcategory', subcategoryId);

      // Fetch posts
      const res = await axiosInstance.get(`/blogs?${params.toString()}`);
      const blogs = res.data.blogs || [];

      // Format dates and prepare post data
      const formattedPosts = blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        date: new Date(blog.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }), // Format: DD MMM YYYY (e.g., 18 Jul 2025)
      }));

      // Set same data for recent and popular posts
      setRecentPosts(formattedPosts);
      setPopularPosts(formattedPosts);
      setFilteredRecentPosts(formattedPosts);
      setFilteredPopularPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    // Filter posts based on search input
    const searchTerm = post.toLowerCase().trim();
    if (searchTerm === '') {
      setFilteredRecentPosts(recentPosts);
      setFilteredPopularPosts(popularPosts);
    } else {
      const filtered = recentPosts.filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      );
      setFilteredRecentPosts(filtered);
      setFilteredPopularPosts(filtered);
    }
  }, [post, recentPosts, popularPosts]);

  return (
    <div className="min-w-60 h-auto w-full max-w-full flex flex-col">
      <SearchPost post={post} changeHandle={changeHandle} />

      <h3 className="p-1 m-1 mt-10 text-xl font-semibold border-l-2 border-slate-700 px-2">
        Recent Posts
      </h3>
      <div>
        {filteredRecentPosts.length > 0 ? (
          filteredRecentPosts.map((item) => (
            <RecentPost key={item.id} data={item} onClick={() => router.push(`/blog-listings/${item.id}`)} />
          ))
        ) : (
          <p className="p-2 m-1 text-sm text-slate-600">No posts found</p>
        )}
      </div>

      <h3 className="p-1 m-1 mt-10 text-xl font-semibold border-l-2 border-slate-700 px-2">
        Popular Posts
      </h3>
      <div>
        {filteredPopularPosts.length > 0 ? (
          filteredPopularPosts.map((item) => (
            <RecentPost key={item.id} data={item} onClick={() => router.push(`/blog-listings/${item.id}`)} />
          ))
        ) : (
          <p className="p-2 m-1 text-sm text-slate-600">No posts found</p>
        )}
      </div>
    </div>
  );
}

function SearchPost({ post, changeHandle }) {
  return (
    <div className="p-2 m-1 my-3 min-w-100 h-auto w-full max-w-full flex justify-between gap-2 mt-4 border-1 border-slate-400">
      <div className="flex w-full">
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Search..."
          value={post}
          onChange={changeHandle}
        />
      </div>
      <Search className="text-slate-700" />
    </div>
  );
}

function RecentPost({ data, onClick }) {
  return (
    <div
      className="p-2 m-1 my-3 w-full border border-slate-300 rounded shadow-sm cursor-pointer hover:bg-slate-50"
      onClick={onClick}
    >
      <div className="font-medium text-sm">{data.title}</div>
      <div className="text-xs text-slate-600 mt-1">
        <p>{data.date}</p>
      </div>
    </div>
  );
}

export default RelatedArticleCard;