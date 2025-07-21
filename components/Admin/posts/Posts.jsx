'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Papa from 'papaparse';
import PostDetails from './PostDetail';
import { axiosInstance } from '@/lib/axios';
import PostForm from '@/components/Admin/addPost/PostForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Posts = ({ setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false); // New state for API failure
  const [editingPostId, setEditingPostId] = useState(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const loader = useRef(null);

  const fetchBlogs = useCallback(
    async (pageNum = 1, isReset = false) => {
      if (!token || fetchError) return; // Stop if no token or fetch error
      try {
        setLoading(true);
        let url = `/analytics/blogs?page=${pageNum}&limit=5`;
        if (selectedCategoryId !== 'All') url += `&category=${selectedCategoryId}`;
        if (selectedSubcategoryId !== 'All') url += `&subcategory=${selectedSubcategoryId}`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

        const res = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newBlogs = res.data.data.blogs || [];
        if (isReset || pageNum === 1) {
          setBlogs(newBlogs);
        } else {
          setBlogs((prev) => [...prev, ...newBlogs]);
        }
        setHasMore(newBlogs.length === 5); // Assume full page means more data
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setFetchError(true); // Set error flag on failure
        toast.error('Failed to fetch posts. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [selectedCategoryId, selectedSubcategoryId, searchTerm, token, fetchError]
  );

  // Reset page when filters or search term changes
  useEffect(() => {
    setPage(1);
    setFetchError(false); // Reset error on filter change
    fetchBlogs(1, true);
  }, [selectedCategoryId, selectedSubcategoryId, searchTerm, fetchBlogs]);

  // Load more on scroll
  useEffect(() => {
    if (page === 1) return;
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  // Intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && !fetchError) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading, fetchError]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
        toast.error('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const matchedCategory = categories.find((c) => c.id === selectedCategoryId);
    const subcats = matchedCategory?.subcategories || [];
    setSubCategories(subcats);
    if (selectedSubcategoryId !== 'All' && !subcats.some((sub) => sub.id === selectedSubcategoryId)) {
      setSelectedSubcategoryId('All');
    }
  }, [selectedCategoryId, categories]);

  const displayedPosts = blogs.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackToList = () => setSelectedPost(null);

  const handleExportCSV = () => {
    const csvData = displayedPosts.map((post) => ({
      ID: post.id || post._id,
      Title: post.title,
      Category: post.category?.name || post.category || 'Uncategorized',
      PublishedDate: new Date(post.date || post.createdAt).toLocaleDateString(),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'posts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (id) => {
    const post = blogs.find((p) => (p.id || p._id) === id);
    setSelectedPost(post);
  };

  const handleEdit = (id) => setEditingPostId(id);

  const handleDeleteClick = (id) => {
    setPostToDeleteId(id);
    setShowDeleteConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!postToDeleteId) return;
    try {
      await axiosInstance.delete(`/blogs/${postToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((post) => (post.id || post._id) !== postToDeleteId));
      toast.success('Post deleted successfully!');
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast.error('Failed to delete post.');
    } finally {
      setShowDeleteConfirmDialog(false);
      setPostToDeleteId(null);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    const updatedId = updatedPost.id || updatedPost._id;
    setBlogs((prevBlogs) => prevBlogs.map((b) => ((b.id || b._id) === updatedId ? updatedPost : b)));
    setEditingPostId(null);
  };

  // Skeleton component for loading posts
  const PostSkeleton = () => (
    <tr className="border-t border-gray-200">
      <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-1/2" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-1/3" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-1/4" /></td>
      <td className="px-6 py-4">
        <div className="flex gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
        </div>
      </td>
    </tr>
  );

  if (selectedPost) {
    return <PostDetails post={selectedPost} onBack={handleBackToList} />;
  }

  if (editingPostId) {
    return (
      <PostForm
        postId={editingPostId}
        onPostSuccess={handlePostUpdate}
        onCancelEdit={() => setEditingPostId(null)}
        setActiveTab={setActiveTab}
        onBack={() => setEditingPostId(null)}
      />
    );
  }

  return (
    <>
      <Toaster />
      <div className="bg-gray-50 shadow rounded-xl p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#1F3C5F]"
          />
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedSubcategoryId}
            onValueChange={setSelectedSubcategoryId}
            disabled={selectedCategoryId === 'All' || subCategories.length === 0}
          >
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subcategories</SelectItem>
              {subCategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-[#A2DD62] text-white">
              <tr>
                <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Title</th>
                <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Category</th>
                <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Date</th>
                <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Views</th>
                <th className="px-6 py-4 text-[#1F3C5F] text-[16px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading && !blogs.length ? (
                [...Array(5)].map((_, i) => <PostSkeleton key={`initial-skeleton-${i}`} />)
              ) : (
                <>
                  {displayedPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-t border-gray-200 hover:bg-gray-100 text-[16px]"
                    >
                      <td className="px-6 py-4 font-medium">{post.title}</td>
                      <td className="px-6 py-4">
                        {post.category?.name || post.categoryId?.name || post.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(post.createdAt || post.Date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {post.views !== undefined && post.views !== null ? post.views : 0}
                      </td>
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <button
                          onClick={() => handleView(post.id || post._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(post.id || post._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post.id || post._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {loading && blogs.length > 0 && (
                    [...Array(5)].map((_, i) => <PostSkeleton key={`loading-skeleton-${i}`} />)
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* States */}
        {displayedPosts.length === 0 && !loading && !fetchError && (
          <div className="p-6 text-center text-gray-500">No posts found.</div>
        )}
        {fetchError && (
          <div className="p-6 text-center text-red-500">Failed to load posts. Please try again later.</div>
        )}
        {!hasMore && !loading && blogs.length > 0 && (
          <div className="text-center p-4 text-gray-400">No more posts to load.</div>
        )}

        {/* Infinite scroll anchor */}
        <div ref={loader} className="h-10" />

        {/* Export Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleExportCSV}
            className="bg-[#1F3C5F] text-white px-6 py-2 rounded-lg hover:bg-[#153050] transition"
          >
            Export CSV
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Posts;