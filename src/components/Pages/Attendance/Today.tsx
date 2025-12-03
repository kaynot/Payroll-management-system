import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import {
  Download,
  Upload,
  Search,
  Clock,
  Percent,
  Plane,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../../ui/pagination";

import { useAttendance } from "../../../context/AttendanceContext";
import { useEmployees } from "../../../context/EmployeeContext";
import { useMemo, useState, useEffect } from "react";
import { SummaryCard } from "./AttendanceSummaryCards";
import { SummaryCardSkeleton } from "./SummaryCardSkeleton";
import { ShimmerRow } from "./ShimmerRow";

export const Today = () => {
  const { employees } = useEmployees();
  const { attendance, summary, loading, pageSize = 20 } = useAttendance();

  const today = new Date().toISOString().split("T")[0];

  // --- Local filter state ---
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);

  // Reset page when filters change
  useEffect(() => setPageNumber(1), [searchText, statusFilter]);

  // --- Merge employees with attendance for today ---
  const mergedAttendance = useMemo(() => {
    return employees.map((emp) => {
      const record = attendance.find(
        (r) =>
          String(r.employeeId) === String(emp.id) && r.date.startsWith(today)
      );

      return {
        id: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName} ${
          emp.otherNames ?? ""
        }`.trim(),
        department: record?.department ?? emp.department ?? "N/A", // <-- fallback to employee.department
        date: today,
        checkIn: record?.checkIn ?? "-",
        checkOut: record?.checkOut ?? "-",
        status: record?.status ?? "Absent",
      };
    });
  }, [employees, attendance, today]);

  // --- Filtering ---
  const filteredAttendance = useMemo(
    () =>
      mergedAttendance.filter((r) => {
        const matchesSearch = r.employeeName
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [mergedAttendance, searchText, statusFilter]
  );

  // --- Pagination ---
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredAttendance.length / pageSize)),
    [filteredAttendance, pageSize]
  );

  const paginatedAttendance = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredAttendance.slice(start, start + pageSize);
  }, [filteredAttendance, pageNumber, pageSize]);

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages) return;
    setPageNumber(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    const curr = pageNumber;
    const last = totalPages;

    pages.push(1);
    if (curr > 3) pages.push("...");

    const start = Math.max(2, curr - 1);
    const end = Math.min(last - 1, curr + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (curr < last - 2) pages.push("...");
    if (last > 1) pages.push(last);

    return pages;
  };

  // --- Status Badge Classes ---
  const statusClasses: Record<string, string> = {
    Present: "bg-indigo-100 text-indigo-700",
    Late: "bg-amber-100 text-amber-700",
    Absent: "bg-red-100 text-red-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
  };

  // --- Summary ---
  const todaySummary = summary ?? {
    totalEmployees: employees.length,
    presentToday: 0,
    lateArrivals: 0,
    absentToday: 0,
    onLeave: 0,
    attendancePercentage: 0,
  };

  return (
    <main>
      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))
        ) : (
          <>
            <SummaryCard
              title="Present Today"
              value={todaySummary.presentToday}
              desc={`Out of ${employees.length} employees`}
              icon={UserCheck}
              color="text-green-600"
            />
            <SummaryCard
              title="Late Arrivals"
              value={todaySummary.lateArrivals}
              desc="Arrived after 8:00 AM"
              icon={Clock}
              color="text-amber-600"
            />
            <SummaryCard
              title="Absent Today"
              value={todaySummary.absentToday}
              desc="Employees absent"
              icon={UserX}
              color="text-red-600"
            />
            <SummaryCard
              title="On Leave"
              value={todaySummary.onLeave}
              desc="Employees on leave"
              icon={Plane}
              color="text-indigo-600"
            />
            <SummaryCard
              title="Attendance %"
              value={`${todaySummary.attendancePercentage}%`}
              desc="Attendance % of employees"
              icon={Percent}
              color="text-primary"
            />
          </>
        )}
      </section>

      {/* Table Section */}
      <section className="border p-6 rounded-lg flex flex-col gap-8 bg-card">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <h1 className="text-lg font-medium">Today's Attendance Records</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 flex items-center gap-2 border rounded-md text-sm hover:bg-primary/90 hover:text-white transition">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition">
              <Upload className="w-4 h-4" /> Import Excel
            </button>
          </div>
        </div>

        <div className="flex w-full justify-between items-center gap-2 pt-6 border-t">
          <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search name"
              className="bg-transparent text-muted-foreground text-sm outline-none w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="pl-8 pr-4 w-24">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-auto w-full mt-4">
          {loading ? (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                  <th className="h-12 px-4">Employee Name</th>
                  <th className="h-12 px-4">Department</th>
                  <th className="h-12 px-4">Date</th>
                  <th className="h-12 px-4">Check In</th>
                  <th className="h-12 px-4">Check Out</th>
                  <th className="h-12 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <ShimmerRow key={i} />
                ))}
              </tbody>
            </table>
          ) : paginatedAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No records found.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                  <th className="h-12 px-4 font-medium text-muted-foreground">
                    Employee Name
                  </th>
                  <th className="h-12 px-4 font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="h-12 px-4 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 font-medium text-muted-foreground">
                    Check In
                  </th>
                  <th className="h-12 px-4 font-medium text-muted-foreground">
                    Check Out
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendance.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-4 font-semibold">{row.employeeName}</td>
                    <td className="p-4">{row.department}</td>
                    <td className="p-4">{row.date}</td>
                    <td className="p-4">{row.checkIn}</td>
                    <td className="p-4">{row.checkOut}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusClasses[row.status] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => goToPage(pageNumber - 1)}
              />
            </PaginationItem>
            {getVisiblePages().map((p, idx) =>
              typeof p === "number" ? (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={p === pageNumber}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={idx}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => goToPage(pageNumber + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </main>
  );
};

export default Today;
