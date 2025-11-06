import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Upload,
  Download,
  EllipsisVertical,
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export default function Attendance() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col "
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
            value: 85,
            desc: "Out of 100 employees",
            color: "text-green-600",
          },
          {
            title: "Late Arrivals",
            value: 8,
            desc: "After 9:00 AM",
            color: "text-amber-500",
          },
          {
            title: "Absent",
            value: 4,
            desc: "Unexcused absences",
            color: "text-red-500",
          },
          {
            title: "On Leave",
            value: 3,
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
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between lg:min-h-[630px] bg-card">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl">
              Today's Attendance
            </h1>
            <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[50%]">
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                name="search-emp"
                id="search-emp"
                placeholder="Search by name, ID, or department..."
                className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
              />
            </div>
            <Select>
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
            <Select>
              <SelectTrigger className="pl-8 pr-4 w-[200px]">
                <SelectValue placeholder="Present" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="flex flex-col overflow-auto gap-8">
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Employee Name
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Check In
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Check Out
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="border-0">
                {[
                  {
                    name: "Kwame Mensah",
                    dept: "IT",
                    date: "2025-01-15",
                    in: "08:00 AM",
                    out: "05:00 PM",
                    status: "Present",
                    color: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    name: "Ama Adjei",
                    dept: "HR",
                    date: "2025-01-15",
                    in: "08:15 AM",
                    out: "05:10 PM",
                    status: "Present",
                    color: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    name: "Kofi Asante",
                    dept: "Finance",
                    date: "2025-01-15",
                    in: "09:30 AM",
                    out: "05:00 PM",
                    status: "Late",
                    color: "bg-amber-100 text-amber-700",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                    <td className="p-4 font-semibold">{row.name}</td>
                    <td className="p-4">{row.dept}</td>
                    <td className="p-4">{row.date}</td>
                    <td className="p-4">{row.in}</td>
                    <td className="p-4">{row.out}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${row.color}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </motion.main>
  );
}
