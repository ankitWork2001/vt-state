  import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/lib/axios';

export default function useBlogFetcher({ limit, selectedCategory, subSelectedCategory, page }) {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(null);
    const [newBlogs, setNewBlogs] = useState([]);
    console.log(limit, selectedCategory, subSelectedCategory, page)

    const sendQuery = useCallback(async () => {
        setIsFetching(true);
        setError(null);

        try {
            // Build query parameters
            const params = new URLSearchParams({
                selectedCategory,
                page: page.toString(),
                limit: limit.toString(),
            });

            if (subSelectedCategory && subSelectedCategory.length > 0) {
                params.append('subSelectedCategory', subSelectedCategory);
            }

            const response = await axiosInstance.get(`/blogs?${params.toString()}`);
            console.log(response);
            setNewBlogs(response.data.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setIsFetching(false);
        }
    }, [limit, selectedCategory, subSelectedCategory, page]);

    useEffect(() => {
        sendQuery();
    }, [sendQuery]);

    return { loading: isFetching, error, newBlogs };
}