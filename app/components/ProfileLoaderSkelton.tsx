
export default function ProfileInfoSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 animate-pulse space-y-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}
