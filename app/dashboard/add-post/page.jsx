import AddPostForm from '@/components/AddPost/AddPostForm'
import Header from '@/components/AddPost/Header'
import AdminPanel from '@/components/common/AdminPanel'
import React from 'react'

function page() {
  return (
    <div>
      <AdminPanel />
      <Header />
      <AddPostForm />
    </div>
  )
}

export default page