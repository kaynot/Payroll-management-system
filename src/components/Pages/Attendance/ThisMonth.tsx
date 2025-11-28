import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Download, Upload, Search } from "lucide-react";
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
import { useMemo } from "react";

export const ThisMonth = () => {
  const {
    attendance,
    summary,
    loading,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    pageNumber,
    setPageNumber,
    pageSize,
    totalPages,
  } = useAttendance();

  // --- Client-side: apply status filter (backend doesn't support status param)
  const filteredAttendance = useMemo(() => {
    return attendance.filter((r) => {
      // --- Status Filter ---
      const statusMatch = statusFilter === "all" || r.status === statusFilter;

      // --- Date Filter ---
      let dateMatch = true;
      const recordDate = new Date(r.date); // assuming r.date is ISO string or Date-compatible
      if (startDate) {
        const start = new Date(startDate);
        dateMatch = recordDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        dateMatch = dateMatch && recordDate <= end;
      }

      return statusMatch && dateMatch;
    });
  }, [attendance, statusFilter, startDate, endDate]);

  // --- Client-side: pagination slice
  const paginatedAttendance = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredAttendance.slice(start, start + pageSize);
  }, [filteredAttendance, pageNumber, pageSize]);

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setPageNumber(num);
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
        {[
          {
            title: "Total Working Days This Month",
            value: summary?.workingDays ?? 0,
            desc: `Working days counted so far this month`,
            color: "text-green-600",
          },
          {
            title: "Overall Present Count",
            value: summary?.overallPresent ?? 0,
            desc: `Total employee-present check-ins this month`,
            color: "text-green-600",
          },
          {
            title: "Overall Absent Count",
            value: summary?.overallAbsent ?? 0,
            desc: `Employees absent across all working days`,
            color: "text-green-600",
          },
          {
            title: "Overall Leave Count",
            value: summary?.overallLeave ?? 0,
            desc: "Employees on leave across all working days",
            color: "text-amber-500",
          },
          {
            title: "Average Attendance Percentage (Month)",
            value: summary?.averageAttendancePercentage ?? 0,
            desc: "Average attendance percentage for the month",
            color: "text-red-500",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-xl shadow-sm border p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <h3 className="text-gray-600 font-medium mb-1">{item.title}</h3>
            <p className={`text-3xl font-semibold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Table Section */}
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between sm:min-h-[630px] md:min-h-[630px] lg:min-h-[630px] bg-card">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col justify-between items-center gap-6">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl min-w-40">
                Attendance Records
              </h1>

              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <button className="px-4 py-2 flex items-center gap-2 border rounded-md text-sm hover:bg-primary/90 transition duration-300 hover:text-white">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition duration-300">
                  <Upload className="w-4 h-4" />
                  <span>Import Excel</span>
                </button>
              </div>
            </div>

            <div className="flex w-full justify-between items-center gap-2 pt-6 border-t">
              <div className="flex justify-between items-center gap-2">
                <div className="flex justify-center items-center gap-1">
                  <p className="text-xs">filter from:</p>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                      className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-1">
                  <p className="text-xs">to:</p>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setEndDate(e.target.value);
                      }}
                      className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
                <Search size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search name"
                  className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                {/* Single status select (no duplicates) */}
                <Select onValueChange={setStatusFilter}>
                  <SelectTrigger className="pl-8 pr-4 w-full">
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
          </div>

          {/* Table */}
          <div className="overflow-auto w-full mt-4 justify-start">
            {loading ? (
              <p className="text-gray-500 text-center py-10">
                Loading attendance...
              </p>
            ) : attendance.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No records found.
              </p>
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
                  {paginatedAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedAttendance.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b transition-colors hover:bg-muted/40"
                      >
                        <td className="p-4 font-semibold">
                          {row.employeeName}
                        </td>
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
                    ))
                  )}
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
