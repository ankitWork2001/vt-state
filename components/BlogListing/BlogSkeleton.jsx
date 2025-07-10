export default function BlogSkeleton() {
  return (
    <div className="bg-white border border-black p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image Skeleton */}
        <div className="flex-shrink-0 w-full sm:w-48 flex items-center justify-center">
          <div className="bg-gray-200 rounded w-full sm:w-48 h-48 sm:h-36"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Title Skeleton */}
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
            {/* Bookmark Skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Category Skeleton */}
          <div className="mb-3">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Excerpt Skeleton */}
          <div className="mb-3">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* Author & Meta Skeleton */}
          <div className="flex flex-col">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
