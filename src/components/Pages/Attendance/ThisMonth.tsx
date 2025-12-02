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
  Plane,
  CalendarDays,
  Percent,
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
import { useEffect, useMemo, useState } from "react";

import { SummaryCard } from "./AttendanceSummaryCards";
import { SummaryCardSkeleton } from "./SummaryCardSkeleton";
import { ShimmerRow } from "./ShimmerRow";

// --- Month range ---
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

export const ThisMonth = () => {
  const { attendance, summary, loading, pageSize } = useAttendance();

  // --- Local state ---
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(
    firstDay.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(lastDay.toISOString().split("T")[0]);
  const [pageNumber, setPageNumber] = useState(1);

  // Reset page when filters change
  useEffect(
    () => setPageNumber(1),
    [searchText, statusFilter, startDate, endDate]
  );

  // --- Client-side filtering ---
  const filteredAttendance = useMemo(() => {
    return attendance.filter((r) => {
      const recordDate = new Date(r.date);

      // Only this month
      if (recordDate < firstDay || recordDate > lastDay) return false;

      const statusMatch =
        statusFilter === "all" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();
      const searchMatch = r.employeeName
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      let dateMatch = true;
      if (startDate) dateMatch = recordDate >= new Date(startDate);
      if (endDate) dateMatch = dateMatch && recordDate <= new Date(endDate);

      return statusMatch && searchMatch && dateMatch;
    });
  }, [attendance, statusFilter, searchText, startDate, endDate]);

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
              title="Working Days"
              value={summary?.workingDays ?? 0}
              desc="Total working days in the month"
              icon={CalendarDays}
            />
            <SummaryCard
              title="Overall Present"
              value={summary?.overallPresent ?? 0}
              desc="Presence count this month"
              icon={UserCheck}
              color="text-green-600"
            />
            <SummaryCard
              title="Overall Absent"
              value={summary?.overallAbsent ?? 0}
              desc="Absences this month"
              icon={UserX}
              color="text-red-600"
            />
            <SummaryCard
              title="On Leave"
              value={summary?.overallLeave ?? 0}
              desc="Leave events recorded"
              icon={Plane}
              color="text-amber-600"
            />
            <SummaryCard
              title="Average Attendance"
              value={`${summary?.averageAttendancePercentage ?? 0}%`}
              desc="Monthly attendance rate"
              icon={Percent}
              color="text-indigo-600"
            />
          </>
        )}
      </section>

      {/* Table Section */}
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between bg-card sm:min-h-[630px] md:min-h-[630px] lg:min-h-[630px]">
        <div className="flex flex-col gap-8">
          {/* Header & Actions */}
          <div className="flex flex-col justify-between items-center gap-6">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl min-w-40">
                Attendance Records This Month
              </h1>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <button className="px-4 py-2 flex items-center gap-2 border rounded-md text-sm hover:bg-primary/90 hover:text-white transition">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition">
                  <Upload className="w-4 h-4" />
                  <span>Import Excel</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex w-full justify-between items-center gap-2 pt-6 border-t">
              {/* Date */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-xs">from:</p>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground outline-primary"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-xs">to:</p>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground outline-primary"
                  />
                </div>
              </div>

              {/* Search */}
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

              {/* Status */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-8 pr-4 w-24">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto w-full mt-4">
            {loading ? (
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-gray-500 font-medium">
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
              <p className="text-gray-500 text-center py-10">
                No records found.
              </p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="border-b">
                  <tr className="border-b border-gray-200 text-gray-500 font-medium">
                    <th className="h-12 px-4">Employee Name</th>
                    <th className="h-12 px-4">Department</th>
                    <th className="h-12 px-4">Date</th>
                    <th className="h-12 px-4">Check In</th>
                    <th className="h-12 px-4">Check Out</th>
                    <th className="h-12 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAttendance.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/40"
                    >
                      <td className="p-4 font-semibold">{row.employeeName}</td>
                      <td className="p-4">{row.department}</td>
                      <td className="p-4">{row.date}</td>
                      <td className="p-4">{row.checkIn}</td>
                      <td className="p-4">{row.checkOut}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            row.status === "Late"
                              ? "bg-amber-100 text-amber-700"
                              : row.status === "Absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-indigo-100 text-indigo-700"
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

export default ThisMonth;
