import React, { useEffect, useState } from "react";
import { Eye, Bookmark, BookmarkCheck } from "lucide-react";
import axios from "axios";
import NavigationMenu from "../common/NavigationMenu";

const fetchAnalytics = async () => {
  // Simulated backend data (mock API call)
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        totalViews: 3246,
        viewDelta: "128",
        timeSpent: 12.4,
        timeDelta: 44,
        subscribers: 483,
        realtime: 17,
        realtimeChart: [30, 60, 20, 50, 70, 40, 55],
        articles: [
          {
            id: 1,
            title: "Budget 2024: Key Reforms for UPSC Aspirants",
            category: "CurrentAffairs",
            author: "Priya Sharma",
            date: "26 June 2025",
            timeAgo: "5 minutes ago",
            views: 246,
            image: "https://source.unsplash.com/300x200/?government,building",
            saved: false,
          },
          {
            id: 2,
            title: "Budget 2024: Key Reforms for UPSC Aspirants",
            category: "CurrentAffairs",
            author: "Priya Sharma",
            date: "26 June 2025",
            timeAgo: "22 minutes ago",
            views: 246,
            image: "https://source.unsplash.com/300x200/?handwriting,notes",
            saved: true,
          },
          {
            id: 3,
            title: "Budget 2024: Key Reforms for UPSC Aspirants",
            category: "CurrentAffairs",
            author: "Priya Sharma",
            date: "26 June 2025",
            timeAgo: "58 minutes ago",
            views: 246,
            image: "https://source.unsplash.com/300x200/?bookshelf,preparation",
            saved: false,
          },
        ],
      });
    }, 1000)
  );
};

// Simulate save/unsave API
const saveArticle = async (id, shouldSave) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ success: true, saved: shouldSave });
    }, 500)
  );
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveToggle = async (id) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    const updatedArticles = [...analytics.articles];
    const articleIndex = updatedArticles.findIndex((a) => a.id === id);
    const current = updatedArticles[articleIndex];

    try {
      const result = await saveArticle(id, !current.saved);
      if (result.success) {
        updatedArticles[articleIndex].saved = result.saved;
        setAnalytics({ ...analytics, articles: updatedArticles });
      }
    } catch (error) {
      console.error("Save action failed", error);
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500 animate-pulse">
        Loading analytics...
      </div>
    );

  return (
    <>
          <NavigationMenu
            path={[
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard" },
            ]}
          />
   
        
        {/* Main Content */}
        <div className=" flex justify-center text-center">
          <div className="max-w-6xl w-full p-6">
            <h1 className="text-3xl font-bold text-[#1F3C5F] mb-4">
              Analytics
            </h1>

            {/* Summary */}
            <div className="p-4 rounded-lg mb-6">
              <h2 className="text-3xl font-semibold mb-2">
                Your Article got {analytics.totalViews} views in the last 28
                Days
              </h2>

              <div className="flex flex-wrap gap-6 mt-8 text-center justify-center">
                <Card
                  title="Views"
                  value={analytics.totalViews}
                  sub={analytics.viewDelta + " more than usual"}
                />
                <Card
                  title="Time Spent (hours)"
                  value={analytics.timeSpent}
                  sub={analytics.timeDelta + "% more than previous 28 days"}
                />
                <Card
                  title="Newsletter Subscribers"
                  value={analytics.subscribers}
                />
              </div>
            </div>

            {/* Article Section */}
            <div className="grid grid-cols-1 gap-6">
              <h3 className="text-lg font-semibold mb-2">
                Most Viewed Articles
              </h3>
              <div className="space-y-4">
                {analytics.articles.map((article) => (
               <div
  key={article.id}
  className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl border p-3 rounded-md bg-white shadow-sm relative mx-auto"
>
  <img
    src={article.image}
    className="w-full sm:w-60 h-[200px] object-cover rounded-md"
    alt="article preview"
  />
  
  <div className="flex-1">
    <h4 className="font-semibold mb-1 text-[18px] text-gray-800">
      {article.title}
    </h4>
    <div className="text-xs text-green-600 mb-1">
      #{article.category}
    </div>
    <div className="text-sm text-black underline">
      By {article.author}
    </div>
    <div className="text-xs text-gray-500">
      {article.date} • {article.timeAgo}
    </div>
    <div className="text-sm flex items-center gap-1 mt-1 font-medium text-[#1F3C5F]">
      <Eye size={14} /> {article.views} Views
    </div>
  </div>

  {/* Save icon */}
  <button
    onClick={() => handleSaveToggle(article.id)}
    disabled={saving[article.id]}
    className="absolute top-3 right-3 text-gray-700 hover:text-blue-500 transition"
  >
    {saving[article.id] ? (
      <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />
    ) : article.saved ? (
      <BookmarkCheck size={22} />
    ) : (
      <Bookmark size={22} />
    )}
  </button>
</div>

                ))}
              </div>
            </div>
          </div>
        </div>
  
    </>
  );
};

// Card component
const Card = ({ title, value, sub }) => (
  <div className="border p-4 rounded-md bg-gray-50 w-[219px] h-[148px]">
    <div className="text-sm text-gray-600 text-[18px]">{title}</div>
    <div className="text-3xl font-semibold mt-1">{value}</div>
    {sub && <div className="text-[15px] mt-3 text-gray-500">{sub}</div>}
  </div>
);

export default Analytics;
