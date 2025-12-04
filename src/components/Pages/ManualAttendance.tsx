import React, { useEffect, useState, useMemo } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import {
  useAttendance,
  type ManualAttendanceRecord,
} from "../../context/AttendanceContext";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

interface ManualRecord {
  employeeId: string;
  employeeName: string;
  jobPosition: string;
  date: string;
  checkIn: string;
  checkOut: string;
  checkInStatus?: "pending" | "success" | "error";
  checkOutStatus?: "pending" | "success" | "error";
  disabled?: boolean;
  errorMessage?: string;
}

interface AttendanceCache {
  [employeeId: string]: {
    date?: string;
    checkIn?: string;
    checkOut?: string;
    checkInStatus?: "pending" | "success" | "error";
    checkOutStatus?: "pending" | "success" | "error";
  };
}

const LOCAL_STORAGE_KEY = "manualAttendanceCache";

export default function ManualAttendance() {
  const { employees, loading: employeesLoading } = useEmployees();
  const { submitManualAttendance } = useAttendance();

  const [manualRecords, setManualRecords] = useState<ManualRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [jobPositionFilter, setJobPositionFilter] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  // Load cached values
  const getCache = (): AttendanceCache =>
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
  const setCache = (cache: AttendanceCache) =>
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));

  // Initialize Records
  useEffect(() => {
    if (!employeesLoading && employees.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const cache = getCache();

      setManualRecords(
        employees.map((emp) => {
          const cached = cache[emp.id] || {};
          return {
            employeeId: emp.id.toString(),
            employeeName:
              emp.fullName ??
              `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim(),
            jobPosition: emp.jobPosition ?? "N/A", // <-- use jobPosition
            date: cached.date || today,
            checkIn: cached.checkIn || "",
            checkOut: cached.checkOut || "",
            checkInStatus: cached.checkInStatus || "pending",
            checkOutStatus: cached.checkOutStatus || "pending",
            disabled: false,
          };
        })
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
  const handleChange = (
    employeeId: string,
    field: "checkIn" | "checkOut" | "date",
    value: string
  ) => {
    setManualRecords((prev) =>
      prev.map((rec) => {
        if (rec.employeeId !== employeeId) return rec;

        const updatedRec = { ...rec, [field]: value };

        if (field === "checkIn") updatedRec.checkInStatus = "pending";
        if (field === "checkOut") updatedRec.checkOutStatus = "pending";

        const cache = getCache();
        cache[employeeId] = {
          ...cache[employeeId],
          [field]: value,
          checkInStatus: updatedRec.checkInStatus,
          checkOutStatus: updatedRec.checkOutStatus,
        };
        setCache(cache);

        return updatedRec;
      })
    );
  };

  const autofillAll = () => {
    setManualRecords((prev) =>
      prev.map((rec) => {
        const updated = {
          ...rec,
          checkIn: "08:00",
          checkOut: "17:00",
          checkInStatus: "pending" as "pending",
          checkOutStatus: "pending" as "pending",
        };
        const cache = getCache();
        cache[rec.employeeId] = {
          ...cache[rec.employeeId],
          checkIn: "08:00",
          checkOut: "17:00",
        };
        setCache(cache);
        return updated;
      })
    );
    toast.success("Auto-filled for all employees.");
  };

  const handleSubmitRecord = async (rec: ManualRecord) => {
    const validation = validateRecord(rec);
    if (validation) return toast.error(validation);

    setManualRecords((prev) =>
      prev.map((r) =>
        r.employeeId === rec.employeeId ? { ...r, disabled: true } : r
      )
    );

    try {
      const res = await submitManualAttendance([rec], true);
      const errorMsg = (res.data.errors || []).find((err: string) =>
        err.includes(`Employee ${rec.employeeId}`)
      );

      setManualRecords((prev) =>
        prev.map((r) => {
          if (r.employeeId !== rec.employeeId) return r;
          const updated = {
            ...r,
            checkInStatus: errorMsg
              ? r.checkIn
                ? "error"
                : r.checkInStatus
              : r.checkIn
              ? "success"
              : r.checkInStatus,
            checkOutStatus: errorMsg
              ? r.checkOut
                ? "error"
                : r.checkOutStatus
              : r.checkOut
              ? "success"
              : r.checkOutStatus,
            disabled: false,
            errorMessage: errorMsg || undefined,
          };

          // Clear cache if successful
          if (!errorMsg) {
            const cache = getCache();
            delete cache[rec.employeeId];
            setCache(cache);
          }

          return updated;
        })
      );

      if (errorMsg) {
        const msg = errorMsg.toLowerCase();
        if (msg.includes("already checked in"))
          toast(`✅ ${rec.employeeName} has already checked in.`);
        else if (msg.includes("already checked out"))
          toast(`✅ ${rec.employeeName} has already checked out.`);
        else toast.error(`Failed to mark attendance for ${rec.employeeName}`);
      } else toast.success(`${rec.employeeName}'s attendance recorded!`);
    } catch {
      setManualRecords((prev) =>
        prev.map((r) =>
          r.employeeId === rec.employeeId
            ? {
                ...r,
                checkInStatus: r.checkIn ? "error" : r.checkInStatus,
                checkOutStatus: r.checkOut ? "error" : r.checkOutStatus,
                disabled: false,
                errorMessage:
                  "Submission failed due to network or server error.",
              }
            : r
        )
      );
      toast.error(`Failed to mark attendance for ${rec.employeeName}`);
    }
  };

  const handleBulkMark = async () => {
    const invalidRows = manualRecords.filter((rec) => getRowInvalid(rec));
    if (invalidRows.length > 0)
      return toast.error("Fix invalid rows before submitting.");

    const filledRecords = manualRecords.filter((r) => r.checkIn || r.checkOut);
    if (filledRecords.length === 0)
      return toast.error("No check-in or check-out times filled.");

    setLoading(true);

    // Mark all as disabled and pending
    setManualRecords((prev) =>
      prev.map((r) =>
        filledRecords.find((f) => f.employeeId === r.employeeId)
          ? {
              ...r,
              disabled: true,
              checkInStatus: r.checkIn ? "pending" : r.checkInStatus,
              checkOutStatus: r.checkOut ? "pending" : r.checkOutStatus,
            }
          : r
      )
    );

    try {
      const res = await submitManualAttendance(filledRecords, true);

      const failedIdsWithMessages = (res.data.errors || [])
        .map((err: string) => {
          const match = err.match(/Employee (\d+).*/);
          return match ? { id: match[1], message: err } : null;
        })
        .filter(Boolean) as { id: string; message: string }[];

      const cache = getCache();

      setManualRecords((prev) =>
        prev.map((r) => {
          const failed = failedIdsWithMessages.find(
            (f) => f.id === r.employeeId
          );

          if (failed) {
            // Error case
            cache[r.employeeId] = {
              ...cache[r.employeeId],
              checkIn: r.checkIn,
              checkOut: r.checkOut,
              checkInStatus: r.checkIn ? "error" : r.checkInStatus,
              checkOutStatus: r.checkOut ? "error" : r.checkOutStatus,
            };
            return {
              ...r,
              checkInStatus: r.checkIn ? "error" : r.checkInStatus,
              checkOutStatus: r.checkOut ? "error" : r.checkOutStatus,
              disabled: false,
              errorMessage: failed.message,
            };
          } else if (r.checkIn || r.checkOut) {
            // Success case – remove cache
            delete cache[r.employeeId];
            return {
              ...r,
              checkInStatus: r.checkIn ? "success" : r.checkInStatus,
              checkOutStatus: r.checkOut ? "success" : r.checkOutStatus,
              disabled: false,
              errorMessage: undefined,
            };
          }
          return r;
        })
      );

      setCache(cache);

      if (failedIdsWithMessages.length > 0) {
        toast.error(
          `${failedIdsWithMessages.length} record(s) failed. Others marked successfully.`
        );
      } else {
        toast.success("Bulk attendance submitted successfully!");
      }
    } catch {
      toast.error("Bulk submission failed due to network/server error.");
      setManualRecords((prev) =>
        prev.map((r) =>
          filledRecords.find((f) => f.employeeId === r.employeeId)
            ? {
                ...r,
                checkInStatus: r.checkIn ? "error" : r.checkInStatus,
                checkOutStatus: r.checkOut ? "error" : r.checkOutStatus,
                disabled: false,
                errorMessage:
                  "Submission failed due to network or server error.",
              }
            : r
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtered + Paginated Records
  const filteredRecords = useMemo(() => {
    return manualRecords.filter((r) => {
      const matchesSearch = r.employeeName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesJob =
        jobPositionFilter === "all" || r.jobPosition === jobPositionFilter;
      const matchesStart = !startDate || r.date >= startDate;
      const matchesEnd = !endDate || r.date <= endDate;
      return matchesSearch && matchesJob && matchesStart && matchesEnd;
    });
  }, [manualRecords, searchText, jobPositionFilter, startDate, endDate]);

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

  if (employeesLoading) return <p>Loading employees...</p>;

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col gap-6">
      {/* Header + Auto-fill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manual Attendance</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            onClick={autofillAll}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Auto-fill Timesheet
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Filled Check-Ins:{" "}
          <span className="font-semibold">
            {manualRecords.filter((r) => r.checkIn).length}
          </span>{" "}
          | Filled Check-Outs:{" "}
          <span className="font-semibold">
            {manualRecords.filter((r) => r.checkOut).length}
          </span>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[100%]">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPageNumber(1);
              }}
              className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
            />
          </div>
          <Select
            onValueChange={(value) => {
              setJobPositionFilter(value);
              setPageNumber(1);
            }}
            value={jobPositionFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Array.from(
                new Set(employees.map((e) => e.jobPosition?.trim() || "N/A"))
              ).map((job, idx) => (
                <SelectItem key={`${job}-${idx}`} value={job}>
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="h-[55vh] overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow">
            <tr className="text-left text-gray-600 font-medium">
              <th className="p-3">Employee</th>
              <th className="p-3">Role</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check-In</th>
              <th className="p-3">Check-Out</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((rec) => {
              const invalid = getRowInvalid(rec);
              return (
                <tr
                  key={rec.employeeId}
                  className={`border-b ${
                    invalid ? "bg-red-50" : "hover:bg-gray-50 transition"
                  }`}
                >
                  <td className="p-2">{rec.employeeName}</td>
                  <td className="p-2">{rec.jobPosition}</td>
                  <td className="p-2">
                    <input
                      type="date"
                      disabled={rec.disabled}
                      value={rec.date}
                      onChange={(e) =>
                        handleChange(rec.employeeId, "date", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${
                        invalid && !rec.date
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      disabled={rec.disabled}
                      value={rec.checkIn}
                      onChange={(e) =>
                        handleChange(rec.employeeId, "checkIn", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${
                        invalid &&
                        rec.checkIn &&
                        rec.checkOut &&
                        rec.checkIn > rec.checkOut
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      disabled={rec.disabled}
                      value={rec.checkOut}
                      onChange={(e) =>
                        handleChange(rec.employeeId, "checkOut", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${
                        invalid &&
                        rec.checkIn &&
                        rec.checkOut &&
                        rec.checkOut < rec.checkIn
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex gap-1 items-center justify-center">
                      {rec.checkInStatus === "success" && (
                        <CheckCircle className="text-green-600" size={16} />
                      )}
                      {rec.checkInStatus === "error" && (
                        <AlertCircle className="text-red-600" size={16} />
                      )}
                      {rec.checkInStatus === "pending" && (
                        <Clock className="text-gray-400" size={16} />
                      )}
                      {rec.checkOutStatus === "success" && (
                        <CheckCircle className="text-blue-600" size={16} />
                      )}
                      {rec.checkOutStatus === "error" && (
                        <AlertCircle className="text-red-600" size={16} />
                      )}
                      {rec.checkOutStatus === "pending" && (
                        <Clock className="text-gray-400" size={16} />
                      )}
                    </div>
                  </td>
                  <td className="p-2 flex flex-col gap-1 items-center justify-center">
                    <Button
                      size="sm"
                      disabled={
                        loading ||
                        rec.disabled ||
                        (!rec.checkIn && !rec.checkOut)
                      }
                      onClick={() => handleSubmitRecord(rec)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {rec.disabled ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    {rec.errorMessage && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-800 px-3 py-1 rounded shadow text-xs flex items-center gap-1 animate-slide-down">
                        <AlertCircle size={14} />
                        {rec.errorMessage}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => goToPage(pageNumber - 1)}
              />
            </PaginationItem>
            {getVisiblePages().map((p) =>
              typeof p === "number" ? (
                <PaginationItem key={`page-${p}`}>
                  <PaginationLink
                    href="#"
                    isActive={p === pageNumber}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={`ellipsis-${Math.random()}`}>
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

        {/* Bulk Actions */}
        <Button
          onClick={handleBulkMark}
          disabled={
            loading || manualRecords.every((r) => !r.checkIn && !r.checkOut)
          }
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {loading && <Loader2 className="animate-spin mr-2" />}
          Bulk Mark
        </Button>
      </div>
    </div>
  );
}
