import Header from '@/components/posts/Header'
import AdminPanel from '@/components/common/AdminPanel'
import PostsTable from '@/components/posts/PostsTable'
import Search from '@/components/posts/Search'
import Head from 'next/head'
import React from 'react'

function page() {
  return (
    <div>
        <AdminPanel />
        <Header/>
        <Search />
        <PostsTable />

    </div>
  )
}

export default page