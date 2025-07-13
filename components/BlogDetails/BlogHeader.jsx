'use client'
import { formatDate } from '@/lib/formatDate'

export default function BlogHeader({ title, date }) {
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight">
          {title}
        </h1>
        {date && (
          <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
            {formatDate(date)}
          </p>
        )}
      </div>
    </div>
  )
}