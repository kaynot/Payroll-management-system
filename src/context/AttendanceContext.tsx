import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  loading: boolean;
  fetchError: Error | null;
  refreshAttendance: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const refreshAttendance = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).toISOString();
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      ).toISOString();

      const res = await fetch(
        `http://localhost:7002/api/Attendance?StartDate=${start}&EndDate=${end}&PageNumber=1&PageSize=100&SearchText=`
      );

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const json = await res.json();
      setAttendance(json.data || []);
      setFetchError(null);
    } catch (err: any) {
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAttendance();
  }, []);

  return (
    <AttendanceContext.Provider
      value={{ attendance, loading, fetchError, refreshAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within AttendanceProvider");
  }
  return context;
};
