import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ProductSkeleton() {
  return (
    <div className="surface radius-lg">
      <div className="relative">
        <AspectRatio ratio={1}>
          <Skeleton className="h-full w-full radius-lg" />
        </AspectRatio>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}