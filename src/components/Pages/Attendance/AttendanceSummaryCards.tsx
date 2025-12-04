import { type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  desc?: string;
  icon: LucideIcon;
  color?: string;
}

export const SummaryCard = ({
  title,
  value,
  desc,
  icon: Icon,
  color = "text-primary",
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-5 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>

          {desc && <p className="text-xs text-muted-foreground mt-2">{desc}</p>}
        </div>

        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
