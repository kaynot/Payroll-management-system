import { motion } from "framer-motion";
import { Search, Calendar, Upload, Download } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      </div>

      {/* Table Section */}
      <div className="bg-card border rounded-xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Today's Attendance
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employee..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex flex-col gap-4">
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{row.name}</td>
                  <td className="py-3 px-4">{row.dept}</td>
                  <td className="py-3 px-4">{row.date}</td>
                  <td className="py-3 px-4">{row.in}</td>
                  <td className="py-3 px-4">{row.out}</td>
                  <td className="py-3 px-4">
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
        </div>
      </div>
    </motion.main>
  );
}
