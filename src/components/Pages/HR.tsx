import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  EllipsisVertical,
  Eye,
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

import { AddEmployee } from "./modals/AddEmployee";
import { ViewEmployee } from "./modals/EmployeeProfile";
import { EditEmployee } from "./modals/EditEmployee";
import { DeleteEmployeeModal } from "./modals/DeleteEmployeeModal";
import { useCrudFunc } from "../hooks/crud";

import { useHR, type EmployeeRecord } from "../../context/HRContext";

export default function HR() {
  const {
    paginatedEmployees,
    loading,
    fetchError,
    summary,
    pageNumber,
    totalPages,
    searchText,
    statusFilter,
    roleFilter,
    setPageNumber,
    setSearchText,
    setStatusFilter,
    setRoleFilter,
    refreshEmployees,
    employees,
  } = useHR();

  const [viewEmployeeOpen, setViewEmployeeOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [, , , , deleteData] = useCrudFunc();
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeRecord | null>(null);

  const handleOpenDeleteModal = (employee: EmployeeRecord) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      // Delete employee from backend
      await deleteData(`Employee/${employeeToDelete.id}`);

      // Refresh employee list and summary cards
      await refreshEmployees();
      // refreshSummary is already called inside refreshEmployees, so optional here
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const statusClasses: Record<string, string> = {
    Active: "bg-green-200 text-green-800 border-green-600",
    Leave: "bg-blue-200 text-blue-800 border-blue-600",
    Inactive: "bg-red-200 text-red-800 border-red-600",
  };

  // Unique roles and statuses
  const roles = useMemo(
    () =>
      Array.from(
        new Set(
          employees.map((e) => e.jobPosition?.toLowerCase()).filter(Boolean)
        )
      ),
    [employees]
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          employees
            .map((e) => (e.status || "active").toLowerCase())
            .filter(Boolean)
        )
      ),
    [employees]
  );

  const getVisiblePages = () => {
    const pages = [];
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

  const visiblePages = useMemo(
    () => getVisiblePages(),
    [pageNumber, totalPages]
  );

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setPageNumber(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      {/* HEADER */}{" "}
      <section className="flex gap-4 justify-between items-center">
        {" "}
        <div className="flex flex-col gap-2">
          {" "}
          <h1 className="font-bold text-3xl">HR Management</h1>{" "}
          <p className="text-[#65758b]">
            Manage employee records and information
          </p>{" "}
        </div>{" "}
        <div className="flex gap-2 items-center">
          {" "}
          <button
            onClick={refreshEmployees}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />{" "}
          </button>{" "}
          <AddEmployee onEmployeeAdded={refreshEmployees} />{" "}
        </div>{" "}
      </section>
      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Employees",
            value: summary?.totalEmployee ?? 0,
            bg: "bg-gradient-to-r from-indigo-100 to-indigo-200",
            icon: Users,
            iconColor: "text-indigo-600",
          },
          {
            label: "Full-time",
            value: summary?.fullTime ?? 0,
            bg: "bg-gradient-to-r from-blue-100 to-blue-200",
            icon: Users,
            iconColor: "text-blue-600",
          },
          {
            label: "Part-time",
            value: summary?.partTime ?? 0,
            bg: "bg-gradient-to-r from-orange-100 to-orange-200",
            icon: Users,
            iconColor: "text-orange-500",
          },
          {
            label: "Nss",
            value: summary?.nss ?? 0,
            bg: "bg-gradient-to-r from-orange-100 to-orange-200",
            icon: Users,
            iconColor: "text-orange-500",
          },
          {
            label: "Interns",
            value: summary?.interns ?? 0,
            bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
            icon: Users,
            iconColor: "text-yellow-600",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-card border rounded-xl p-4 flex items-center justify-between hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">{card.label}</p>
                <h2 className="font-bold text-2xl sm:text-3xl">{card.value}</h2>
              </div>
              <div
                className={`p-3 rounded-full flex items-center justify-center ${card.bg} bg-opacity-50 hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={28} className={card.iconColor} />
              </div>
            </div>
          );
        })}
      </section>
      {/* EMPLOYEE TABLE */}
      <section className="border p-6 rounded-lg flex flex-col gap-8 justify-between sm:min-h-[630px] md:min-h-[630px] lg:min-h-[630px] bg-card">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl min-w-40">
              Employees List
            </h1>
            <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name or position"
                className="bg-muted/5 text-muted-foreground text-sm outline-none w-full overflow-ellipsis"
              />
            </div>
            <div className="flex justify-between gap-2">
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
              <p className="text-center py-6 text-muted-foreground">
                Loading employees...
              </p>
            ) : fetchError ? (
              <p className="text-center text-red-500 py-6">
                Error loading employees: {String(fetchError)}
              </p>
            ) : (
              <table className="w-full table-fixed text-sm text-left">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 w-[18%] font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 w-[8%] font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 w-[14%] font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 w-[10%] font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="h-12 px-4 w-[12%] font-medium text-muted-foreground">
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
                <tbody>
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
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
                        <td className="p-4 font-semibold">
                          {" "}
                          {employee.fullName}
                        </td>
                        <td className="p-4">{employee.id}</td>
                        <td className="p-4">{employee.jobPosition || "N/A"}</td>
                        <td className="p-4">
                          <span className="inline-block bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium truncate max-w-[120px] text-center">
                            {employee.employmentType}
                          </span>
                        </td>
                        <td className="p-4">
                          GH₵ {Number(employee.salary || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block py-1 px-4 rounded-full text-xs border font-medium truncate max-w-[120px] ${
                              statusClasses[employee.status] ||
                              statusClasses["Active"]
                            }`}
                          >
                            {employee.status || "Active"}
                          </span>
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
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleOpenDeleteModal(employee)}
                              >
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

        {/* PAGINATION */}
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={`cursor-pointer ${
                  pageNumber === 1 ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => goToPage(pageNumber - 1)}
              />
            </PaginationItem>
            {visiblePages.map((p, idx) => (
              <PaginationItem key={idx}>
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => goToPage(Number(p))}
                    isActive={pageNumber === p}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => goToPage(pageNumber + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
      {/* MODALS */}
      <ViewEmployee
        open={viewEmployeeOpen}
        onClose={() => setViewEmployeeOpen(false)}
      />
      {editEmployeeOpen && selectedEmployee && (
        <EditEmployee
          employee={{
            ...selectedEmployee,
            name: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
            image: "",
            joinDate: "",
            phone: "",
            employmentType: selectedEmployee.jobPosition,
            salary: 0,
            status:
              selectedEmployee.status?.toLowerCase() === "active"
                ? "Active"
                : selectedEmployee.status?.toLowerCase() === "inactive"
                ? "Inactive"
                : "Leave", // default to Leave
          }}
          onClose={() => setEditEmployeeOpen(false)}
        />
      )}
      <DeleteEmployeeModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        employeeId={Number(employeeToDelete?.id) || 0}
        employeeName={employeeToDelete?.fullName || ""}
      />
    </motion.main>
  );
}
