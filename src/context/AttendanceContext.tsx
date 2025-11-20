import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAttendance as useAttendanceApi } from "../components/hooks/useAttendance";

// ------------------ Interfaces ------------------

export interface AttendanceRecord {
  id: number;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours?: string;
  status: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  absent: number;
}

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  summary: AttendanceSummary | null;
  loading: boolean;
  fetchError: unknown | null;

  pageNumber: number;
  pageSize: number;
  totalPages: number;

  searchText: string;
  statusFilter: string;
  startDate: string;
  endDate: string;

  setPageNumber: (page: number) => void;
  setSearchText: (text: string) => void;
  setStatusFilter: (status: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;

  refreshAttendance: () => Promise<void>;
}

// ------------------ Context ------------------

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

// ------------------ Provider ------------------

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { fetchAttendance, fetchSummary } = useAttendanceApi();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<unknown | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // When backend doesn't return pagination metadata, we fetch a large page to get all matching rows.
  const FETCH_ALL_SIZE = 10000;

  // ------------------ Helpers ------------------

  const formatRecord = (record: any): AttendanceRecord => {
    const checkInDate = record.checkIn ? new Date(record.checkIn) : null;
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;

    const totalHours =
      checkInDate && checkOutDate
        ? (
            (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60)
          ).toFixed(2)
        : "-";

    const isLate = checkInDate ? checkInDate.getHours() >= 8 : false;
    const status = isLate ? "Late" : checkOutDate ? "Present" : "Absent";

    return {
      id: record.id,
      employeeName: `${record.firstName ?? ""} ${record.surname ?? ""}`.trim(),
      department: record.department ?? "N/A",
      date: record.date ? record.date.split("T")[0] : "",
      checkIn: checkInDate
        ? checkInDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      checkOut: checkOutDate
        ? checkOutDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      totalHours,
      status,
    };
  };

  // ------------------ Fetch Attendance ------------------

  const refreshAttendance = async () => {
    // If there's no token, redirect to login (preserve previous behavior)
    if (!token) return navigate("/", { replace: true });

    setLoading(true);
    try {
      setFetchError(null);

      // Request backend for all matching records (large page size)
      const res = await fetchAttendance({
        SearchText: searchText || undefined,
        PageNumber: 1,
        PageSize: FETCH_ALL_SIZE,
        StartDate: startDate || undefined,
        EndDate: endDate || undefined,
      });

      // backend returns { message, data: [...] , statusCode }
      const raw = res?.data?.data ?? res?.data ?? [];

      // Format and store all fetched records
      const formatted = Array.isArray(raw) ? raw.map(formatRecord) : [];
      setAttendance(formatted);

      // Recompute totalPages for client-side pagination
      setTotalPages(Math.max(1, Math.ceil(formatted.length / pageSize)));

      // Fetch summary endpoint separately
      try {
        const summaryRes = await fetchSummary();
        // summaryRes structure: { message, data: {...}, statusCode }
        const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? null;
        setSummary(summaryData);
      } catch (sErr) {
        console.error("Failed to fetch summary:", sErr);
        // keep previous summary if any (or set null)
        setSummary(null);
      }

      setFetchError(null);
    } catch (err: unknown) {
      console.error("refreshAttendance error:", err);
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh anytime filters change
  useEffect(() => {
    if (user && token) {
      // Reset to first page on filter change
      setPageNumber(1);
      refreshAttendance();
    }
  }, [user, token, searchText, startDate, endDate]);

  useEffect(() => {
    const filtered =
      statusFilter === "all"
        ? attendance
        : attendance.filter((r) => r.status === statusFilter);

    setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
    if (pageNumber > Math.max(1, Math.ceil(filtered.length / pageSize))) {
      setPageNumber(1);
    }
  }, [statusFilter, attendance]);

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        summary,
        loading,
        fetchError,
        pageNumber,
        pageSize,
        totalPages,
        searchText,
        statusFilter,
        startDate,
        endDate,
        setPageNumber,
        setSearchText,
        setStatusFilter,
        setStartDate,
        setEndDate,
        refreshAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// ------------------ Hook ------------------

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within AttendanceProvider");
  }
  return context;
};
