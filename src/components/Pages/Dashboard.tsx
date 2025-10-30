import { BadgeCent, TrendingUp, UserCheck, Users } from "lucide-react";

function Dashboard() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Dashboard Overview</h1>
        <p className="text-[#65758b]">
          Welcome back! Here's what's happening with your workforce today
        </p>
      </div>
      <div className="flex flex-col w-full gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 justify-between w-full gap-6 sm:gap-4 md:gap-6 lg:gap-6 min-w-52 sm:min-w-52 md:min-w-64 lg:min-w-80">
          <div className="border-[1px] rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition duration-300 bg-card">
            <div className="flex justify-between items-center">
              <h1 className="text-[#65758b]">Total Employees</h1>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users size={16} color="#4f46e5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
            <div className="flex justify-between items-center">
              <h1 className="text-[#65758b]">Attendance Rate</h1>
              <div className="bg-[#10b77f1a] p-2 rounded-lg">
                <UserCheck size={16} color="#10b77f" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
            <div className="flex justify-between items-center">
              <h1 className="text-[#65758b]">Total Payroll</h1>
              <div className="bg-[#1f51c71a] p-2 rounded-lg">
                <BadgeCent size={16} color="#1f51c7" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
            <div className="flex justify-between items-center">
              <h1 className="text-[#65758b]">Growth Rate</h1>
              <div className="bg-[#f5d88a5a] p-2 rounded-lg">
                <TrendingUp size={16} color="#d1a11f" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 hover:shadow-lg transition duration-300 bg-card">
          <h1 className="font-semibold text-2xl">Recent Activity</h1>

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

        <div className="border-[1px] rounded-lg p-6 flex flex-col gap-6 hover:shadow-lg transition duration-300 bg-card">
          <h1 className="font-semibold text-2xl">Department Attendance</h1>
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
      </div>
    </main>
  );
}

export default Dashboard;
