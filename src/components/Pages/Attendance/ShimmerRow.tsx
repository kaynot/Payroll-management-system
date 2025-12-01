import { Skeleton } from "../../ui/skeleton";

export const ShimmerRow = () => {
  return (
    <tr className="animate-pulse border-b">
      <td className="p-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4 text-center">
        <Skeleton className="h-6 w-20 rounded-full mx-auto" />
      </td>
    </tr>
  );
};
