import { motion } from "framer-motion";
import {
  Download,
  EllipsisVertical,
  Eye,
  FileText,
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

export const Payroll = () => {
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
        {[
          {
            title: "Total Basic Salary",
            value: "GH₵ 11,800",
            desc: "This month",
            color: "text-black",
          },
          {
            title: "Total Allowances",
            value: "GH₵ 1,400",
            desc: "Additional payments",
            color: "text-amber-500",
          },
          {
            title: "Total Deductions",
            value: "GH₵ 1,356",
            desc: "Tax + SSNIT",
            color: "text-red-500",
          },
          {
            title: "Net Payroll",
            value: "GH₵ 11,844",
            desc: "Total payout",
            color: "text-indigo-500",
          },
        ].map((item, i) => (
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
      <section className="bg-card border p-6 rounded-lg flex flex-col justify-between gap-8 lg:min-h-[630px]">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium sm:text-sm md:text-lg lg:text-xl">
              January 2025 Payroll
            </h1>
            <div className="bg-muted/30 border py-1 px-4 rounded-full text-sm flex gap-4 items-center w-[30%]">
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                name="search-emp"
                id="search-emp"
                placeholder="Search by name, ID, or department..."
                className="bg-muted/5 text-muted-foreground text-sm outline-none w-full"
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                  <SelectItem value="nss">NSS Personnel</SelectItem>
                  <SelectItem value="interns">Interns</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              <div className="border border-border rounded-full">
                <input
                  type="month"
                  name="month"
                  id="month"
                  className="px-4 py-1 rounded-full text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Base Salary
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Allowances
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Deductions
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Net Salary
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Paid
                  </th>
                  <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="border-0">
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
                    <p className="py-1 px-4 rounded-full text-xs border font-medium bg-green-200 text-green-800 border-green-600">
                      Paid
                    </p>
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
                    <p className="py-1 px-4 rounded-full text-xs border font-medium bg-blue-200 text-blue-800 border-blue-600">
                      Pending
                    </p>
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
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </motion.main>
  );
};

export default Payroll;
