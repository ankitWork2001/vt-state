'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <div className="border border-black p-4 rounded flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <Image
        src={article.image}
        alt="thumb"
        width={100}
        height={100}
        className="rounded object-cover w-full sm:w-28 sm:h-20"
      />
      <div className="flex-1">
        <p className="text-sm text-gray-600">📝 Essay</p>
        <h3 className="font-medium text-base">{article.title}</h3>
        <p className="text-xs text-gray-500">{article.date}</p>
      </div>
      <div className="mt-2 sm:mt-0">
        <Link href={`/blog-listings/${article.id}`} className="block">
          <button className="text-red-600 border border-red-500 px-4 py-1 rounded hover:bg-red-50 text-sm">
            Read
          </button>
        </Link>
      </div>
    </div>
  );
}
