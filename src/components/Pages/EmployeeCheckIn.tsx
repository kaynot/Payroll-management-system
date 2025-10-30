import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "./../ui/badge";
import { Search, Clock, UserCheck, UserX, Loader2 } from "lucide-react";
import { toast } from "sonner";

// sample employee data
interface Employee {
  id: string;
  name: string;
  department: string;
  status: "in" | "out";
  lastCheckIn: string | null;
  lastCheckOut: string | null;
}

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Kwame Mensah",
    department: "IT",
    status: "out",
    lastCheckIn: null,
    lastCheckOut: null,
  },
  {
    id: "EMP002",
    name: "Ama Adjei",
    department: "HR",
    status: "out",
    lastCheckIn: null,
    lastCheckOut: null,
  },
  {
    id: "EMP003",
    name: "Kofi Asante",
    department: "Finance",
    status: "out",
    lastCheckIn: null,
    lastCheckOut: null,
  },
  {
    id: "EMP004",
    name: "Abena Osei",
    department: "IT",
    status: "out",
    lastCheckIn: null,
    lastCheckOut: null,
  },
  {
    id: "EMP005",
    name: "Yaw Boateng",
    department: "Operations",
    status: "out",
    lastCheckIn: null,
    lastCheckOut: null,
  },
];

const CheckInOut = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an employee name or ID");
      return;
    }

    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const employee = mockEmployees.find(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase() === searchQuery.toLowerCase()
    );

    if (employee) {
      setFoundEmployee(employee as Employee);
      toast.success("Employee found!");
    } else {
      setFoundEmployee(null);
      toast.error("Employee not found. Please check the name or ID.");
    }

    setIsSearching(false);
  };

  const handleCheckInOut = async () => {
    if (!foundEmployee) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const timestamp = new Date().toLocaleString();
    const isCheckingIn = foundEmployee.status === "out";

    const updatedEmployee = {
      ...foundEmployee,
      status: isCheckingIn ? "in" : "out",
      lastCheckIn: isCheckingIn ? timestamp : foundEmployee.lastCheckIn,
      lastCheckOut: !isCheckingIn ? timestamp : foundEmployee.lastCheckOut,
    } as Employee;

    setFoundEmployee(updatedEmployee);

    // Update mock data (in real app, this would update the database)
    const index = mockEmployees.findIndex((emp) => emp.id === foundEmployee.id);
    if (index !== -1) {
      mockEmployees[index] = updatedEmployee;
    }

    toast.success(
      isCheckingIn
        ? `✓ Checked in successfully at ${formatTime(new Date())}`
        : `✓ Checked out successfully at ${formatTime(new Date())}`,
      {
        duration: 4000,
      }
    );

    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      {/* Time Display */}
      <div className="z-10 text-center mb-10 animate-fade-in">
        <p className="text-sm text-gray-400 mb-2 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {formatDate(currentTime)}
        </p>
        <p className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          {formatTime(currentTime)}
        </p>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-2xl z-10">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:bg-white/15 hover:border-white/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Employee Attendance Portal
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Search your name or ID to mark your attendance
            </p>
          </div>

          {/* Search Section */}
          <div className="flex gap-2 mb-6">
            <Input
              name="mark-attendance"
              id="mark-attendance"
              type="text"
              placeholder="Enter name or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-500 text-base text-gray-100 placeholder:text-gray-500"
              disabled={isSearching}
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

          {/* Employee Found Section */}
          {foundEmployee && (
            <div className="animate-fade-in space-y-6">
              <div className="h-px bg-white/10" />
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Employee Name
                    </p>
                    <p className="text-xl font-semibold">
                      {foundEmployee.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Employee ID
                      </p>
                      <p>{foundEmployee.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Department
                      </p>
                      <p>{foundEmployee.department}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
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

              {/* Last Check-In/Out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Check-In</p>
                  <p className="text-sm font-medium">
                    {foundEmployee.lastCheckIn || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Check-Out</p>
                  <p className="text-sm font-medium">
                    {foundEmployee.lastCheckOut || "—"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
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

          {/* Default Message */}
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

        {/* Footer Help Text */}
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
