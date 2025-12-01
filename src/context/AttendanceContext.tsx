import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAttendance as useAttendanceApi } from "../components/hooks/useAttendance";
import type {
  AttendanceSummary as ApiAttendanceSummary,
  RawAttendanceRecord,
} from "../components/hooks/useAttendance";

// ------------------ Interfaces ------------------

export interface AttendanceRecord {
  id: number;
  employeeId: string | number;
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
  absentToday: number;
  onLeave: number;
  attendancePercentage: number;
  workingDays: number;
  overallPresent: number;
  overallAbsent: number;
  overallLeave: number;
  averageAttendancePercentage: number;
  allWorkingDays: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  lifetimeAttendancePercentage: number;
}

export interface ManualAttendanceRecord {
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  checkIn?: string; // "HH:mm"
  checkOut?: string; // "HH:mm"
}

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  paginatedAttendance: AttendanceRecord[];
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

  submitManualAttendance: (
    records: ManualAttendanceRecord[],
    bulk?: boolean
  ) => Promise<void>;
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

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const statuses = useMemo(
    () => Array.from(new Set(attendance.map((r) => r.status.toLowerCase()))),
    [attendance]
  );

  const FETCH_ALL_SIZE = 10000;

  // ------------------ Helpers ------------------

  const formatRecord = (record: RawAttendanceRecord): AttendanceRecord => {
    const checkInDate = record.checkIn ? new Date(record.checkIn) : null;
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;

    const totalHours =
      checkInDate && checkOutDate
        ? (
            (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60)
          ).toFixed(2)
        : "-";

    let status = "Absent";

    if (checkInDate) {
      const eightAM = new Date(checkInDate);
      eightAM.setHours(8, 0, 0, 0);
      status = checkInDate > eightAM ? "Late" : "Present";
    }

    return {
      id: record.id,
      employeeId: record.employeeId,
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
    if (!token) return navigate("/", { replace: true });
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetchAttendance({
        SearchText: searchText || undefined,
        PageNumber: 1,
        PageSize: FETCH_ALL_SIZE,
        StartDate: startDate || undefined,
        EndDate: endDate || undefined,
      });

      const rawRecords = Array.isArray(res?.data) ? res.data : [];
      const formatted = rawRecords.map(formatRecord);
      setAttendance(formatted);

      // Fetch summary
      try {
        const summaryRes = await fetchSummary();
        const apiSummary = summaryRes?.data as ApiAttendanceSummary;

        setSummary({
          totalEmployees: apiSummary.totalEmployees,
          presentToday: apiSummary.today.presentToday,
          lateArrivals: apiSummary.today.lateArrivals,
          absent: apiSummary.today.absentToday,
          absentToday: apiSummary.today.absentToday,
          onLeave: apiSummary.today.onLeave,
          attendancePercentage: apiSummary.today.attendancePercentage,

          workingDays: apiSummary.month.workingDays,
          overallPresent: apiSummary.month.overallPresent,
          overallAbsent: apiSummary.month.overallAbsent,
          overallLeave: apiSummary.month.overallLeave,
          averageAttendancePercentage:
            apiSummary.month.averageAttendancePercentage,

          allWorkingDays: apiSummary.allTime.allWorkingDays,
          totalPresent: apiSummary.allTime.totalPresent,
          totalAbsent: apiSummary.allTime.totalAbsent,
          totalLeave: apiSummary.allTime.totalLeave,
          lifetimeAttendancePercentage:
            apiSummary.allTime.lifetimeAttendancePercentage,
        });
      } catch (summaryErr) {
        console.error("Failed to fetch summary:", summaryErr);
        setSummary(null);
      }
    } catch (err) {
      console.error("refreshAttendance error:", err);
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Filter & Pagination ------------------

  const filteredAttendance = useMemo(() => {
    return attendance.filter((r) => {
      const statusMatch =
        statusFilter === "all" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();

      const searchMatch =
        r.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        r.department.toLowerCase().includes(searchText.toLowerCase());

      const startMatch = startDate ? r.date >= startDate : true;
      const endMatch = endDate ? r.date <= endDate : true;

      return statusMatch && searchMatch && startMatch && endMatch;
    });
  }, [attendance, statusFilter, searchText, startDate, endDate]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredAttendance.length / pageSize)),
    [filteredAttendance, pageSize]
  );

  const paginatedAttendance = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredAttendance.slice(start, start + pageSize);
  }, [filteredAttendance, pageNumber, pageSize]);

  // ------------------ Manual Attendance Submission ------------------

  const submitManualAttendance = async (
    records: ManualAttendanceRecord[],
    bulk: boolean = false
  ) => {
    if (!token) return navigate("/", { replace: true });
    if (!records || records.length === 0) return;

    try {
      setLoading(true);
      const validRecords = records.filter(
        (r) => r.checkIn?.trim() || r.checkOut?.trim()
      );
      if (validRecords.length === 0) return;

      const mappedRecords = validRecords.map((r) => ({
        employeeId: Number(r.employeeId),
        checkIn: !!r.checkIn?.trim(),
        checkOut: !!r.checkOut?.trim(),
        checkInTime: r.checkIn
          ? new Date(`${r.date}T${r.checkIn}`).toISOString()
          : undefined,
        checkOutTime: r.checkOut
          ? new Date(`${r.date}T${r.checkOut}`).toISOString()
          : undefined,
      }));

      const payload = {
        date: new Date().toISOString(),
        records: mappedRecords,
      };

      const url = "http://localhost:7002/api/Attendance/bulk";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to submit manual attendance: ${res.statusText} - ${errorText}`
        );
      }

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
  }, [user, token, searchText, statusFilter, startDate, endDate]);

  useEffect(() => {
    if (pageNumber > totalPages) setPageNumber(1);
  }, [totalPages]);

  // ------------------ Provider ------------------

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        paginatedAttendance,
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
        submitManualAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// ------------------ Hook ------------------

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context)
    throw new Error("useAttendance must be used within AttendanceProvider");
  return context;
};
