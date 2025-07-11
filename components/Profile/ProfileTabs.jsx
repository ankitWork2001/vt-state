import Link from 'next/link'
import React,{ useState, useEffect} from 'react'

const ProfileTabs = ({activeTab, setActiveTab, setShowAll}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    setLoading(false);
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    setData([]);
    setLoading(false);
  };

  fetchData();
}, []);


  if (loading) {
    return (
      <div className="w-full px-4 py-8 mx-auto max-w-[70%] border-t border-gray-300 text-center flex flex-col items-center">
        <div className='animate-pulse h-60 w-full max-w-90 bg-[#E9D5C9] border border-[#E9D5C9] flex justify-center items-center mb-6'>
          <div className='w-35 animate-pulse h-[80%] bg-white text-[#E9D5C9] flex items-center justify-center'></div>
        </div>
        <div className='my-2 animate-pulse font-semibold w-52 rounded h-4 bg-gray-300'></div>
        <div className='my-2 animate-pulse font-normal w-40 rounded h-4 bg-gray-300'></div>
        <div className='px-6 animate-pulse py-2 mt-4 border-2 h-10 w-32 bg-gray-200 rounded'></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 p-8 mx-auto max-w-[70%] border-t border-gray-300 text-center flex flex-col items-center">
      <div className="py-5 flex flex-wrap gap-2 text-sm">
        {['All', 'Liked', 'Bookmarked'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false); 
            }}
            className={`px-4 py-2 border rounded ${
              activeTab === tab ? 'bg-[#6594CD] text-white'
                : 'bg-white border-2 border-[#6594CD] text-black hover:bg-[#6594CD] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}

      </div>
    </div>
  )
}

export default ProfileTabs
