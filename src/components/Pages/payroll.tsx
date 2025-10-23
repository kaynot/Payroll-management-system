import { useEffect, useMemo, useState } from "react";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  baseSalary: number;
  deductions: number;
  notes?: string;
}

const centsToCurrency = (cents: number) => {
  const dollars = cents / 100;
  return dollars.toLocaleString(undefined, { style: "currency", currency: "USD" });
};

const uid = (prefix = "emp") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

async function fetchPayroll(): Promise<Employee[]> {
  try {
    await new Promise((r) => setTimeout(r, 300));
    return [
      {
        id: uid("e"),
        firstName: "Aisha",
        lastName: "Mensah",
        email: "aisha.mensah@example.com",
        department: "Engineering",
        baseSalary: 7200000,
        deductions: 720000,
      },
      {
        id: uid("e"),
        firstName: "Kwame",
        lastName: "Opoku",
        email: "kwame.opoku@example.com",
        department: "Sales",
        baseSalary: 5400000,
        deductions: 540000,
      },
      {
        id: uid("e"),
        firstName: "Sonia",
        lastName: "Adjei",
        email: "sonia.adjei@example.com",
        department: "HR",
        baseSalary: 4800000,
        deductions: 240000,
      },
    ];
  } catch (error) {
    console.error("Failed to fetch payroll data:", error);
    return [];
  }
}


export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey] = useState<"lastName" | "baseSalary" | "department">("lastName");
  const [sortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [, setEditing] = useState<Employee | null>(null);
  const [] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchPayroll().then((data) => {
      if (mounted) setEmployees(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!employees) return [];
    const q = query.trim().toLowerCase();
    let list = employees.filter((e) => {
      if (!q) return true;
      return (
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        (e.email || "").toLowerCase().includes(q) ||
        (e.department || "").toLowerCase().includes(q)
      );
    });

    list = list.sort((a, b) => {
      let val = 0;
      if (sortKey === "lastName") {
        val = a.lastName.localeCompare(b.lastName);
      } else if (sortKey === "baseSalary") {
        val = a.baseSalary - b.baseSalary;
      } else if (sortKey === "department") {
        val = (a.department || "").localeCompare(b.department || "");
      }
      return sortDir === "asc" ? val : -val;
    });

    return list;
  }, [employees, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  <><th className="p-2 cursor-pointer" onClick={() => toggleSort("lastName")}>Name</th><th className="p-2 cursor-pointer" onClick={() => toggleSort("department")}>Department</th><th className="p-2 cursor-pointer" onClick={() => toggleSort("baseSalary")}>Base Salary</th></>


  function openEdit(emp: Employee) {
    setEditing({ ...emp });
  }


  function exportCSV(list: Employee[]) {
    const headers = ["ID", "First Name", "Last Name", "Email", "Department", "Base Salary", "Deductions", "Net Pay"];
    const rows = list.map((r) => [
      r.id,
      r.firstName,
      r.lastName,
      r.email,
      r.department || "",
      (r.baseSalary / 100).toFixed(2),
      (r.deductions / 100).toFixed(2),
      ((r.baseSalary - r.deductions) / 100).toFixed(2),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const totalBasicSalary = employees?.reduce((sum, e) => sum + e.baseSalary, 0) || 0;
  const totalAllowances = employees?.reduce((sum, e) => sum + e.baseSalary * 0.2, 0) || 0;
  const totalDeductions = employees?.reduce((sum, e) => sum + e.deductions, 0) || 0;
  const netPayroll = totalBasicSalary + totalAllowances - totalDeductions;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Payroll</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCSV(filtered)}
              className="px-3 py-2 rounded-lg border hover:bg-gray-100"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                const newEmp: Employee = {
                  id: uid("new"),
                  firstName: "New",
                  lastName: "Employee",
                  email: "new.employee@example.com",
                  baseSalary: 3000000,
                  deductions: 0,
                };
                setEmployees((prev) => (prev ? [newEmp, ...prev] : [newEmp]));
              }}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Employee
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Total Basic Salary</h3>
            <p className="text-xl font-semibold text-green-600 mt-1">
              {centsToCurrency(totalBasicSalary)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Total Allowances</h3>
            <p className="text-xl font-semibold text-blue-600 mt-1">
              {centsToCurrency(totalAllowances)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Total Deductions</h3>
            <p className="text-xl font-semibold text-red-600 mt-1">
              {centsToCurrency(totalDeductions)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Net Payroll</h3>
            <p className="text-xl font-semibold text-purple-600 mt-1">
              {centsToCurrency(netPayroll)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or department"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Base Salary</th>
                  <th className="p-2">Deductions</th>
                  <th className="p-2">Net Pay</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees === null ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  pageItems.map((e, i) => {
                    const idx = (page - 1) * pageSize + i + 1;
                    return (
                      <tr key={e.id} className="border-t">
                        <td className="p-2 align-top">{idx}</td>
                        <td className="p-2 align-top">
                          {e.firstName} {e.lastName}
                        </td>
                        <td className="p-2 align-top">{e.email}</td>
                        <td className="p-2 align-top">{e.department || "—"}</td>
                        <td className="p-2 align-top">{centsToCurrency(e.baseSalary)}</td>
                        <td className="p-2 align-top">{centsToCurrency(e.deductions)}</td>
                        <td className="p-2 align-top">
                          {centsToCurrency(e.baseSalary - e.deductions)}
                        </td>
                        <td className="p-2 align-top">
                          <button
                            onClick={() => openEdit(e)}
                            className="px-2 py-1 border rounded"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {pageItems.length} of {filtered.length} employees
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <div className="px-2">
                Page {page} / {pageCount}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toggleSort(_arg0: string): void {
  throw new Error("Function not implemented.");
}

