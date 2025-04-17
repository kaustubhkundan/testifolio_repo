export function CloudCharacter() {
  return (
    <div className="relative">
      <div className="relative h-64 w-64">
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg">
          <div className="absolute left-1/2 top-1/4 h-6 w-6 -translate-x-1/2 rounded-full bg-black"></div>
          <div className="absolute left-1/2 top-1/4 h-6 w-6 -translate-x-1/2 translate-x-8 rounded-full bg-black"></div>
          <div className="absolute bottom-1/4 left-1/2 h-4 w-8 -translate-x-1/2 rounded-full bg-red-400"></div>
          <div className="absolute -left-8 top-1/2 h-8 w-16 -translate-y-1/2 rounded-full bg-white shadow-md"></div>
          <div className="absolute -right-8 top-1/2 h-8 w-16 -translate-y-1/2 rounded-full bg-white shadow-md"></div>
          <div className="absolute -bottom-8 left-1/4 h-12 w-8 rounded-full bg-white shadow-md"></div>
          <div className="absolute -bottom-8 right-1/4 h-12 w-8 rounded-full bg-white shadow-md"></div>
        </div>
        <div className="absolute -right-4 top-0 h-16 w-16 rotate-12 transform">
          <div className="h-16 w-16 rounded-full bg-yellow-400 shadow-md"></div>
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-yellow-300"></div>
        </div>
        <div className="absolute -left-2 top-1/4 h-2 w-2 rounded-full bg-yellow-200 shadow-sm"></div>
        <div className="absolute -right-4 bottom-1/4 h-2 w-2 rounded-full bg-yellow-200 shadow-sm"></div>
        <div className="absolute -bottom-8 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-yellow-500 shadow-md"></div>
        <div className="absolute -bottom-8 left-1/4 h-8 w-8 -translate-x-1/2 rounded-full bg-yellow-500 shadow-md"></div>
      </div>
    </div>
  )
}
