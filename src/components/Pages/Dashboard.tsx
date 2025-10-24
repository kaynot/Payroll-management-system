import { BadgeCent, TrendingUp, UserCheck, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import StackedBarChart from "./charts/barchart";
import DepartmentDonutChart from "./charts/piechart";
import { motion } from "framer-motion";

function Dashboard() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      <section className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl">Welcome back, Akosua!</h1>
        <p className="text-[#65758b]">
          Here’s a quick snapshot of today’s payroll activities and workforce
          insights
        </p>
      </section>

      {/* Analytics */}
      <section className="flex flex-col w-full gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-between w-full gap-4 sm:gap-4 md:gap-6 lg:gap-6">
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition duration-300 bg-card">
            <div className="flex justify-between">
              <h1 className="text-[#65758b]">Total Employees</h1>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users size={32} color="#4f46e5" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">248</h1>
              <div className="flex justify-start items-center gap-1">
                <TrendingUp size={12} color="#10b77f" />
                <p className="text-[12px] text-[#10b77f]">
                  +12.5% from last month
                </p>
              </div>
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition duration-300 bg-card">
            <div className="flex justify-between">
              <h1 className="text-[#65758b]">Attendance Rate</h1>
              <div className="bg-[#10b77f1a] p-2 rounded-lg">
                <UserCheck size={32} color="#10b77f" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">94.2%</h1>
              <div className="flex justify-start items-center gap-1">
                <TrendingUp size={12} color="#10b77f" />
                <p className="text-[12px] text-[#10b77f]">
                  +2.3% from last month
                </p>
              </div>
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition duration-300 bg-card">
            <div className="flex justify-between">
              <h1 className="text-[#65758b]">Total Payroll</h1>
              <div className="bg-[#1f51c71a] p-2 rounded-lg">
                <BadgeCent size={32} color="#1f51c7" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">GH₵ 485K</h1>
              <div className="flex justify-start items-center gap-1">
                <TrendingUp size={12} color="#10b77f" />
                <p className="text-[12px] text-[#10b77f]">
                  +8.1% from last month
                </p>
              </div>
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition duration-300 bg-card">
            <div className="flex justify-between">
              <h1 className="text-[#65758b]">Growth Rate</h1>
              <div className="bg-[#f5d88a5a] p-2 rounded-lg">
                <TrendingUp size={32} color="#d1a11f" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">15.3%</h1>
              <div className="flex justify-start items-center gap-1">
                <TrendingUp size={12} color="#10b77f" />
                <p className="text-[12px] text-[#10b77f]">
                  +3.2% from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* charts: Payroll trends, Department Distribution  */}
      <section className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 md:gap-6 lg:gap-6 w-full">
        <div className="border-[1px] rounded-lg p-6 flex flex-col justify-start items-center gap-6 bg-card w-[full]">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col text-sm gap-2">
              <h3 className="font-medium text-lg">Payroll Trends</h3>
              <p className=" text-[#65758b]">Monthly payroll expenses</p>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1-month</SelectItem>
                  <SelectItem value="3-months">3-months</SelectItem>
                  <SelectItem value="6-months">6-months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full mt-4">
            <StackedBarChart />
          </div>
        </div>

        <div className="border-[1px] rounded-lg p-6 flex flex-col justify-start items-center gap-6 bg-card w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col text-sm gap-2">
              <h3 className="font-medium text-lg">Department Distribution</h3>
              <p className=" text-[#65758b]">Salary breakdown by department</p>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">All Depts</SelectItem>
                  <SelectItem value="3-months">Engineering</SelectItem>
                  <SelectItem value="6-months">HR</SelectItem>
                  <SelectItem value="1-month">Marketing</SelectItem>
                  <SelectItem value="3-months">Operations</SelectItem>
                  <SelectItem value="6-months">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <DepartmentDonutChart />
          </div>
        </div>
      </section>

      {/* recent activity, department attendance, pending actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-6">
        {/* department attendance  */}
        <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 hover:shadow-lg transition duration-300 bg-card">
          <h1 className="font-medium text-lg">Department Attendance</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Engineering</p>
                  <p className="text-muted-foreground">45 employees • 65%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[65%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Finance</p>
                  <p className="text-muted-foreground">28 employees • 25%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[25%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>HR</p>
                  <p className="text-muted-foreground">15 employees • 95%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[95%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Operations</p>
                  <p className="text-muted-foreground">38 employees • 70%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[70%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Marketing</p>
                  <p className="text-muted-foreground">22 employees • 80%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[80%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Marketing</p>
                  <p className="text-muted-foreground">22 employees • 80%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[80%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <p>Marketing</p>
                  <p className="text-muted-foreground">22 employees • 80%</p>
                </div>
              </div>
              <div className="bg-muted w-[100%] rounded">
                <div className="bg-gradient-to-r from-primary to-secondary w-[80%] h-2 rounded-full transition duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* pending actions */}
        <div className="border-[1px] border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-lg p-6 flex flex-col gap-6 hover:shadow-lg transition duration-300 bg-card">
          <h1 className="font-medium text-lg">Pending Actions</h1>

          <div className="flex flex-col justify-between h-full gap-8">
            <div className="flex flex-col gap-2">
              <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex gap-2">
                <input
                  type="checkbox"
                  name="approve"
                  id="approve"
                  className="bg-primary"
                />
                <p>Approve overtime requests</p>
              </div>
              <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex gap-2">
                <input type="checkbox" name="review" id="review" />
                <p>Review tax deductions</p>
              </div>
              <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex gap-2">
                <input type="checkbox" name="confirm" id="confirm" />
                <del>Confirm next pay date</del>
              </div>
              <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex gap-2">
                <input type="checkbox" name="update" id="update" />
                <p>Update salary templates</p>
              </div>
            </div>

            <button className="bg-primary font-semibold text-white py-2 w-full rounded-full hover:bg-primary/95">
              Add new reminder
            </button>
          </div>
        </div>

        {/* recent activity */}
        <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 hover:shadow-lg transition duration-300 bg-card">
          <h1 className="font-medium text-lg">Recent Activity</h1>

          <div className="flex flex-col justify-start gap-4">
            <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h1 className="font-medium">John Mensah</h1>
                <h3 className="text-sm">8:45 AM</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#65758b]">Check In</p>
                <p className="text-sm bg-[#10b77f1a] text-[#10b77f] px-2 py-1 rounded-full">
                  success
                </p>
              </div>
            </div>
            <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h1 className="font-medium">John Mensah</h1>
                <h3 className="text-sm">8:45 AM</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#65758b]">Payslip Generated</p>
                <p className="text-sm bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                  info
                </p>
              </div>
            </div>
            <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h1 className="font-medium">John Mensah</h1>
                <h3 className="text-sm">8:45 AM</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#65758b]">Leave Request</p>
                <p className="text-sm bg-[#f29d0e22] text-[#f29d0e] px-2 py-1 rounded-full">
                  warning
                </p>
              </div>
            </div>
            <div className="bg-[#f1f5f980] rounded-lg px-4 py-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h1 className="font-medium">John Mensah</h1>
                <h3 className="text-sm">8:45 AM</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#65758b]">Check Out</p>
                <p className="text-sm bg-[#10b77f1a] text-[#10b77f] px-2 py-1 rounded-full">
                  success
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

export default Dashboard;
