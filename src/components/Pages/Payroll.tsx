import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import PptxGenJS from "pptxgenjs";

type EmployeeType = "National Service Personnel" | "Intern" | "Full-time" | "Part-time" | "Other";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  department?: string;
  employeeType?: EmployeeType;
  baseSalary: number; 
  allowances?: number; 
  tax: number; 
  ssnit: number; 
  loan: number; 
  deductions: number; 
  notes?: string;
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string; 
  baseSalary: number;
  allowances: number;
  tax: number;
  ssnit: number;
  loan: number;
  deductions: number;
  netPay: number;
  createdAt: string;
}

const ghcCurrency = (cents: number) =>
  (cents / 100).toLocaleString("en-GH", { style: "currency", currency: "GHS" });

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

async function fetchMockEmployees(): Promise<Employee[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [
    {
      id: uid("e"),
      firstName: "Aisha",
      lastName: "Mensah",
      email: "aisha.mensah@example.com",
      phone: "+233201234567",
      password: "pass123",
      department: "Engineering",
      employeeType: "Full-time",
      baseSalary: 7200000,
      allowances: 1440000,
      tax: 500000,
      ssnit: 200000,
      loan: 300000,
      deductions: 720000,
    },
    {
      id: uid("e"),
      firstName: "Kwame",
      lastName: "Opoku",
      email: "kwame.opoku@example.com",
      phone: "+233205555555",
      password: "secret",
      department: "Sales",
      employeeType: "Part-time",
      baseSalary: 5400000,
      allowances: 1080000,
      tax: 400000,
      ssnit: 180000,
      loan: 150000,
      deductions: 540000,
    },
  ];
}

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("new");
  const [payslipForm, setPayslipForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    employeeType: "Full-time" as EmployeeType,
    baseSalary: "",
    allowances: "",
    tax: "",
    ssnit: "",
    loan: "",
    deductions: "",
    payPeriod: new Date().toISOString().slice(0, 10),
  });

  const [editing, setEditing] = useState<Employee | null>(null);

  useEffect(() => {
    fetchMockEmployees().then((data) => setEmployees(data));
  }, []);

  const filtered = useMemo(() => {
    if (!employees) return [];
    const q = query.trim().toLowerCase();
    return employees
      .filter((e) => {
        if (!q) return true;
        return (
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          (e.email || "").toLowerCase().includes(q) ||
          (e.department || "").toLowerCase().includes(q) ||
          (e.phone || "").toLowerCase().includes(q) ||
          ((e.employeeType || "").toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [employees, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totals = useMemo(() => {
    if (!employees) return { basic: 0, allowances: 0, tax: 0, ssnit: 0, loan: 0, deductions: 0, net: 0 };
    const basic = employees.reduce((s, e) => s + e.baseSalary, 0);
    const allowances = employees.reduce((s, e) => s + (e.allowances || 0), 0);
    const tax = employees.reduce((s, e) => s + e.tax, 0);
    const ssnit = employees.reduce((s, e) => s + e.ssnit, 0);
    const loan = employees.reduce((s, e) => s + e.loan, 0);
    const deductions = employees.reduce((s, e) => s + e.deductions, 0);
    const net = basic + allowances - (tax + ssnit + loan + deductions);
    return { basic, allowances, tax, ssnit, loan, deductions, net };
  }, [employees]);

   function downloadPayslipPDF(p: Payslip) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("Company Name: Your Company Ltd.", 40, 40);
    doc.setFontSize(12);
    doc.text(`Payslip for: ${p.payPeriod}`, 40, 60);

    doc.setFontSize(12);
    doc.text(`Name: ${p.employeeName}`, 40, 90);
    doc.text(`Period: ${p.payPeriod}`, 40, 110);

    const rows = [
      ["Basic Salary", `GHS ${(p.baseSalary / 100).toFixed(2)}`],
      ["Allowances", `GHS ${(p.allowances / 100).toFixed(2)}`],
      ["Tax", `GHS ${(p.tax / 100).toFixed(2)}`],
      ["SSNIT", `GHS ${(p.ssnit / 100).toFixed(2)}`],
      ["Loan", `GHS ${(p.loan / 100).toFixed(2)}`],
      ["Other Deductions", `GHS ${(p.deductions / 100).toFixed(2)}`],
      ["Net Pay", `GHS ${(p.netPay / 100).toFixed(2)}`],
    ];

    (doc as any).autoTable({
      startY: 130,
      head: [["Description", "Amount (GHS)"]],
      body: rows,
      theme: "grid",
    });

    doc.setFontSize(10);
    doc.text("This is a system generated payslip.", 40, (doc as any).lastAutoTable.finalY + 30);
    doc.save(`${p.employeeName.replace(/\s+/g, "_")}_Payslip_${p.payPeriod}.pdf`);
  }

  function downloadPayslipWord(p: Payslip) {
    
    const html = `
      <html>
        <head><meta charset="utf-8"><title>Payslip</title></head>
        <body>
          <h2>Your Company Ltd. - Payslip</h2>
          <p><strong>Employee:</strong> ${p.employeeName}</p>
          <p><strong>Period:</strong> ${p.payPeriod}</p>
          <table border="1" cellpadding="6" cellspacing="0">
            <tr><td>Basic Salary</td><td>GHS ${(p.baseSalary/100).toFixed(2)}</td></tr>
            <tr><td>Allowances</td><td>GHS ${(p.allowances/100).toFixed(2)}</td></tr>
            <tr><td>Tax</td><td>GHS ${(p.tax/100).toFixed(2)}</td></tr>
            <tr><td>SSNIT</td><td>GHS ${(p.ssnit/100).toFixed(2)}</td></tr>
            <tr><td>Loan</td><td>GHS ${(p.loan/100).toFixed(2)}</td></tr>
            <tr><td>Other Deductions</td><td>GHS ${(p.deductions/100).toFixed(2)}</td></tr>
            <tr><td><strong>Net Pay</strong></td><td><strong>GHS ${(p.netPay/100).toFixed(2)}</strong></td></tr>
          </table>
        </body>
      </html>
    `.trim();

    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.employeeName.replace(/\s+/g, "_")}_Payslip_${p.payPeriod}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPayslipXLSX(p: Payslip) {
    const wsData = [
      ["Field", "Amount (GHS)"],
      ["Basic Salary", (p.baseSalary / 100).toFixed(2)],
      ["Allowances", (p.allowances / 100).toFixed(2)],
      ["Tax", (p.tax / 100).toFixed(2)],
      ["SSNIT", (p.ssnit / 100).toFixed(2)],
      ["Loan", (p.loan / 100).toFixed(2)],
      ["Other Deductions", (p.deductions / 100).toFixed(2)],
      ["Net Pay", (p.netPay / 100).toFixed(2)],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payslip");
    XLSX.writeFile(wb, `${p.employeeName.replace(/\s+/g, "_")}_Payslip_${p.payPeriod}.xlsx`);
  }

  function downloadPayslipPPT(p: Payslip) {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText("Your Company Ltd. - Payslip", { x: 0.5, y: 0.3, fontSize: 18, bold: true });
    slide.addText(`Employee: ${p.employeeName}`, { x: 0.5, y: 1.0, fontSize: 14 });
    slide.addText(`Period: ${p.payPeriod}`, { x: 0.5, y: 1.4, fontSize: 12 });

    const lines = [
      `Basic Salary: GHS ${(p.baseSalary/100).toFixed(2)}`,
      `Allowances: GHS ${(p.allowances/100).toFixed(2)}`,
      `Tax: GHS ${(p.tax/100).toFixed(2)}`,
      `SSNIT: GHS ${(p.ssnit/100).toFixed(2)}`,
      `Loan: GHS ${(p.loan/100).toFixed(2)}`,
      `Other Deductions: GHS ${(p.deductions/100).toFixed(2)}`,
      `Net Pay: GHS ${(p.netPay/100).toFixed(2)}`,
    ];
    slide.addText(lines.join("\n"), { x: 0.5, y: 1.9, fontSize: 12, color: "363636" });
    pptx.writeFile({ fileName: `${p.employeeName.replace(/\s+/g, "_")}_Payslip_${p.payPeriod}.pptx` });
  }

  /* ========== Payslip & Edit Modal logic ========== */

  const selectedEmployee = useMemo(() => {
    if (!employees) return null;
    return employees.find((e) => e.id === selectedEmployeeId) || null;
  }, [employees, selectedEmployeeId]);

  useEffect(() => {
    if (selectedEmployee) {
      setPayslipForm((f) => ({
        ...f,
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone || "",
        department: selectedEmployee.department || "",
        employeeType: selectedEmployee.employeeType || "Full-time",
        baseSalary: (selectedEmployee.baseSalary / 100).toFixed(2),
        allowances: ((selectedEmployee.allowances || 0) / 100).toFixed(2),
        tax: (selectedEmployee.tax / 100).toFixed(2),
        ssnit: (selectedEmployee.ssnit / 100).toFixed(2),
        loan: (selectedEmployee.loan / 100).toFixed(2),
        deductions: (selectedEmployee.deductions / 100).toFixed(2),
      }));
    } else {
      setPayslipForm((f) => ({ ...f })); // keep current for "new" if needed
    }
  }, [selectedEmployee]);

  const parsedPayslip = useMemo(() => {
    const toCents = (v: string) => Math.round((Number(String(v).replace(/,/g, "")) || 0) * 100);
    const baseSalary = toCents(payslipForm.baseSalary);
    const allowances = toCents(payslipForm.allowances);
    const tax = toCents(payslipForm.tax);
    const ssnit = toCents(payslipForm.ssnit);
    const loan = toCents(payslipForm.loan);
    const deductions = toCents(payslipForm.deductions);
    const netPay = baseSalary + allowances - (tax + ssnit + loan + deductions);
    return { baseSalary, allowances, tax, ssnit, loan, deductions, netPay };
  }, [payslipForm]);

  function openPayslipModalForEmployee(empId?: string) {
    setSelectedEmployeeId(empId || "new");
    if (!empId) {
      setPayslipForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        employeeType: "Full-time",
        baseSalary: "",
        allowances: "",
        tax: "",
        ssnit: "",
        loan: "",
        deductions: "",
        payPeriod: new Date().toISOString().slice(0, 10),
      });
    }
    setShowPayslipModal(true);
  }

  function savePayslip() {
    const id = uid("p");
    const payPeriod = payslipForm.payPeriod.slice(0, 7); 
    const employeeName = `${payslipForm.firstName || selectedEmployee?.firstName || ""} ${payslipForm.lastName || selectedEmployee?.lastName || ""}`.trim();
    const newP: Payslip = {
      id,
      employeeId: selectedEmployeeId === "new" ? uid("e") : selectedEmployeeId,
      employeeName,
      payPeriod,
      baseSalary: parsedPayslip.baseSalary,
      allowances: parsedPayslip.allowances,
      tax: parsedPayslip.tax,
      ssnit: parsedPayslip.ssnit,
      loan: parsedPayslip.loan,
      deductions: parsedPayslip.deductions,
      netPay: parsedPayslip.netPay,
      createdAt: new Date().toISOString(),
    };
    setPayslips((p) => [newP, ...p]);

    if (selectedEmployeeId === "new") {
      const newEmp: Employee = {
        id: newP.employeeId,
        firstName: payslipForm.firstName || "New",
        lastName: payslipForm.lastName || "Employee",
        email: payslipForm.email || "",
        phone: payslipForm.phone || "",
        password: "",
        department: payslipForm.department || "",
        employeeType: payslipForm.employeeType as EmployeeType,
        baseSalary: parsedPayslip.baseSalary,
        allowances: parsedPayslip.allowances,
        tax: parsedPayslip.tax,
        ssnit: parsedPayslip.ssnit,
        loan: parsedPayslip.loan,
        deductions: parsedPayslip.deductions,
      };
      setEmployees((prev) => (prev ? [newEmp, ...prev] : [newEmp]));
    } else {
      setEmployees((prev) =>
        prev
          ? prev.map((e) =>
              e.id === selectedEmployeeId
                ? {
                    ...e,
                    firstName: payslipForm.firstName || e.firstName,
                    lastName: payslipForm.lastName || e.lastName,
                    email: payslipForm.email || e.email,
                    phone: payslipForm.phone || e.phone,
                    department: payslipForm.department || e.department,
                    employeeType: payslipForm.employeeType as EmployeeType,
                    baseSalary: parsedPayslip.baseSalary,
                    allowances: parsedPayslip.allowances,
                    tax: parsedPayslip.tax,
                    ssnit: parsedPayslip.ssnit,
                    loan: parsedPayslip.loan,
                    deductions: parsedPayslip.deductions,
                  }
                : e
            )
          : prev
      );
    }

    setShowPayslipModal(false);
  }

  function openEdit(emp: Employee) {
    setEditing({ ...emp });
    setShowEditModal(true);
  }

  function saveEdit() {
    if (!editing) return;
    setEmployees((prev) => (prev ? prev.map((e) => (e.id === editing.id ? editing : e)) : prev));
    setShowEditModal(false);
    setEditing(null);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Payroll</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // bulk PDF export for all employees
                if (!employees || employees.length === 0) return alert("No employees");
                employees.forEach((e) => {
                  const net = e.baseSalary + (e.allowances || 0) - (e.tax + e.ssnit + e.loan + e.deductions);
                  const p: Payslip = {
                    id: uid("p"),
                    employeeId: e.id,
                    employeeName: `${e.firstName} ${e.lastName}`,
                    payPeriod: new Date().toISOString().slice(0, 7),
                    baseSalary: e.baseSalary,
                    allowances: e.allowances || 0,
                    tax: e.tax,
                    ssnit: e.ssnit,
                    loan: e.loan,
                    deductions: e.deductions,
                    netPay: net,
                    createdAt: new Date().toISOString(),
                  };
                  downloadPayslipPDF(p);
                });
              }}
              className="px-3 py-2 rounded-lg border hover:bg-gray-100"
            >
              Download Payslips (PDF)
            </button>

            <button
              onClick={() => openPayslipModalForEmployee()}
              className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Add Payslip
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Basic Salary</div>
            <div className="text-xl font-semibold text-green-600 mt-1">{ghcCurrency(totals.basic)}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Allowances</div>
            <div className="text-xl font-semibold text-blue-600 mt-1">{ghcCurrency(totals.allowances)}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Tax & Deductions</div>
            <div className="text-xl font-semibold text-red-600 mt-1">{ghcCurrency(totals.tax + totals.ssnit + totals.loan + totals.deductions)}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm text-gray-500">Net Payroll</div>
            <div className="text-xl font-semibold text-purple-600 mt-1">{ghcCurrency(totals.net)}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <div className="mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, dept, type"
              className="w-full border rounded p-2"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Type</th>
                <th className="p-2">Department</th>
                <th className="p-2">Basic</th>
                <th className="p-2">Allowances</th>
                <th className="p-2">Tax</th>
                <th className="p-2">SSNIT</th>
                <th className="p-2">Loan</th>
                <th className="p-2">Deductions</th>
                <th className="p-2">Net Pay</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((e, i) => {
                const idx = (page - 1) * pageSize + i + 1;
                const net = e.baseSalary + (e.allowances || 0) - (e.tax + e.ssnit + e.loan + e.deductions);
                return (
                  <tr className="border-t" key={e.id}>
                    <td className="p-2">{idx}</td>
                    <td className="p-2">{e.firstName} {e.lastName}</td>
                    <td className="p-2">{e.email}</td>
                    <td className="p-2">{e.phone || "—"}</td>
                    <td className="p-2">{e.employeeType || "—"}</td>
                    <td className="p-2">{e.department || "—"}</td>
                    <td className="p-2">{ghcCurrency(e.baseSalary)}</td>
                    <td className="p-2">{ghcCurrency(e.allowances || 0)}</td>
                    <td className="p-2">{ghcCurrency(e.tax)}</td>
                    <td className="p-2">{ghcCurrency(e.ssnit)}</td>
                    <td className="p-2">{ghcCurrency(e.loan)}</td>
                    <td className="p-2">{ghcCurrency(e.deductions)}</td>
                    <td className="p-2 font-semibold">{ghcCurrency(net)}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="px-2 py-1 border rounded">Edit</button>
                        <button
                          onClick={() => {
                            openPayslipModalForEmployee(e.id);
                          }}
                          className="px-2 py-1 border rounded"
                        >
                          Payslip
                        </button>
                        <button
                          onClick={() => {
                            const netp = e.baseSalary + (e.allowances || 0) - (e.tax + e.ssnit + e.loan + e.deductions);
                            const p: Payslip = {
                              id: uid("p"),
                              employeeId: e.id,
                              employeeName: `${e.firstName} ${e.lastName}`,
                              payPeriod: new Date().toISOString().slice(0, 7),
                              baseSalary: e.baseSalary,
                              allowances: e.allowances || 0,
                              tax: e.tax,
                              ssnit: e.ssnit,
                              loan: e.loan,
                              deductions: e.deductions,
                              netPay: netp,
                              createdAt: new Date().toISOString(),
                            };
                            downloadPayslipPDF(p);
                          }}
                          className="px-2 py-1 border rounded"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Showing {pageItems.length} of {filtered.length} employees</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <div className="px-2">Page {page} / {pageCount}</div>
              <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div> 
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Recent Payslips</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {payslips.length === 0 ? (
              <div className="text-sm text-gray-600">No payslips generated yet</div>
            ) : (
              <div className="space-y-3">
                {payslips.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border p-2 rounded">
                    <div>
                      <div className="font-medium">{p.employeeName}</div>
                      <div className="text-sm text-gray-600">Period: {p.payPeriod} • Net: {ghcCurrency(p.netPay)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadPayslipPDF(p)} className="px-2 py-1 border rounded">PDF</button>
                      <button onClick={() => downloadPayslipWord(p)} className="px-2 py-1 border rounded">Word</button>
                      <button onClick={() => downloadPayslipXLSX(p)} className="px-2 py-1 border rounded">Excel</button>
                      <button onClick={() => downloadPayslipPPT(p)} className="px-2 py-1 border rounded">PPT</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {showPayslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Add / Generate Payslip (Ghana)</h3>
              <div className="flex gap-2">
                <button onClick={() => setShowPayslipModal(false)} className="px-3 py-1 border rounded">Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Select Employee</label>
                <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full border rounded p-2 mt-1">
                  <option value="new">-- New Employee --</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeType})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Pay Period</label>
                <input type="month" value={payslipForm.payPeriod.slice(0,7)} onChange={(e) => setPayslipForm((f) => ({ ...f, payPeriod: e.target.value + "-01" }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input value={payslipForm.firstName} onChange={(e) => setPayslipForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input value={payslipForm.lastName} onChange={(e) => setPayslipForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input value={payslipForm.email} onChange={(e) => setPayslipForm((f) => ({ ...f, email: e.target.value }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input value={payslipForm.phone} onChange={(e) => setPayslipForm((f) => ({ ...f, phone: e.target.value }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                <input value={payslipForm.department} onChange={(e) => setPayslipForm((f) => ({ ...f, department: e.target.value }))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Employee Type</label>
                <select value={payslipForm.employeeType} onChange={(e) => setPayslipForm((f) => ({ ...f, employeeType: e.target.value as EmployeeType }))} className="w-full border rounded p-2 mt-1">
                  <option>National Service Personnel</option>
                  <option>Intern</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Base Salary (GHS)</label>
                <input value={payslipForm.baseSalary} onChange={(e) => setPayslipForm((f) => ({ ...f, baseSalary: e.target.value }))} placeholder="e.g. 1000.00" className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Allowances (GHS)</label>
                <input value={payslipForm.allowances} onChange={(e) => setPayslipForm((f) => ({ ...f, allowances: e.target.value }))} placeholder="e.g. 200.00" className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tax (GHS)</label>
                <input value={payslipForm.tax} onChange={(e) => setPayslipForm((f) => ({ ...f, tax: e.target.value }))} placeholder="e.g. 150.00" className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">SSNIT (GHS)</label>
                <input value={payslipForm.ssnit} onChange={(e) => setPayslipForm((f) => ({ ...f, ssnit: e.target.value }))} placeholder="e.g. 50.00" className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Loan (GHS)</label>
                <input value={payslipForm.loan} onChange={(e) => setPayslipForm((f) => ({ ...f, loan: e.target.value }))} placeholder="e.g. 0.00" className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Other Deductions (GHS)</label>
                <input value={payslipForm.deductions} onChange={(e) => setPayslipForm((f) => ({ ...f, deductions: e.target.value }))} placeholder="e.g. 20.00" className="w-full border rounded p-2 mt-1" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Net Pay</div>
                <div className="text-2xl font-semibold">{ghcCurrency(parsedPayslip.netPay)}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => {
                  // reset
                  setPayslipForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    department: "",
                    employeeType: "Full-time",
                    baseSalary: "",
                    allowances: "",
                    tax: "",
                    ssnit: "",
                    loan: "",
                    deductions: "",
                    payPeriod: new Date().toISOString().slice(0,10),
                  });
                  setSelectedEmployeeId("new");
                }} className="px-3 py-2 border rounded">Reset</button>

                <button onClick={() => {
                  savePayslip(); 
                }} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Payslip</button>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Preview (Ghana payslip) & Exports</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-600">Employee</div>
                    <div className="font-medium">{payslipForm.firstName} {payslipForm.lastName}</div>
                    <div className="text-sm text-gray-600">Email: {payslipForm.email}</div>
                    <div className="text-sm text-gray-600">Phone: {payslipForm.phone}</div>
                    <div className="text-sm text-gray-600">Type: {payslipForm.employeeType}</div>
                    <div className="text-sm text-gray-600">Period: {payslipForm.payPeriod.slice(0,7)}</div>
                  </div>

                  <div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr><td>Basic Salary</td><td className="text-right">{ghcCurrency(parsedPayslip.baseSalary)}</td></tr>
                        <tr><td>Allowances</td><td className="text-right">{ghcCurrency(parsedPayslip.allowances)}</td></tr>
                        <tr><td>Tax</td><td className="text-right">{ghcCurrency(parsedPayslip.tax)}</td></tr>
                        <tr><td>SSNIT</td><td className="text-right">{ghcCurrency(parsedPayslip.ssnit)}</td></tr>
                        <tr><td>Loan</td><td className="text-right">{ghcCurrency(parsedPayslip.loan)}</td></tr>
                        <tr><td>Other Deductions</td><td className="text-right">{ghcCurrency(parsedPayslip.deductions)}</td></tr>
                        <tr className="font-semibold"><td>Net Pay</td><td className="text-right">{ghcCurrency(parsedPayslip.netPay)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-2 border rounded" onClick={() => {
                    const temp: Payslip = {
                      id: uid("p"),
                      employeeId: selectedEmployeeId === "new" ? uid("e") : selectedEmployeeId,
                      employeeName: `${payslipForm.firstName} ${payslipForm.lastName}`.trim() || (selectedEmployee?.firstName + " " + selectedEmployee?.lastName) || "Employee",
                      payPeriod: payslipForm.payPeriod.slice(0,7),
                      baseSalary: parsedPayslip.baseSalary,
                      allowances: parsedPayslip.allowances,
                      tax: parsedPayslip.tax,
                      ssnit: parsedPayslip.ssnit,
                      loan: parsedPayslip.loan,
                      deductions: parsedPayslip.deductions,
                      netPay: parsedPayslip.netPay,
                      createdAt: new Date().toISOString(),
                    };
                    downloadPayslipPDF(temp);
                  }}>Export PDF</button>

                  <button className="px-3 py-2 border rounded" onClick={() => {
                    const temp = {
                      id: uid("p"),
                      employeeId: selectedEmployeeId === "new" ? uid("e") : selectedEmployeeId,
                      employeeName: `${payslipForm.firstName} ${payslipForm.lastName}`.trim(),
                      payPeriod: payslipForm.payPeriod.slice(0,7),
                      baseSalary: parsedPayslip.baseSalary,
                      allowances: parsedPayslip.allowances,
                      tax: parsedPayslip.tax,
                      ssnit: parsedPayslip.ssnit,
                      loan: parsedPayslip.loan,
                      deductions: parsedPayslip.deductions,
                      netPay: parsedPayslip.netPay,
                      createdAt: new Date().toISOString(),
                    } as Payslip;
                    downloadPayslipWord(temp);
                  }}>Export Word</button>

                  <button className="px-3 py-2 border rounded" onClick={() => {
                    const temp = {
                      id: uid("p"),
                      employeeId: selectedEmployeeId === "new" ? uid("e") : selectedEmployeeId,
                      employeeName: `${payslipForm.firstName} ${payslipForm.lastName}`.trim(),
                      payPeriod: payslipForm.payPeriod.slice(0,7),
                      baseSalary: parsedPayslip.baseSalary,
                      allowances: parsedPayslip.allowances,
                      tax: parsedPayslip.tax,
                      ssnit: parsedPayslip.ssnit,
                      loan: parsedPayslip.loan,
                      deductions: parsedPayslip.deductions,
                      netPay: parsedPayslip.netPay,
                      createdAt: new Date().toISOString(),
                    } as Payslip;
                    downloadPayslipXLSX(temp);
                  }}>Export Excel</button>

                  <button className="px-3 py-2 border rounded" onClick={() => {
                    const temp = {
                      id: uid("p"),
                      employeeId: selectedEmployeeId === "new" ? uid("e") : selectedEmployeeId,
                      employeeName: `${payslipForm.firstName} ${payslipForm.lastName}`.trim(),
                      payPeriod: payslipForm.payPeriod.slice(0,7),
                      baseSalary: parsedPayslip.baseSalary,
                      allowances: parsedPayslip.allowances,
                      tax: parsedPayslip.tax,
                      ssnit: parsedPayslip.ssnit,
                      loan: parsedPayslip.loan,
                      deductions: parsedPayslip.deductions,
                      netPay: parsedPayslip.netPay,
                      createdAt: new Date().toISOString(),
                    } as Payslip;
                    downloadPayslipPPT(temp);
                  }}>Export PowerPoint</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} 
      {showEditModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Employee</h3>
              <button onClick={() => { setShowEditModal(false); setEditing(null); }} className="px-2 py-1 border rounded">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input value={editing.firstName} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, firstName: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input value={editing.lastName} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, lastName: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input value={editing.email} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, email: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input value={editing.phone || ""} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, phone: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input type="password" value={editing.password || ""} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, password: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Employee Type</label>
                <select value={editing.employeeType} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, employeeType: e.target.value as EmployeeType }) : ed)} className="w-full border rounded p-2 mt-1">
                  <option>National Service Personnel</option>
                  <option>Intern</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                <input value={editing.department || ""} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, department: e.target.value }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Base Salary (GHS)</label>
                <input value={(editing.baseSalary / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, baseSalary: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Allowances (GHS)</label>
                <input value={((editing.allowances || 0) / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, allowances: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tax (GHS)</label>
                <input value={(editing.tax / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, tax: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">SSNIT (GHS)</label>
                <input value={(editing.ssnit / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, ssnit: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Loan (GHS)</label>
                <input value={(editing.loan / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, loan: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Other Deductions (GHS)</label>
                <input value={(editing.deductions / 100).toFixed(2)} onChange={(e) => setEditing((ed) => ed ? ({ ...ed, deductions: Math.round(Number(e.target.value || 0) * 100) }) : ed)} className="w-full border rounded p-2 mt-1" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Preview Net Pay</div>
                <div className="text-xl font-semibold">{ghcCurrency((editing.baseSalary || 0) + (editing.allowances || 0) - ((editing.tax || 0) + (editing.ssnit || 0) + (editing.loan || 0) + (editing.deductions || 0)))}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setShowEditModal(false); setEditing(null); }} className="px-3 py-2 border rounded">Cancel</button>
                <button onClick={saveEdit} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}