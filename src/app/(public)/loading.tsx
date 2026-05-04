import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 space-y-8">
        <Skeleton className="h-[500px] w-full rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 p-6 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full mx-auto" />
              <Skeleton className="h-5 w-24 mx-auto" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
