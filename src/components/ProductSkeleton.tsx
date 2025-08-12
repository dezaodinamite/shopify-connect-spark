import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ProductSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl border bg-card shadow-soft">
      <div className="relative">
        <AspectRatio ratio={1}>
          <Skeleton className="h-full w-full" />
        </AspectRatio>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}