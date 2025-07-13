"use client"

export default function BlogSkeleton() {
  return (
    <div className="mx-auto flex w-[95%] flex-col lg:flex-row gap-8 py-8">
      <div className="flex-1 max-w-4xl">
        {/* Header Skeleton */}
        <div className="w-full mb-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded-md mb-4 mx-auto w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md mb-4 mx-auto w-1/4 animate-pulse"></div>
            <div className="flex justify-center gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Author Profile Skeleton */}
        <div className="flex flex-col items-center py-8 border-b border-gray-200 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded-md w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-16 animate-pulse"></div>
            </div>
          </div>

          <div className="flex gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="w-full h-64 lg:h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>

        {/* Comments Skeleton */}
        <div className="border-t border-gray-200 pt-8">
          <div className="h-8 bg-gray-200 rounded-md mb-6 w-48 animate-pulse"></div>

          {/* Comment Cards Skeleton */}
          <div className="space-y-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Form Skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-6 bg-gray-200 rounded mb-4 w-40 animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="flex justify-end">
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}
