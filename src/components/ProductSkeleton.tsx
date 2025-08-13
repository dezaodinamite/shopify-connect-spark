import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ProductSkeleton() {
  return (
    <div className="surface radius-lg ring-1 ring-border flex flex-col h-full">
      <div className="relative">
        <AspectRatio ratio={4/5}>
          <Skeleton className="h-full w-full radius-lg" />
        </AspectRatio>
        {/* Quick add button skeleton */}
        <Skeleton className="absolute top-3 right-3 w-10 h-10 rounded-full" />
      </div>
      <div className="flex-1 min-h-[120px] p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="border-t border-border/50 p-6 pt-4 space-y-3">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}