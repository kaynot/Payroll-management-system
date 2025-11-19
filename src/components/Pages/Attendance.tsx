import { motion } from "framer-motion";
import { Search, Upload, Download, RefreshCw } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useMemo, useState } from "react";

export default function Attendance() {
  const {
    attendance,
    summary,
    loading,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
  } = useAttendance();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredAttendance = attendance.filter((row) => {
    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

    const matchesSearch = row.employeeName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const withinDateRange =
      (!startDate || new Date(row.date) >= new Date(startDate)) &&
      (!endDate || new Date(row.date) <= new Date(endDate));

    return matchesStatus && matchesSearch && withinDateRange;
  });

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20; // rows per page

  // --- Pagination ---
  const totalPages = Math.ceil(filteredAttendance.length / pageSize);
  const paginatedAttendance = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    const slice = filteredAttendance.slice(start, start + pageSize);
    return slice;
  }, [filteredAttendance, pageNumber]);

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setPageNumber(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(1);

    // Left-side ellipsis
    if (pageNumber > 3) {
      pages.push("...");
    }

    // Pages around the current page: (pageNumber - 1, pageNumber, pageNumber + 1)
    const start = Math.max(2, pageNumber - 1);
    const end = Math.min(totalPages - 1, pageNumber + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right-side ellipsis (if needed)
    if (pageNumber < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page (if > 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Track and manage employee attendance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          <RefreshCw />
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Total Employees",
            value: summary?.totalEmployees ?? 0,
            desc: `Out of ${summary?.totalEmployees ?? 0} employees`,
            color: "text-green-600",
          },
          {
            title: "Present Today",
            value: summary?.presentToday ?? 0,
            desc: `Out of ${summary?.totalEmployees ?? 0} employees`,
            color: "text-green-600",
          },
          {
            title: "Late Arrivals",
            value: summary?.lateArrivals ?? 0,
            desc: "After 9:00 AM",
            color: "text-amber-500",
          },
          {
            title: "Total Absences",
            value: summary?.absent ?? 0,
            desc: "Employees absent",
            color: "text-red-500",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-xl shadow-sm border p-4 hover:shadow-md transition"
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
                Today's Attendance
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
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    ></svg>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <p className="text-xs">to:</p>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-md border bg-white px-3 py-2 h-8 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    ></svg>
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
                <Select>
                  <SelectTrigger className="pl-8 pr-4 w-[50%]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All today</SelectItem>
                    <SelectItem value="Present">Present today</SelectItem>
                    <SelectItem value="Late">Late today</SelectItem>
                    <SelectItem value="Absent">Absent today</SelectItem>
                  </SelectContent>
                </Select>
                {/* Status */}
                <Select onValueChange={setStatusFilter}>
                  <SelectTrigger className="pl-8 pr-4 w-[50%]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All records</SelectItem>
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
    </motion.main>
  );
}
