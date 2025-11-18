import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EllipsisVertical,
  Eye,
  Search,
  SquarePen,
  Trash2,
  Users,
  RefreshCw,
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

import { uppercaseTitle } from "../../utils/format";

import { AddEmployee } from "./hr-management/AddEmployee";
import { ViewEmployee } from "./hr-management/EmployeeProfile";
import { EditEmployee } from "./hr-management/EditEmployee";
import type { Employee } from "../../types/Employee";

import { useEmployees } from "../../context/EmployeeContext";
import useFetch from "../hooks/useFetch";

const cardColors = [
  { bg: "bg-indigo-100", icon: "text-indigo-600", label: "Total Employees" },
  { bg: "bg-blue-100", icon: "text-blue-600", label: "Full-time" },
  { bg: "bg-orange-100", icon: "text-orange-500", label: "Part-time" },
  { bg: "bg-emerald-100", icon: "text-emerald-600", label: "NSS" },
  { bg: "bg-yellow-100", icon: "text-yellow-600", label: "Interns" },
];

export default function HR() {
  const [viewEmployeeOpen, setViewEmployeeOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20; // rows per page

  const { employees, loading, fetchError, refreshEmployees } = useEmployees();
  const [summary, summaryError, summaryLoading, refreshSummary] = useFetch(
    "/Employee/Employees/summary"
  );
  // useEffect(() => {
  //   console.log("Summary fetched:", summary);
  // }, [summary]);

  // Reset page on filters/search
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Get unique roles and statuses dynamically
  const roles = useMemo(
    () =>
      Array.from(
        new Set(
          employees.map((emp) => emp.jobPosition?.toLowerCase()).filter(Boolean)
        )
      ),
    [employees]
  );
  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          employees
            .map((emp) => (emp.status || "Active")?.toLowerCase())
            .filter(Boolean)
        )
      ),
    [employees]
  );

  // Apply search and filters
  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const roleFilt = roleFilter.toLowerCase();
    const statusFilt = statusFilter.toLowerCase();

    return employees.filter((emp) => {
      const firstName = emp.firstName?.toLowerCase() || "";
      const otherNames = emp.otherNames?.toLowerCase() || "";
      const lastName = emp.lastName?.toLowerCase() || "";
      const id = emp.id?.toString().toLowerCase() || "";
      const position = (emp.jobPosition || "").toLowerCase();
      const status = (emp.status || "Active").toLowerCase();

      const matchesSearch =
        firstName.includes(search) ||
        otherNames.includes(search) ||
        lastName.includes(search) ||
        id.includes(search) ||
        position.includes(search);

      const matchesRole = roleFilt === "all" || position === roleFilt;
      const matchesStatus = statusFilt === "all" || status === statusFilt;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchTerm, roleFilter, statusFilter]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    const slice = filteredEmployees.slice(start, start + pageSize);
    console.log("Paginated employees:", slice);
    return slice;
  }, [filteredEmployees, pageNumber]);

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setPageNumber(num);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top for UX
  };

  // --- Smart visible pages ---
  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(1);

    // Left-side ellipsis (if needed)
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

  // --- Reset page on filter/search ---
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, roleFilter, statusFilter]);

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

        <div className="flex gap-2 items-center">
          {/* Refresh Button */}
          <button
            onClick={() => {
              refreshEmployees();
              refreshSummary();
            }}
            disabled={loading} // disable while loading
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="animate-spin text-gray-800 h-5 w-5" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </button>

          <AddEmployee
            onEmployeeAdded={() => {
              refreshEmployees();
              refreshSummary();
            }}
          />
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-[#65758b]">Total Employees</h1>
            <h1 className="font-bold text-3xl">
              {summaryLoading ? "…" : summary?.totalEmployee ?? 0}
            </h1>
          </div>
          <div className="bg-indigo-100 p-2 rounded-lg h-12 flex items-center justify-center">
            <Users size={36} className="text-indigo-600" />
          </div>
        </div>

        <div className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-[#65758b]">Full-time</h1>
            <h1 className="font-bold text-3xl">
              {summaryLoading ? "…" : summary?.fullTime ?? 0}
            </h1>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg h-12 flex items-center justify-center">
            <Users size={36} className="text-blue-600" />
          </div>
        </div>

        <div className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-[#65758b]">Part-time</h1>
            <h1 className="font-bold text-3xl">
              {summaryLoading ? "…" : summary?.partTime ?? 0}
            </h1>
          </div>
          <div className="bg-orange-100 p-2 rounded-lg h-12 flex items-center justify-center">
            <Users size={36} className="text-orange-500" />
          </div>
        </div>

        <div className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-[#65758b]">NSS</h1>
            <h1 className="font-bold text-3xl">
              {summaryLoading ? "…" : summary?.nssPersonnel ?? 0}
            </h1>
          </div>
          <div className="bg-emerald-100 p-2 rounded-lg h-12 flex items-center justify-center">
            <Users size={36} className="text-emerald-600" />
          </div>
        </div>

        <div className="border rounded-lg p-4 flex gap-2 hover:shadow-lg bg-card items-center">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-[#65758b]">Interns</h1>
            <h1 className="font-bold text-3xl">
              {summaryLoading ? "…" : summary?.interns ?? 0}
            </h1>
          </div>
          <div className="bg-yellow-100 p-2 rounded-lg h-12 flex items-center justify-center">
            <Users size={36} className="text-yellow-600" />
          </div>
        </div>
      </section>

      {/* EMPLOYEE TABLE */}
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between sm:min-h-[630px] md:min-h-[630px] lg:min-h-[630px] bg-card">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl min-w-40">
              Employees List
            </h1>
            <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or position"
                className="bg-muted/5 text-muted-foreground text-sm outline-none w-full overflow-ellipsis"
              />
            </div>
            <div className="flex justify-between gap-2">
              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="pl-8 pr-4 w-[200px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-8 pr-4 w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-auto w-full">
            {loading ? (
              <p className="text-center py-6">Loading employees...</p>
            ) : fetchError ? (
              <p className="text-center text-red-500 py-6">
                Error loading employees:{" "}
                {fetchError instanceof Error
                  ? fetchError.message
                  : String(fetchError)}
              </p>
            ) : (
              <table className="w-full table-fixed text-sm text-left">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 w-[18%] text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 w-[8%] text-left font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 w-[14%] text-left font-medium text-muted-foreground">
                      Role
                    </th>
                    {/* <th className="h-12 px-4 w-[14%] text-left font-medium text-muted-foreground">
                      Department
                    </th> */}
                    <th className="h-12 px-4 w-[10%] text-left font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="h-12 px-4 w-[12%] text-left font-medium text-muted-foreground">
                      Salary
                    </th>
                    <th className="h-12 px-4 w-[12%] text-center font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 w-[12%] text-center font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="border-0">
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b transition-colors hover:bg-muted/40"
                      >
                        {/* NAME */}
                        <td className="p-4 font-semibold">
                          {uppercaseTitle(employee.title)} {employee.firstName}{" "}
                          {employee.otherNames} {employee.lastName}
                        </td>

                        {/* ID */}
                        <td className="p-4 truncate max-w-[80px]">
                          {employee.id}
                        </td>

                        {/* ROLE */}
                        <td className="p-4">
                          <div className="truncate max-w-[150px]">
                            {employee.jobPosition || "N/A"}
                          </div>
                        </td>

                        {/* DEPARTMENT */}
                        {/* <td className="p-4">
                          <div className="truncate max-w-[150px]">
                            {employee.department || "N/A"}
                          </div>
                        </td> */}

                        {/* CATEGORY */}
                        <td className="p-4">
                          <p className="inline-block bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium truncate max-w-[120px]">
                            {employee.employmentType}
                          </p>
                        </td>

                        {/* SALARY */}
                        <td className="p-4">
                          <div className="truncate max-w-[120px]">
                            GH₵ {Number(employee.salary).toLocaleString()}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="p-4 text-center">
                          <p
                            className={`inline-block py-1 px-4 rounded-full text-xs border font-medium truncate max-w-[120px] ${
                              employee.status === "Active"
                                ? "bg-green-200 text-green-800 border-green-600"
                                : employee.status === "Leave"
                                ? "bg-blue-200 text-blue-800 border-blue-600"
                                : "bg-red-200 text-red-800 border-red-600"
                            }`}
                          >
                            {employee.status || "Active"}
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="hover:bg-primary hover:rounded-md hover:text-primary-foreground transition p-1">
                                <EllipsisVertical />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setViewEmployeeOpen(true);
                                }}
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

      {/* Modals */}
      <ViewEmployee
        open={viewEmployeeOpen}
        onClose={() => setViewEmployeeOpen(false)}
      />
      {editEmployeeOpen && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={() => setEditEmployeeOpen(false)}
        />
      )}
    </motion.main>
  );
}
