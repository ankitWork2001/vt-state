"use client";

import React, { useState, useEffect } from "react";
import AdminPanel from "@/components/common/AdminPanel";
import Header from "@/components/Admin/Header";

// Dashboard Sections
import RecentPosts from "@/components/Admin/dashboard/RecentPosts";
import StatCards from "@/components/Admin/dashboard/StatCards";
import NavigationMenu from "@/components/common/NavigationMenu";

// Other Tab Pages
import Posts from "@/components/Admin/posts/Posts";
import PostForm from "@/components/Admin/addPost/PostForm";
import Analytics from "@/components/Admin/Analytics";

// Dummy backend functions (simulate API)
const getPosts = async () => {
  // Simulate fetching recent posts
  return [
    {
      id: 1,
      title: "UPSC Essay Tips",
      category: "UPSC",
      date: "15/6/25",
      views: 1234,
    },
    {
      id: 2,
      title: "BPSC Strategy",
      category: "BPSC",
      date: "9/6/25",
      views: 776,
    },
    {
      id: 3,
      title: "Current Affairs",
      category: "General",
      date: "5/6/25",
      views: 6543,
    },
    {
      id: 4,
      title: "Essay Writing",
      category: "UPSC",
      date: "1/6/25",
      views: 8876,
    },
  ];
};

const getStats = async () => {
  // Simulate fetching dashboard stats
  return {
    "Total Posts": 1250,
    "Active Users": 3450,
    "Avg. Read Time": "4 Min",
    Drafts: "12",
  };
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch dummy data when Dashboard is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      getPosts().then(setPosts);
      getStats().then(setStats);
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "posts":
        return <Posts />;

      case "postForm":
        return <PostForm />;

      case "analytics":
        return <Analytics />;

      case "dashboard":
      default:
        return (
          <>
            <div className="ml-5">
              <NavigationMenu
                path={[
                  { label: "Home", href: "/" },
                  { label: "Dashboard", href: "/dashboard" },
                ]}
              />

              <h1 className="text-3xl text-[#1F3C5F] font-semibold mt-8">
                Dashboard
              </h1>
              {/* Dashboard overview cards */}
              {stats && <StatCards stats={stats} />}
              {/* Recent posts fetched from dummy backend */}
              <RecentPosts posts={posts} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar with tab selection */}
      <AdminPanel
        onSelect={setActiveTab}
        activeKey={activeTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main dashboard content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 bg-[#F9FBFD]">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
