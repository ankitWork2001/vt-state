import React, { useState } from 'react';
import { Search } from 'lucide-react';

function RelatedArticleCard() {
  const [post, setPost] = useState('');

  const changeHandle = (e) => {
    setPost(e.target.value);
  };

  const recent = [
    { id: '1', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '2', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '3', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '4', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
  ];

  const popular = [
    { id: '1', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '2', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '3', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
    { id: '4', title: 'Budget 2024: Key Reforms for UPSC Aspirants', logo: '', date: '26/6/2025' },
  ];

  return (
    <div className='min-w-60 h-auto w-full max-w-full flex flex-col'>
      <SearchPost post={post} changeHandle={changeHandle} />

      <h3 className="p-1 m-1 mt-10 text-xl font-semibold border-l-2 border-slate-700 px-2">
        Recent Posts
      </h3>
      <div>
        {recent.map((item) => (
          <RecentPost key={item.id} data={item} />
        ))}
      </div>

      <h3 className="p-1 m-1 mt-10 text-xl font-semibold border-l-2 border-slate-700 px-2">
        Popular Posts
      </h3>
      <div>
        {popular.map((item) => (
          <RecentPost key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

function SearchPost({ post, changeHandle }) {
  return (
    <div className='p-2 m-1 my-3 min-w-100 h-auto w-full max-w-full flex justify-between gap-2 mt-4 border-1 border-slate-400'>
      <div className='flex w-full'>
        <input
          className='w-full bg-transparent outline-none'
          placeholder='Search...'
          value={post}
          onChange={changeHandle}
        />
      </div>
      <Search className="text-slate-700" />
    </div>
  );
}

function RecentPost({ data }) {
  return (
    <div className='p-2 m-1 my-3 w-full border border-slate-300 rounded shadow-sm'>
      <div className='font-medium text-sm'>{data.title}</div>
      <div className='text-xs text-slate-600 mt-1'>
        <p>{data.date}</p>
      </div>
    </div>
  );
}

export default RelatedArticleCard;
