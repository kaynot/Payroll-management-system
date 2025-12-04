import { Skeleton } from "../../ui/skeleton";

export const SummaryCardSkeleton = () => (
  <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-3 animate-pulse">
    <Skeleton className="h-5 w-28" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-4 w-20" />
  </div>
);
