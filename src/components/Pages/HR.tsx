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
import { ViewEmployee } from "./hr-management/EmployeeProfile";
import { EditEmployee } from "./hr-management/EditEmployee";
import type { Employee } from "../../types/Employee";

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
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Example Employee List
  const employees: Employee[] = [
    {
      id: "001",
      name: "John Mensah",
      image: "/images/john.jpg",
      joinDate: "2023-10-01",
      firstName: "John",
      lastName: "Mensah",
      email: "john.mensah@example.com",
      phone: "0244123456",
      department: "Engineering",
      position: "Software Engineer",
      employmentType: "Full-time",
      salary: 8500,
      status: "Leave",
      address: "Accra, Ghana",
    },
    {
      id: "002",
      name: "Sarah Adjei",
      image: "../../assets/sarah.jpg",
      joinDate: "2022-08-10",
      firstName: "Sarah",
      lastName: "Adjei",
      email: "sarah.adjei@example.com",
      phone: "0556789123",
      department: "HR",
      position: "HR Manager",
      employmentType: "Full-time",
      salary: 12000,
      status: "Active",
      address: "Kumasi, Ghana",
    },
  ];

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
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">HR Management</h1>
          <p className="text-[#65758b]">
            Manage employee records and information
          </p>
        </div>
        <AddEmployee />
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between lg:min-h-[640px] bg-card">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl">
              Employees List
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
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Salary
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="border-0">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                    <td className="p-4 font-semibold">{employee.name}</td>
                    <td className="p-4">{employee.id}</td>
                    <td className="p-4">{employee.department}</td>
                    <td className="p-4">
                      <p className="inline-block bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium">
                        {employee.employmentType}
                      </p>
                    </td>
                    <td className="p-4">
                      GH₵ {employee.salary.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <p
                        className={`inline-block py-1 px-4 rounded-full text-xs border font-medium ${
                          employee.status === "Active"
                            ? "bg-green-200 text-green-800 border-green-600"
                            : employee.status === "Leave"
                            ? "bg-blue-200 text-blue-800 border-blue-600"
                            : "bg-red-200 text-red-800 border-red-600"
                        }`}
                      >
                        {employee.status}
                      </p>
                    </td>

                    <td className="p-4 text-center">
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditEmployeeOpen(true);
                            }}
                          >
                            <SquarePen /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
