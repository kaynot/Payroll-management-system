// src/components/Payroll.tsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  RefreshCw,
  Search,
  FileCheck,
  Trash2,
  Loader2,
  AlertCircle,
  EllipsisVertical,
  Plus,
  SquarePen,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

// ──────────────────────────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:7002/api/Payroll";
const EMPLOYEE_API = "http://localhost:7002/api/Employee/employees";
const AUTH_TOKEN = "YOUR_LATEST_JWT_TOKEN_HERE"; // ← Update this!

// ──────────────────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────────────────
interface Employee {
  id: number;
  firstName: string;
  surname: string;
  jobPosition: string;
  employmentType: string;
}

interface PayrollRecord {
  id: number;
  employeeId: number;
  employee: Employee;
  payperiod: string;
  basicSalary: number;
  allowance: number;
  tax: number;
  loan: number;
  deduction: number;
  totalDeduction: number;
  netPay: number;
  payrollStatus: "Paid" | "Pending";
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export default function Payroll() {
  const [data, setData] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState({
    totalBasicSalary: 0,
    totalAllowance: 0,
    totalDeduction: 0,
    netPayroll: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState({
    id: 0,
    employeeId: 0,
    payPeriod: new Date().toISOString().slice(0, 10),
    basicSalary: 0,
    allowance: 0,
    tax: 0,
    loan: 0,
    deduction: 0,
    payrollStatus: "Pending" as "Paid" | "Pending",
  });

  const pageSize = 10;

  // Auto calculations
  const totalDeduction = form.tax + form.loan + form.deduction;
  const netPay = form.basicSalary + form.allowance - totalDeduction;

  const formatCurrency = (n: number) =>
    `GH₵ ${n.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

  // ──────────────────────────────────────────────────────────────────────────────
  // DATA FETCHING
  // ──────────────────────────────────────────────────────────────────────────────
  const fetchPayroll = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        PageNumber: page.toString(),
        PageSize: pageSize.toString(),
      });
      if (search) params.append("SearchText", search);
      if (category !== "all") params.append("EmploymentType", category);
      if (month) {
        const [y, m] = month.split("-");
        params.append("StartDate", `${y}-${m}-01`);
        params.append("EndDate", new Date(Number(y), Number(m), 0).toISOString().split("T")[0]);
      }

      const res = await fetch(`${API_BASE}/payroll?${params}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });

      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotalRecords(json.totalRecords || 0);
    } catch {
      toast.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, month]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      if (res.ok) {
        const json = await res.json();
        setEmployees(json.data || []);
      }
    } catch (err) {
      console.error("Employees load failed");
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/Payroll%20summary`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSummary(json.data || summary);
      }
    } catch {}
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchPayroll(), fetchEmployees(), fetchSummary()]);
    setRefreshing(false);
  };

  useEffect(() => {
    refreshAll();
  }, [fetchPayroll]);

  // ──────────────────────────────────────────────────────────────────────────────
  // ADD / EDIT
  // ──────────────────────────────────────────────────────────────────────────────
  const openModal = (record?: PayrollRecord) => {
    if (record) {
      setIsEdit(true);
      setForm({
        id: record.id,
        employeeId: record.employeeId,
        payPeriod: record.payperiod.slice(0, 10),
        basicSalary: record.basicSalary,
        allowance: record.allowance,
        tax: record.tax,
        loan: record.loan,
        deduction: record.deduction,
        payrollStatus: record.payrollStatus,
      });
    } else {
      setIsEdit(false);
      setForm({
        id: 0,
        employeeId: 0,
        payPeriod: new Date().toISOString().slice(0, 10),
        basicSalary: 0,
        allowance: 0,
        tax: 0,
        loan: 0,
        deduction: 0,
        payrollStatus: "Pending",
      });
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.employeeId) return toast.error("Please select an employee");
    if (form.basicSalary <= 0) return toast.error("Basic salary is required");

    setSaving(true);
    try {
      const payload = {
        employeeId: form.employeeId,
        payPeriod: `${form.payPeriod}T00:00:00Z`,
        basicSalary: form.basicSalary,
        allowance: form.allowance,
        tax: form.tax,
        loan: form.loan,
        deduction: form.deduction,
        totalDeduction,
        netPay,
        payrollStatus: form.payrollStatus,
        paidDate: form.payrollStatus === "Paid" ? new Date().toISOString() : null,
      };

      const url = isEdit ? `${API_BASE}/payroll/${form.id}` : `${API_BASE}/payroll`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text() || "Save failed");

      toast.success(isEdit ? "Payroll updated!" : "Payroll added successfully!");
      setFormOpen(false);
      refreshAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // PAYSLIP GENERATION (FULLY WORKING)
  // ──────────────────────────────────────────────────────────────────────────────
  const generatePayslip = async (record: PayrollRecord) => {
    try {
      const res = await fetch(`${API_BASE}/payslip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          id: record.id,
          employeeId: record.employeeId,
          firstName: record.employee.firstName,
          surname: record.employee.surname,
          payPeriod: record.payperiod,
          basicSalary: record.basicSalary,
          allowance: record.allowance,
          tax: record.tax,
          loan: record.loan,
          deduction: record.deduction,
          totalDeduction: record.totalDeduction,
          netPay: record.netPay,
          payrollStatus: record.payrollStatus,
          payslipNumber: `PAY-${record.id}-${Date.now()}`,
        }),
      });

      if (!res.ok) throw new Error("Payslip failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${record.employee.firstName}_${record.employee.surname}_${record.payperiod.slice(0, 7)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Payslip downloaded!");
    } catch {
      toast.error("Could not generate payslip");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`${API_BASE}/payroll/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      toast.success("Record deleted");
      refreshAll();
      setDeleteOpen(false);
      setDeleteId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const monthDisplay = month
    ? new Date(month + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "All Periods";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">{totalRecords} records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={refreshAll} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Basic Salary", value: summary.totalBasicSalary },
          { label: "Allowances", value: summary.totalAllowance, color: "text-amber-600" },
          { label: "Deductions", value: summary.totalDeduction, color: "text-red-600" },
          { label: "Net Payroll", value: summary.netPayroll, color: "text-indigo-600" },
        ].map((c, i) => (
          <div key={i} className="bg-card border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color || ""}`}>
              {formatCurrency(c.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <h2 className="text-xl font-semibold">{monthDisplay}</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  className="pl-10 w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="FullTime">Full-time</SelectItem>
                  <SelectItem value="PartTime">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Basic </TableHead>
              <TableHead>Allowance</TableHead>
              <TableHead>Deduction</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.employee.firstName} {r.employee.surname}
                </TableCell>
                <TableCell>
                  {new Date(r.payperiod).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </TableCell>
                <TableCell>{formatCurrency(r.basicSalary)}</TableCell>
                <TableCell>{formatCurrency(r.allowance)}</TableCell>
                <TableCell className="text-red-600">{formatCurrency(r.totalDeduction)}</TableCell>
                <TableCell className="font-bold text-green-600">{formatCurrency(r.netPay)}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.payrollStatus === "Paid" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {r.payrollStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <EllipsisVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openModal(r)}>
                        <SquarePen className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => generatePayslip(r)}>
                        <FileCheck className="w-4 h-4 mr-2" /> Payslip
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => {
                          setDeleteId(r.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Payroll" : "Add New Payroll"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-2">
              <Label>Employee *</Label>
              <Select value={form.employeeId.toString()} onValueChange={(v) => setForm({ ...form, employeeId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                     rcx {e.firstName} {e.surname} – {e.jobPosition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pay Date *</Label>
              <Input type="date" value={form.payPeriod} onChange={(e) => setForm({ ...form, payPeriod: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Basic Salary *</Label>
              <Input type="number" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Allowance</Label>
              <Input type="number" value={form.allowance} onChange={(e) => setForm({ ...form, allowance: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Tax</Label>
              <Input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Loan</Label>
              <Input type="number" value={form.loan} onChange={(e) => setForm({ ...form, loan: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Other Deduction</Label>
              <Input type="number" value={form.deduction} onChange={(e) => setForm({ ...form, deduction: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.payrollStatus} onValueChange={(v) => setForm({ ...form, payrollStatus: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Deduction:</span>
              <strong className="text-red-600">{formatCurrency(totalDeduction)}</strong>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Net Pay:</span>
              <span className="text-green-600">{formatCurrency(netPay)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update" : "Add Payroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Payroll Record?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}