import React, { useEffect, useState, useMemo } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import { useAttendance, type ManualAttendanceRecord } from "../../context/AttendanceContext";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { CheckCircle, Clock, AlertCircle, Loader2, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

interface ManualRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  checkInStatus?: "pending" | "success" | "error";
  checkOutStatus?: "pending" | "success" | "error";
  disabled?: boolean;
}

export default function ManualAttendance() {
  const { employees, loading: employeesLoading } = useEmployees();
  const { submitManualAttendance } = useAttendance();

  const [manualRecords, setManualRecords] = useState<ManualRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  // Initialize Records
  useEffect(() => {
    if (!employeesLoading && employees.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      setManualRecords(
        employees.map((emp) => ({
          employeeId: emp.id.toString(),
          employeeName: emp.fullName ?? `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim(),
          department: emp.department ?? "N/A",
          date: today,
          checkIn: "",
          checkOut: "",
          checkInStatus: "pending",
          checkOutStatus: "pending",
          disabled: false,
        }))
      );
    }
  }, [employees, employeesLoading]);

  // Validation
  const validateRecord = (rec: ManualRecord) => {
    if (!rec.date) return "Date is required.";
    if (new Date(rec.date) > new Date()) return "Date cannot be in the future.";
    if (rec.checkIn && rec.checkOut && rec.checkIn > rec.checkOut)
      return "Check-In cannot be later than Check-Out.";
    return null;
  };

  const getRowInvalid = (rec: ManualRecord) => validateRecord(rec) !== null;

  // Handlers
  const handleChange = (index: number, field: "checkIn" | "checkOut" | "date", value: string) => {
    setManualRecords((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (field === "checkIn") updated[index].checkInStatus = "pending";
      if (field === "checkOut") updated[index].checkOutStatus = "pending";

      return updated;
    });
  };

  const autofillAll = () => {
    setManualRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        checkIn: "08:00",
        checkOut: "17:00",
        checkInStatus: "pending",
        checkOutStatus: "pending",
      }))
    );
    toast.success("Auto-filled for all employees.");
  };

  const handleSingleCheck = async (rec: ManualRecord, type: "checkIn" | "checkOut") => {
    const validation = validateRecord(rec);
    if (validation) return toast.error(validation);

    setManualRecords((prev) =>
      prev.map((r) => (r.employeeId === rec.employeeId ? { ...r, disabled: true } : r))
    );

    try {
      const payload: ManualAttendanceRecord = {
        employeeId: rec.employeeId,
        date: rec.date,
        checkIn: type === "checkIn" ? rec.checkIn : undefined,
        checkOut: type === "checkOut" ? rec.checkOut : undefined,
      };
      await submitManualAttendance([payload]);
      toast.success(`${rec.employeeName} ${type} recorded!`);

      setManualRecords((prev) =>
        prev.map((r) =>
          r.employeeId === rec.employeeId
            ? {
                ...r,
                ...(type === "checkIn" ? { checkInStatus: "success" } : { checkOutStatus: "success" }),
                disabled: false,
              }
            : r
        )
      );
    } catch {
      setManualRecords((prev) =>
        prev.map((r) =>
          r.employeeId === rec.employeeId
            ? {
                ...r,
                ...(type === "checkIn" ? { checkInStatus: "error" } : { checkOutStatus: "error" }),
                disabled: false,
              }
            : r
        )
      );
      toast.error(`Failed for ${rec.employeeName}`);
    }
  };

  const handleBulkCheck = async (type: "checkIn" | "checkOut") => {
    const invalidRows = manualRecords.filter((rec) => getRowInvalid(rec));
    if (invalidRows.length > 0) return toast.error(`Fix invalid rows before submitting.`);

    const filled = manualRecords.filter((r) => r[type]);
    if (filled.length === 0) return toast.error(`No ${type} values filled.`);

    setLoading(true);
    try {
      const payload = manualRecords.map((rec) => ({
        employeeId: rec.employeeId,
        date: rec.date,
        checkIn: type === "checkIn" ? rec.checkIn : undefined,
        checkOut: type === "checkOut" ? rec.checkOut : undefined,
      }));
      await submitManualAttendance(payload);
      toast.success(`Bulk ${type} submitted.`);

      setManualRecords((prev) =>
        prev.map((r) =>
          r[type] ? { ...r, ...(type === "checkIn" ? { checkInStatus: "success" } : { checkOutStatus: "success" }) } : r
        )
      );
    } catch {
      toast.error(`Bulk submission failed.`);
      setManualRecords((prev) =>
        prev.map((r) =>
          r[type] ? { ...r, ...(type === "checkIn" ? { checkInStatus: "error" } : { checkOutStatus: "error" }) } : r
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtered + Paginated Records
  const filteredRecords = useMemo(() => {
    return manualRecords.filter((r) => {
      const matchesSearch = r.employeeName.toLowerCase().includes(searchText.toLowerCase());
      const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
      const matchesStart = !startDate || r.date >= startDate;
      const matchesEnd = !endDate || r.date <= endDate;
      return matchesSearch && matchesDept && matchesStart && matchesEnd;
    });
  }, [manualRecords, searchText, departmentFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, pageNumber]);

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setPageNumber(num);
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

  // Render
  if (employeesLoading) return <p>Loading employees...</p>;

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col gap-6">
      {/* Header + Auto-fill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manual Attendance</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button onClick={autofillAll} className="bg-primary hover:bg-primary/90 text-white">
            Auto-fill Timesheet
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Filled Check-Ins:{" "}
          <span className="font-semibold">{manualRecords.filter((r) => r.checkIn).length}</span> | Filled
          Check-Outs: <span className="font-semibold">{manualRecords.filter((r) => r.checkOut).length}</span>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[100%]">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
            />
          </div>
          <Select onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Array.from(new Set(employees.map((e) => e.department))).map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[60vh] overflow-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow">
            <tr className="text-left text-gray-600 font-medium">
              <th className="p-3">Employee</th>
              <th className="p-3">Dept</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check-In</th>
              <th className="p-3">Check-Out</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((rec, idx) => {
              const invalid = getRowInvalid(rec);
              return (
                <tr
                  key={rec.employeeId}
                  className={`border-b ${invalid ? "bg-red-50" : "hover:bg-gray-50 transition"}`}
                >
                  {/* Employee Info */}
                  <td className="p-2">{rec.employeeName}</td>
                  <td className="p-2">{rec.department}</td>

                  {/* Date */}
                  <td className="p-2">
                    <input
                      type="date"
                      disabled={rec.disabled}
                      value={rec.date}
                      onChange={(e) => handleChange(idx, "date", e.target.value)}
                      className={`w-full border rounded px-2 py-1 ${
                        invalid && !rec.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </td>

                  {/* Check-In */}
                  <td className="p-2">
                    <input
                      type="time"
                      disabled={rec.disabled}
                      value={rec.checkIn}
                      onChange={(e) => handleChange(idx, "checkIn", e.target.value)}
                      className={`w-full border rounded px-2 py-1 ${
                        invalid && rec.checkIn && rec.checkOut && rec.checkIn > rec.checkOut
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </td>

                  {/* Check-Out */}
                  <td className="p-2">
                    <input
                      type="time"
                      disabled={rec.disabled}
                      value={rec.checkOut}
                      onChange={(e) => handleChange(idx, "checkOut", e.target.value)}
                      className={`w-full border rounded px-2 py-1 ${
                        invalid && rec.checkIn && rec.checkOut && rec.checkOut < rec.checkIn
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </td>

                  {/* Status (stacked vertically) */}
                  <td className="p-2 text-center">
                    <div className="flex gap-1 items-center justify-center">
                      {rec.checkInStatus === "success" && <CheckCircle className="text-green-600" size={16} />}
                      {rec.checkInStatus === "error" && <AlertCircle className="text-red-600" size={16} />}
                      {rec.checkInStatus === "pending" && <Clock className="text-gray-400" size={16} />}
                      
                      {rec.checkOutStatus === "success" && <CheckCircle className="text-blue-600" size={16} />}
                      {rec.checkOutStatus === "error" && <AlertCircle className="text-red-600" size={16} />}
                      {rec.checkOutStatus === "pending" && <Clock className="text-gray-400" size={16} />}
                    </div>
                  </td>

                  {/* Actions (buttons stay horizontal) */}
                  <td className="p-2 flex gap-2 justify-center">
                    <Button
                      size="sm"
                      disabled={loading || rec.disabled || !rec.checkIn}
                      onClick={() => handleSingleCheck(rec, "checkIn")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {rec.disabled ? <Loader2 className="animate-spin" size={16} /> : "In"}
                    </Button>
                    <Button
                      size="sm"
                      disabled={loading || rec.disabled || !rec.checkOut}
                      onClick={() => handleSingleCheck(rec, "checkOut")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {rec.disabled ? <Loader2 className="animate-spin" size={16} /> : "Out"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => goToPage(pageNumber - 1)} />
            </PaginationItem>
            {getVisiblePages().map((p, idx) =>
              typeof p === "number" ? (
                <PaginationItem key={idx}>
                  <PaginationLink href="#" isActive={p === pageNumber} onClick={() => goToPage(p)}>
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
              <PaginationNext href="#" onClick={() => goToPage(pageNumber + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Bulk Actions */}
        <div className="flex gap-4 mt-4">
          <Button onClick={() => handleBulkCheck("checkIn")} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
            {loading && <Loader2 className="animate-spin mr-2" />}
            Bulk Check-In
          </Button>
          <Button onClick={() => handleBulkCheck("checkOut")} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading && <Loader2 className="animate-spin mr-2" />}
            Bulk Check-Out
          </Button>
        </div>
      </div>
    </div>
  );
}
