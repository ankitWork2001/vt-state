import Header from '@/components/Dashboard/Header'
import React from 'react'
import AdminPanel from '@/components/common/AdminPanel'
import RecentActivity from '@/components/Dashboard/RecentActivity'
import TopPerformingPosts from '@/components/Dashboard/TopPerformingPosts'
import TrafficAnalytics from '@/components/Dashboard/TrafficAnalytics'
import RecentPosts from '@/components/Dashboard/RecentPosts'

function page() {
  return (
    <div>
        <AdminPanel />
        <Header />
        <RecentPosts />
        <RecentActivity />
        <TrafficAnalytics />
        <TopPerformingPosts />
        
    </div>
  )
}

export default page