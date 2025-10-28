import { useState } from "react";
import { motion } from "framer-motion";
import {
  EllipsisVertical,
  Eye,
  Search,
  SquarePen,
  Trash2,
  Users,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { AddEmployee } from "./hr-management/AddEmployee";
import { ViewEmployee } from "./hr-management/ViewEmployee";

const cardColors = [
  { bg: "bg-indigo-100", icon: "text-indigo-600", label: "Total Employees" },
  { bg: "bg-blue-100", icon: "text-blue-600", label: "Full-time" },
  { bg: "bg-orange-100", icon: "text-orange-500", label: "Part-time" },
  { bg: "bg-emerald-100", icon: "text-emerald-600", label: "NSS" },
  { bg: "bg-yellow-100", icon: "text-yellow-600", label: "Interns" },
  { bg: "bg-cyan-100", icon: "text-cyan-600", label: "Others" },
];

export default function HR() {
  const [viewEmployeeOpen, setViewEmployeeOpen] = useState(false);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      {/* HEADER */}
      <section className="flex gap-4 justify-between items-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-3xl">HR Management</h1>
          <p className="text-[#65758b]">
            Manage employee records and information
          </p>
        </div>
        <AddEmployee />
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        {cardColors.map((c, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center"
          >
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-[#65758b]">{c.label}</h1>
              <h1 className="font-bold text-3xl">41</h1>
            </div>
            <div
              className={`${c.bg} p-2 rounded-lg h-12 flex items-center justify-center`}
            >
              <Users size={36} className={c.icon} />
            </div>
          </div>
        ))}
      </section>

      {/* EMPLOYEE TABLE */}
      <section className="bg-card border p-6 rounded-lg flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl">
            Employees List
          </h1>
          <div className="bg-muted border py-1 px-4 rounded-full text-sm text-primary-foreground flex gap-4 items-center w-[50%]">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              className="bg-muted text-muted-foreground text-sm outline-none w-full"
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
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-3xl border">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Category</th>
                <th className="p-4">Salary</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-end">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-blue-50 border-b">
                <td className="p-4 font-semibold">John Mensah</td>
                <td className="p-4">001</td>
                <td className="p-4">Engineering</td>
                <td className="p-4 flex justify-start">
                  <p className="bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium">
                    NSS
                  </p>
                </td>
                <td className="p-4">GH₵ 8,500</td>
                <td className="p-4 flex justify-center">
                  <p className="bg-blue-200 py-1 px-4 rounded-full text-xs text-blue-800 border border-blue-600 font-medium">
                    On leave
                  </p>
                </td>

                <td className="p-4 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:bg-primary hover:rounded-md hover:text-primary-foreground transition p-1">
                        <EllipsisVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setViewEmployeeOpen(true)}
                      >
                        <Eye /> View Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SquarePen /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Modal here */}
                  {viewEmployeeOpen && (
                    <ViewEmployee onClose={() => setViewEmployeeOpen(false)} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
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
