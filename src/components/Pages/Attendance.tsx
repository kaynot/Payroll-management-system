import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Download } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useAuth } from "../../context/AuthContext";

interface AttendanceRow {
  id: number;
  name: string;
  dept: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface SummaryData {
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  absent: number;
}

export default function Attendance() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchSummary = async () => {
    if (!token) return navigate("/", { replace: true });

    try {
      const res = await fetch("https://localhost:7003/api/Attendance/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return navigate("/", { replace: true });
      const data = await res.json();
      if (res.ok) setSummary(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    if (!token) return navigate("/", { replace: true });
    setLoading(true);
    try {
      const params = new URLSearchParams({
        PageNumber: pageNumber.toString(),
        PageSize: pageSize.toString(),
        StartDate: today,
        EndDate: today,
        SearchText: searchText,
        Department: departmentFilter,
        Status: statusFilter,
      });
      const res = await fetch(
        `https://localhost:7003/api/Attendance?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) return navigate("/", { replace: true });
      const data = await res.json();
      if (res.ok) {
        setAttendance(data.data);
        setTotalPages(data.totalPages || 1); // ensure API returns totalPages
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        await fetchSummary();
        await fetchAttendance();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user, token]);

  useEffect(() => {
    if (user && token) fetchAttendance();
  }, [searchText, departmentFilter, statusFilter, pageNumber]);

  const renderPaginationItems = () => {
    const items = [];
    const delta = 2; // how many pages around current
    const left = Math.max(1, pageNumber - delta);
    const right = Math.min(totalPages, pageNumber + delta);

    if (left > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={1 === pageNumber}
            onClick={(e) => {
              e.preventDefault();
              setPageNumber(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (left > 2) items.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = left; i <= right; i++) {
      if (i === 1 || i === totalPages) continue; // already handled
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === pageNumber}
            onClick={(e) => {
              e.preventDefault();
              setPageNumber(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (right < totalPages) {
      if (right < totalPages - 1)
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={totalPages === pageNumber}
            onClick={(e) => {
              e.preventDefault();
              setPageNumber(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (!user || !token)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Redirecting...
      </div>
    );

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col"
    >
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Track and manage employee attendance</p>
        </div>
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
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
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
            title: "Absent",
            value: summary?.absent ?? 0,
            desc: "Unexcused absences",
            color: "text-red-500",
          },
          {
            title: "On Leave",
            value: 0,
            desc: "Approved leave",
            color: "text-indigo-500",
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
        {/* Filters & Search */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl min-w-40">
            Today's Attendance
          </h1>

          <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex justify-between gap-2">
            <Select onValueChange={setDepartmentFilter}>
              <SelectTrigger className="pl-8 pr-4 w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="pl-8 pr-4 w-[200px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto w-full mt-4">
          {loading ? (
            <p className="text-gray-500 text-center py-10">
              Loading attendance...
            </p>
          ) : attendance.length === 0 ? (
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
                {attendance.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                    <td className="p-4 font-semibold">{row.name}</td>
                    <td className="p-4">{row.dept}</td>
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

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPageNumber((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPageNumber((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </motion.main>
  );
}
