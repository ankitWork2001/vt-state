"use client"
import { Pencil, Trash2 } from "lucide-react"

const RecentPosts = ({ posts = [] }) => {
  const handleEdit = (id) => {
    alert(`Update button is pressed for the blogid: ${id}`)
  }

  const handleDelete = (id) => {
    alert(`Delete button is pressed for the blogid: ${id}`)
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden mt-6 w-full">
      <h2 className="text-2xl font-semibold text-[#1F3C5F] bg-[#EDF0FB] px-4 py-3">Recent Posts</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#A2DD62] h-[56px] text-white">
            <tr>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Title</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Category</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Date</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Views</th>
              <th className="px-4 py-2 font-bold text-[16px] sm:text-[18px] text-[#1F3C5F]">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {posts.map((post, index) => (
              <tr key={post.id} className={`border-b border-gray-200 hover:bg-gray-50 text-[16px] sm:text-[18px]`}>
                <td className="px-4 py-4">{post.title}</td>
                <td className="px-4 py-4">{post.category}</td>
                <td className="px-4 py-4">{post.date}</td>
                <td className="px-4 py-4">{post.views}</td>
                <td className="px-4 py-4">
                  <div className="flex space-x-4">
                    <button onClick={() => handleEdit(post.id)} className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && <div className="p-4 text-center text-gray-500">No recent posts available.</div>}
      </div>
    </div>
  )
}

export default RecentPosts
