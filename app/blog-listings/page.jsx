import React from 'react';
import FilterTabs from '@/components/BlogListing/FilterTabs';
import BlogViewControls from '@/components/BlogListing/BlogViewControls';
import FilteredBlogs from '@/components/BlogListing/FilteredBlogs';
import NavigationMenu from '@/components/common/NavigationMenu';


const BlogList = () => {
  return (
    <div className="bg-white">
      <NavigationMenu />
      <FilterTabs />
      <BlogViewControls />
      <FilteredBlogs />
    </div>
  );
};

export default BlogList;