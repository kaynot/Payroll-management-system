import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useAttendance } from "../../../context/AttendanceContext";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

export default function AttendanceSummaryCards() {
  const { summary, loading } = useAttendance();

  if (loading) {
    return <div className="text-sm text-muted">Loading summary…</div>;
  }

  if (!summary) {
    return (
      <div className="text-sm text-red-500">No summary data available.</div>
    );
  }

  const cards = [
    {
      label: "Total Employees",
      value: summary.totalEmployees,
      icon: Users,
    },
    {
      label: "Present Today",
      value: summary.presentToday,
      icon: UserCheck,
    },
    {
      label: "Late Arrivals",
      value: summary.lateArrivals,
      icon: Clock,
    },
    {
      label: "Absent",
      value: summary.absent,
      icon: UserX,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <card.icon className="w-5 h-5 text-primary" />
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
