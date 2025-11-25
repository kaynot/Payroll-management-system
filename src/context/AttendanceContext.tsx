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

export interface ManualAttendanceRecord {
  employeeId: string;
  checkIn?: string;
  checkOut?: string;
  date: string;
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

  submitManualAttendance: (records: ManualAttendanceRecord[]) => Promise<void>;
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

  const FETCH_ALL_SIZE = 10000;

  // ------------------ Helpers ------------------

  const formatRecord = (record: any): AttendanceRecord => {
    const checkInDate = record.checkIn ? new Date(record.checkIn) : null;
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;

    const totalHours =
      checkInDate && checkOutDate
        ? ((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)).toFixed(2)
        : "-";

    const isLate = checkInDate ? checkInDate.getHours() >= 8 : false;
    const status = isLate ? "Late" : checkOutDate ? "Present" : "Absent";

    return {
      id: record.id,
      employeeName: `${record.firstName ?? ""} ${record.surname ?? ""}`.trim(),
      department: record.department ?? "N/A",
      date: record.date ? record.date.split("T")[0] : "",
      checkIn: checkInDate
        ? checkInDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-",
      checkOut: checkOutDate
        ? checkOutDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-",
      totalHours,
      status,
    };
  };

  // ------------------ Fetch Attendance ------------------

  const refreshAttendance = async () => {
    if (!token) return navigate("/", { replace: true });

    setLoading(true);
    try {
      setFetchError(null);

      const res = await fetchAttendance({
        SearchText: searchText || undefined,
        PageNumber: 1,
        PageSize: FETCH_ALL_SIZE,
        StartDate: startDate || undefined,
        EndDate: endDate || undefined,
      });

      const raw = res?.data?.data ?? res?.data ?? [];
      const formatted = Array.isArray(raw) ? raw.map(formatRecord) : [];
      setAttendance(formatted);

      setTotalPages(Math.max(1, Math.ceil(formatted.length / pageSize)));

      try {
        const summaryRes = await fetchSummary();
        const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? null;
        setSummary(summaryData);
      } catch (sErr) {
        console.error("Failed to fetch summary:", sErr);
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

  // ------------------ Manual Attendance Submission ------------------

  const submitManualAttendance = async (records: ManualAttendanceRecord[]) => {
    if (!token) return navigate("/", { replace: true });
    if (!records || records.length === 0) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:7002/api/Attendance/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(records),
      });

      if (!res.ok) throw new Error(`Failed to submit manual attendance: ${res.statusText}`);

      // Refresh after submission
      await refreshAttendance();
    } catch (err) {
      console.error("submitManualAttendance error:", err);
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Effects ------------------

  useEffect(() => {
    if (user && token) {
      setPageNumber(1);
      refreshAttendance();
    }
  }, [user, token, searchText, startDate, endDate]);

  useEffect(() => {
    const filtered =
      statusFilter === "all" ? attendance : attendance.filter((r) => r.status === statusFilter);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
    if (pageNumber > Math.max(1, Math.ceil(filtered.length / pageSize))) setPageNumber(1);
  }, [statusFilter, attendance]);

  // ------------------ Provider ------------------

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
        submitManualAttendance, // expose manual attendance function
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// ------------------ Hook ------------------

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error("useAttendance must be used within AttendanceProvider");
  return context;
};
