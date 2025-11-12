import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Clock, UserCheck, UserX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCrudFunc } from "../hooks/crud";

interface Employee {
  id: number;
  fullName: string;
  department: string;
  status: "in" | "out";
  lastCheckIn: string | null;
  lastCheckOut: string | null;
}

const CheckInOut = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [get, put] = useCrudFunc();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 🔍 Search employee by ID or name
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an employee name or ID");
      return;
    }

    setIsSearching(true);
    try {
      // Fetch from backend API
      const response = await get(
        `Employee/employee?SearchText=${searchQuery}`,
        null
      );

      if (response?.data?.data && response.data.data.length > 0) {
        const emp = response.data.data[0]; // take the first match
        const employee: Employee = {
          id: emp.id,
          fullName: emp.fullName || emp.name,
          department: emp.department || "N/A",
          status: "out", // default until checked in
          lastCheckIn: null,
          lastCheckOut: null,
        };
        setFoundEmployee(employee);
        toast.success("Employee found!");
      } else {
        toast.error("No employee found with that name or ID");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching employee");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle check-in / check-out
  const handleCheckInOut = async () => {
    if (!foundEmployee) return;
    setIsProcessing(true);

    try {
      const isCheckingIn = foundEmployee.status === "out";

      // Send PUT request to your backend
      const response = await put("Attendance/checkin", {
        employeeId: foundEmployee.id,
      });

      if (response?.status === 200 || response?.data?.statusCode === 200) {
        const timestamp = new Date().toLocaleString();
        const updatedEmployee: Employee = {
          ...(foundEmployee as Employee),
          status: (isCheckingIn ? "in" : "out") as "in" | "out",
          lastCheckIn: isCheckingIn
            ? timestamp
            : (foundEmployee as Employee).lastCheckIn,
          lastCheckOut: !isCheckingIn
            ? timestamp
            : (foundEmployee as Employee).lastCheckOut,
        };
        setFoundEmployee(updatedEmployee);

        toast.success(
          isCheckingIn
            ? "Checked in successfully!"
            : "Checked out successfully!"
        );
      } else {
        toast.error("Attendance update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error during check-in/out");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-44 -translate-x-24 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl animate-pulse delay-75" />
        <div className="absolute -bottom-44 translate-x-24 right-10 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-3xl animate-pulse delay-75" />
      </div>

      <div className="z-10 text-center mb-10 animate-fade-in">
        <p className="text-sm text-gray-400 mb-2 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {formatDate(currentTime)}
        </p>
        <p className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          {formatTime(currentTime)}
        </p>
      </div>

      <div className="relative w-full max-w-2xl z-10">
        <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:border-white/25">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Attendance Portal
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Search your name or ID to mark your attendance
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Enter name or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              className="h-12 bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-500 text-base text-gray-100 placeholder:text-gray-500 px-4"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="h-12 px-6 text-sm font-semibold bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 transition-all duration-300 gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {foundEmployee && (
            <div className="animate-fade-in space-y-6">
              <div className="h-px bg-white/10" />
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Employee Name
                    </p>
                    <p className="text-xl text-cyan-500 font-semibold">
                      {foundEmployee.fullName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Employee ID
                      </p>
                      <p className="text-cyan-500">{foundEmployee.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Department
                      </p>
                      <p className="text-cyan-500">
                        {foundEmployee.department}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {foundEmployee.status === "in" ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 gap-1.5 px-3 py-1.5 text-sm">
                      <UserCheck className="h-3.5 w-3.5" />
                      Checked In
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 gap-1.5 px-3 py-1.5 text-sm">
                      <UserX className="h-3.5 w-3.5" />
                      Not Checked In
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Last Check-In</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {foundEmployee.lastCheckIn || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Last Check-Out</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {foundEmployee.lastCheckOut || "—"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCheckInOut}
                disabled={isProcessing}
                size="lg"
                className={`w-full h-14 text-lg font-semibold gap-2 transition-all duration-300 ${
                  foundEmployee.status === "in"
                    ? "bg-gradient-to-r from-rose-600 to-rose-400 hover:opacity-90"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : foundEmployee.status === "in" ? (
                  <>
                    <UserX className="h-5 w-5" /> Check Out
                  </>
                ) : (
                  <>
                    <UserCheck className="h-5 w-5" /> Check In
                  </>
                )}
              </Button>
            </div>
          )}

          {!foundEmployee && !isSearching && (
            <div className="text-center py-12 text-gray-500 animate-fade-in">
              <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">
                Start by searching your name or ID
              </p>
              <p className="text-sm mt-2 text-gray-400">
                and mark your attendance instantly
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Having issues? Contact{" "}
          <span className="text-cyan-400 font-medium">
            <a href="mailto:info@innorik.com">info@innorik.com</a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckInOut;
