import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../types/Employee";

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  loading: boolean;
  fetchError: Error | null;
  refreshEmployees: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const refreshEmployees = async () => {
    setLoading(true);
    try {
      let allEmployees: Employee[] = [];
      let page = 1;
      const pageSize = 50; // fetch 50 per request to be safe
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `http://localhost:7002/api/Employee/employee?page=${page}&pageSize=${pageSize}`
        );

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const json = await res.json();
        const mapped = Array.isArray(json.data)
          ? json.data.map((e: any) => ({
              id: e.id,
              title: e.title,
              firstName: e.firstName,
              lastName: e.surname,
              otherNames: e.otherName,
              fullName: `${e.firstName} ${e.surname} ${
                e.otherName || ""
              }`.trim(),
              email: e.email,
              phone: e.phoneNumber,
              dob: e.dateOfBirth,
              address: e.address,
              jobPosition: e.jobPosition,
              department: e.department || "N/A",
              hireDate: e.hireDate,
              employmentType: e.employmentType,
              manager: e.reportingManager,
              salary: Number(e.salary),
              payFrequency: e.payFrequency,
              status: e.employmentStatus,
            }))
          : [];

        allEmployees = [...allEmployees, ...mapped];

        // If the number of records returned is less than pageSize, we reached the end
        if (!mapped.length || mapped.length < pageSize) hasMore = false;
        else page += 1;
      }

      setEmployees(allEmployees);
      setFetchError(null);
    } catch (err: any) {
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{ employees, setEmployees, loading, fetchError, refreshEmployees }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeeProvider");
  }
  return context;
};
