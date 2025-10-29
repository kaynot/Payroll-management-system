import { motion } from "framer-motion";
import {
  CalendarDays,
  Download,
  FileText,
  Save,
  ScrollText,
  TrendingUp,
} from "lucide-react";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Reports() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      <section className="flex gap-4 justify-between items-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-3xl">Reports</h1>
          <p className="text-[#65758b]">
            Manage employee records and information
          </p>
        </div>
      </section>
      <section className="flex flex-col w-full gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-between w-full gap-4 sm:gap-4 md:gap-6 lg:gap-6">
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 justify-between shadow-sm transition duration-300 bg-card">
            <div className="flex flex-col gap-3">
              <FileText size={32} color="#173ae8" />
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Monthly Payroll Report</h3>
                <p className="text-sm text-muted-foreground">
                  Complete payroll breakdown for the month
                </p>
              </div>
            </div>
            <button className="bg-background border border-input rounded-md h-9 p-3 w-full flex justify-center items-center gap-2 hover:bg-accent hover:text-accent-foreground transition">
              <Download size={16} />
              <p className="text-sm">Generate</p>
            </button>
          </div>

          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 justify-between shadow-sm transition duration-300 bg-card">
            <div className="flex flex-col gap-3">
              <CalendarDays size={32} color="#027e21" />
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Attendance Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Employee attendance statistics
                </p>
              </div>
            </div>
            <button className="bg-background border border-input rounded-md h-9 p-3 w-full flex justify-center items-center gap-2 hover:bg-accent hover:text-accent-foreground transition">
              <Download size={16} />
              <p className="text-sm">Generate</p>
            </button>
          </div>

          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 justify-between shadow-sm transition duration-300 bg-card">
            <div className="flex flex-col gap-3">
              <TrendingUp size={32} color="#0247b6" />
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Department Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Deparment-wise performance metrics
                </p>
              </div>
            </div>
            <button className="bg-background border border-input rounded-md h-9 p-3 w-full flex justify-center items-center gap-2 hover:bg-accent hover:text-accent-foreground transition">
              <Download size={16} />
              <p className="text-sm">Generate</p>
            </button>
          </div>

          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 justify-between shadow-sm transition duration-300 bg-card">
            <div className="flex flex-col gap-3">
              <ScrollText size={32} color="#d66a05" />
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Tax & SSNIT Report</h3>
                <p className="text-sm text-muted-foreground">
                  Statutory deductions report
                </p>
              </div>
            </div>
            <button className="bg-background border border-input rounded-md h-9 p-3 w-full flex justify-center items-center gap-2 hover:bg-accent hover:text-accent-foreground transition">
              <Download size={16} />
              <p className="text-sm">Generate</p>
            </button>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full gap-8">
        <div className="border rounded-lg p-6 flex flex-col gap-8 justify-between shadow-sm transition duration-300 bg-card">
          {/* Header Section */}
          <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full">
            <h1 className="font-bold text-2xl sm:text-3xl sm:text-left">
              Generate Custom Report
            </h1>

            {/* Hide button on mobile, show on larger screens */}
            <button className="hidden sm:flex bg-primary px-4 py-2 rounded-md text-primary-foreground items-center justify-center gap-2 text-sm w-40">
              <Download size={16} color="#fff" />
              Export Report
            </button>
          </section>

          {/* Form Section */}
          <div className="grid flex-col gap-6 grid-cols-1">
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-3 lg:gap-4">
              {/* Report Type */}
              <div className="flex flex-col gap-2">
                <label htmlFor="report-type" className="text-sm font-semibold">
                  Report Type
                </label>
                <div>
                  <Select name="report-type">
                    <SelectTrigger
                      id="report-type"
                      className="w-full border rounded-md px-3 py-2 h-10 text-sm"
                    >
                      <SelectValue placeholder="select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payroll-report">
                        Payroll Report
                      </SelectItem>
                      <SelectItem value="attendance-report">
                        Attendance Report
                      </SelectItem>
                      <SelectItem value="hr-report">HR Report</SelectItem>
                      <SelectItem value="tax-report">Tax Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label htmlFor="department" className="text-sm font-semibold">
                  Department
                </label>
                <div>
                  <Select name="department">
                    <SelectTrigger
                      id="department"
                      className="w-full border rounded-md px-3 py-2 h-10 text-sm"
                    >
                      <SelectValue placeholder="select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-dept">All Departments</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Period */}
              <div className="flex flex-col gap-2">
                <label htmlFor="period" className="text-sm font-semibold">
                  Period
                </label>
                <div className="relative">
                  <input
                    type="month"
                    id="period"
                    name="period"
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                  />
                  {/* Custom calendar icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 lg:gap-4">
              <div className="border rounded-md p-6 flex flex-col gap-2 justify-start">
                <h6 className="text-sm text-muted-foreground font-medium">
                  Total Records
                </h6>
                <p className="text-2xl font-medium">1,247</p>
              </div>

              <div className="border rounded-md p-6 flex flex-col gap-2 justify-start">
                <h6 className="text-sm text-muted-foreground font-medium">
                  Date Range
                </h6>
                <p className="text-2xl font-medium">30 days</p>
              </div>

              <div className="border rounded-md p-6 flex flex-col gap-2 justify-start">
                <h6 className="text-sm text-muted-foreground font-medium">
                  Export Format
                </h6>
                <Select>
                  <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
                    <SelectValue placeholder="select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Show button only on mobile (below the form) */}
            <div className="flex sm:hidden">
              <button className="bg-primary w-full px-4 py-2 rounded-md text-primary-foreground flex items-center justify-center gap-2 text-sm">
                <Download size={16} color="#fff" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
