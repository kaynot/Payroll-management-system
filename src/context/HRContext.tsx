import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useCrudFunc } from "../components/hooks/crud";
import useFetch from "../components/hooks/useFetch";

// ------------------ Interfaces ------------------
export interface EmployeeRecord {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  fullName: string;
  department: string;
  jobPosition: string;
  email: string;
  status: string;
  salary?: number;
  employmentType?: string;
}

export interface EmployeeSummary {
  totalEmployee: number;
  fullTime: number;
  partTime: number;
  nss: number;
  interns: number;
}

interface HRContextType {
  employees: EmployeeRecord[];
  paginatedEmployees: EmployeeRecord[];
  loading: boolean;
  fetchError: unknown | null;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  searchText: string;
  statusFilter: string;
  roleFilter: string;
  summary: EmployeeSummary | null;
  refreshEmployees: () => Promise<void>;
  setPageNumber: (page: number) => void;
  setSearchText: (text: string) => void;
  setStatusFilter: (status: string) => void;
  setRoleFilter: (role: string) => void;
}

// ------------------ Context ------------------
const HRContext = createContext<HRContextType | undefined>(undefined);

// ------------------ Provider ------------------
export const HRProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [postData, updateData, patchData, fetchData, deleteData] =
    useCrudFunc();

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<unknown | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // ------------------ Summary Fetch ------------------
  const [summary, summaryLoading, summaryError, refreshSummary] = useFetch(
    "/Employee/Employees/summary"
  );

  const FETCH_ALL_SIZE = 10000;

  // ------------------ Helpers ------------------
  const formatEmployee = (raw: any): EmployeeRecord => ({
    id: raw.id,
    title: raw.title,
    firstName: raw.firstName,
    lastName: raw.lastName,
    otherNames: raw.otherNames,
    fullName: raw.fullName,
    department: raw.department ?? "N/A",
    jobPosition: raw.jobPosition ?? "N/A",
    email: raw.email ?? "N/A",
    status: raw.status ?? "Active",
    salary: raw.salary ?? 0,
    employmentType: raw.employmentType ?? "N/A",
  });

  // ------------------ Fetch Employees ------------------
  const refreshEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setFetchError(null);

      // Fetch all employees
      const res = await fetchData(
        `Employee/employee?PageNumber=1&PageSize=${FETCH_ALL_SIZE}`
      );
      const raw = res?.data?.data ?? res?.data ?? [];
      const formatted = Array.isArray(raw) ? raw.map(formatEmployee) : [];
      setEmployees(formatted);

      // Refresh summary
      await refreshSummary();

      // Pagination
      const filtered = formatted.filter((e) => {
        const statusMatch =
          statusFilter === "all" ||
          e.status.toLowerCase() === statusFilter.toLowerCase();
        const roleMatch =
          roleFilter === "all" ||
          e.jobPosition.toLowerCase() === roleFilter.toLowerCase();
        return statusMatch && roleMatch;
      });
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
      if (pageNumber > Math.ceil(filtered.length / pageSize)) setPageNumber(1);
    } catch (err) {
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Filtered & Paginated Employees ------------------
  const filteredEmployees = useMemo(() => {
    const search = searchText.toLowerCase();
    return employees.filter((e) => {
      const fullName = `${e.firstName} ${e.otherNames || ""} ${
        e.lastName
      }`.toLowerCase();
      const statusMatch =
        statusFilter === "all" ||
        e.status.toLowerCase() === statusFilter.toLowerCase();
      const roleMatch =
        roleFilter === "all" ||
        e.jobPosition.toLowerCase() === roleFilter.toLowerCase();
      const searchMatch = fullName.includes(search);
      return statusMatch && roleMatch && searchMatch;
    });
  }, [employees, searchText, statusFilter, roleFilter]);

  const paginatedEmployees = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, pageNumber, pageSize]);

  // ------------------ Effects ------------------
  useEffect(() => {
    setPageNumber(1);
    refreshEmployees();
  }, [searchText, statusFilter, roleFilter]);

  // ------------------ Context Value ------------------
  return (
    <HRContext.Provider
      value={{
        employees,
        paginatedEmployees,
        loading,
        fetchError,
        pageNumber,
        pageSize,
        totalPages,
        searchText,
        statusFilter,
        roleFilter,
        summary,
        refreshEmployees,
        setPageNumber,
        setSearchText,
        setStatusFilter,
        setRoleFilter,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

// ------------------ Hook ------------------
export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) throw new Error("useHR must be used within HRProvider");
  return context;
};
