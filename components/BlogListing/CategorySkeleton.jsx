export default function CategorySkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 border-b border-gray-200">
      <div className="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-2 sm:gap-4 lg:gap-6 justify-items-center items-center animate-pulse">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-8 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  )
}
