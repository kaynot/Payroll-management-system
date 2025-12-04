import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  EllipsisVertical,
  Eye,
  FileText,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useCrudFunc } from "../../components/hooks/crud";

export const Payroll = () => {
  type PayrollStatus =
    | "pending"
    | "approved"
    | "processing"
    | "paid"
    | "on_hold"
    | "failed";

  const statusStyles: Record<PayrollStatus, string> = {
    pending: "bg-blue-200 text-blue-800 border-blue-600",
    approved: "bg-amber-200 text-amber-800 border-amber-600",
    processing: "bg-purple-200 text-purple-800 border-purple-600",
    paid: "bg-green-200 text-green-800 border-green-600",
    on_hold: "bg-gray-200 text-gray-800 border-gray-600",
    failed: "bg-red-200 text-red-800 border-red-600",
  };

  const StatusBadge = ({ status }: { status: PayrollStatus }) => (
    <p
      className={`py-1 px-4 rounded-full text-xs border font-medium capitalize ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </p>
  );

  // --- Payroll Summary State ---
  const [postData, updateData, patchData, fetchData, deleteData] =
    useCrudFunc();
  const [summary, setSummary] = useState<{
    totalBasicSalary: number;
    totalAllowance: number;
    totalDeduction: number;
    netPayroll: number;
  } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const getSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetchData("Payroll/Payroll%20summary");
        setSummary(res.data.data);
      } catch (err: any) {
        setSummaryError(err.message || "Failed to fetch payroll summary");
      } finally {
        setLoadingSummary(false);
      }
    };
    getSummary();
  }, [fetchData]);

  // --- Summary Cards ---
  const summaryCards = [
    {
      title: "Total Basic Salary",
      value: summary ? `GH₵ ${summary.totalBasicSalary}` : "Loading...",
      desc: "This month",
      color: "text-black",
    },
    {
      title: "Total Allowances",
      value: summary ? `GH₵ ${summary.totalAllowance}` : "Loading...",
      desc: "Additional payments",
      color: "text-amber-500",
    },
    {
      title: "Total Deductions",
      value: summary ? `GH₵ ${summary.totalDeduction}` : "Loading...",
      desc: "Tax + SSNIT",
      color: "text-red-500",
    },
    {
      title: "Net Payroll",
      value: summary ? `GH₵ ${summary.netPayroll}` : "Loading...",
      desc: "Total payout",
      color: "text-indigo-500",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col "
    >
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-500">Manage payroll and generate payslips</p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button className="px-4 py-2 flex items-center gap-2 border rounded-md text-sm hover:bg-primary/90 transition duration-300 hover:text-white">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition duration-300">
            <FileText className="w-4 h-4" />
            <span>Generate Payslips</span>
          </button>
        </div>
      </section>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-xl shadow-sm border p-4 hover:shadow-md transition"
          >
            <h3 className="text-gray-600 font-medium mb-1">{item.title}</h3>
            <p className={`text-3xl font-semibold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col gap-6">
        {/* Header + Auto-fill */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            January 2025 Payroll
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4" />
              Add Payroll
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* department */}
          <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Search */}
          <div className="flex items-center w-full sm:w-1/2">
            <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[100%]">
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search by name"
                className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
              />
            </div>
          </div>

          {/* statuses */}
          <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="h-[55vh] overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow">
              <tr className="text-left text-gray-600 font-medium">
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Category</th>
                <th className="p-3">Base Salary</th>
                <th className="p-3">Allowances</th>
                <th className="p-3 text-center">Deductions</th>
                <th className="p-3 text-center">Net Salary</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b transition-colors hover:bg-muted/40">
                <td className="p-4 font-semibold">Kwame Mensah</td>
                <td className="p-4">Mobile App Dev</td>
                <td className="p-4 flex justify-start">
                  <p className="bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium">
                    Full-time
                  </p>
                </td>
                <td className="p-4">GH₵ 3,500</td>
                <td className="p-4">GH₵ 500</td>
                <td className="p-4">GH₵ 420</td>
                <td className="p-4">GH₵ 3,580</td>
                <td className="p-4 flex justify-center">
                  <StatusBadge status="paid" />
                </td>

                <td className="p-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:bg-primary hover:rounded-md hover:text-primary-foreground transition p-1">
                        <EllipsisVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye /> View Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SquarePen /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/40">
                <td className="p-4 font-semibold">Kwaku Opoku</td>
                <td className="p-4">Dev Opps Engineer</td>
                <td className="p-4 flex justify-start">
                  <p className="bg-emerald-100 py-1 px-4 rounded-full text-xs text-emerald-600 border border-emerald-600 font-medium">
                    Full-time
                  </p>
                </td>
                <td className="p-4">GH₵ 3,500</td>
                <td className="p-4">GH₵ 500</td>
                <td className="p-4">GH₵ 420</td>
                <td className="p-4">GH₵ 3,580</td>
                <td className="p-4 flex justify-center">
                  <StatusBadge status="pending" />
                </td>

                <td className="p-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:bg-primary hover:rounded-md hover:text-primary-foreground transition p-1">
                        <EllipsisVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye /> View Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SquarePen /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink></PaginationLink>
              </PaginationItem>
              <PaginationItem key={`ellipsis-${Math.random()}`}>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </motion.main>
  );
};

export default Payroll;
