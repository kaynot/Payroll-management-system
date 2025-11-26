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
      const res = await fetch("http://localhost:7002/api/Employee/employee");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const json = await res.json();

      const mapped = Array.isArray(json.data)
        ? json.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            firstName: e.firstName,
            lastName: e.surname,
            otherNames: e.otherName,
            fullName: `${e.firstName} ${e.surname}`.trim(), // <-- populate fullName here
            email: e.email,
            phone: e.phoneNumber,
            dob: e.dateOfBirth,
            address: e.address,
            jobPosition: e.jobPosition,
            department: e.department,
            hireDate: e.hireDate,
            employmentType: e.employmentType,
            manager: e.reportingManager,
            salary: Number(e.salary),
            payFrequency: e.payFrequency,
            status: e.employmentStatus,
          }))
        : [];

      setEmployees(mapped);
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
