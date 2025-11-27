import { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Clock, UserCheck, UserX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCrudFunc } from "../hooks/crud";
import { useAttendance } from "../hooks/useAttendance";

interface Employee {
  id: number;
  fullName: string;
  jobPosition: string;
  status: "in" | "out";
  lastCheckIn: string | null;
  lastCheckOut: string | null;
}

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

const parseTimestamp = (response: any, isCheckingIn: boolean) =>
  response.data.data?.timestamp ||
  (isCheckingIn
    ? response.data.data?.checkInTime
    : response.data.data?.checkOutTime) ||
  new Date().toISOString();

const EmployeeBadge = ({ status }: { status: "in" | "out" }) =>
  status === "in" ? (
    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 gap-1.5 px-3 py-1.5 text-sm">
      <UserCheck className="h-3.5 w-3.5" />
      Checked In
    </Badge>
  ) : (
    <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 gap-1.5 px-3 py-1.5 text-sm">
      <UserX className="h-3.5 w-3.5" />
      Not Checked In
    </Badge>
  );
// maion component
const CheckInOut = () => {
  // state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
  const [remainingTime, setRemainingTime] = useState(0);

  const { checkIn, checkOut } = useAttendance();
  const [postData, updateData, patchData, fetchData] = useCrudFunc();
  const [employeeMap, setEmployeeMap] = useState<Record<number, Employee>>({});

  // localstorage helpers
  const setCooldownExpiry = (employeeId: number, expiry: number) => {
    setCooldowns((prev) => ({ ...prev, [employeeId]: expiry }));
    const stored = JSON.parse(
      localStorage.getItem("attendanceCooldowns") || "{}"
    );
    stored[employeeId] = expiry;
    localStorage.setItem("attendanceCooldowns", JSON.stringify(stored));
  };

  const getCooldownExpiry = (employeeId: number): number =>
    cooldowns[employeeId] || 0;

  // Save timestamps for a specific employee
  const setEmployeeTimestamps = (employee: Employee) => {
    const stored = JSON.parse(
      localStorage.getItem("employeeTimestamps") || "{}"
    );
    stored[employee.id] = {
      lastCheckIn: employee.lastCheckIn,
      lastCheckOut: employee.lastCheckOut,
    };
    localStorage.setItem("employeeTimestamps", JSON.stringify(stored));
  };

  // Get timestamps for a specific employee
  const getEmployeeTimestamps = (employeeId: number) => {
    const stored = JSON.parse(
      localStorage.getItem("employeeTimestamps") || "{}"
    );
    return stored[employeeId] || { lastCheckIn: null, lastCheckOut: null };
  };

  // initialize employee map form localstorage
  useEffect(() => {
    const storedTimestamps = JSON.parse(
      localStorage.getItem("employeeTimestamps") || "{}"
    );

    const initialMap: Record<number, Employee> = {};
    Object.keys(storedTimestamps).forEach((idStr) => {
      const id = Number(idStr);
      const { lastCheckIn, lastCheckOut } = storedTimestamps[id];
      initialMap[id] = {
        id,
        fullName: "",
        jobPosition: "N/A",
        status: lastCheckIn ? "in" : "out",
        lastCheckIn,
        lastCheckOut,
      };
    });

    setEmployeeMap(initialMap);
  }, []);

  //initialize cooldowns
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("attendanceCooldowns") || "{}"
    );
    setCooldowns(stored);
  }, []);

  // current time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // remaining time
  useEffect(() => {
    if (!foundEmployee) return setRemainingTime(0);

    const updateRemainingTime = () => {
      const expiry = getCooldownExpiry(foundEmployee.id);
      setRemainingTime(Math.max(0, Math.ceil((expiry - Date.now()) / 1000)));
    };

    updateRemainingTime(); // init immediately
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [foundEmployee, cooldowns]);

  // reset after midnight
  useEffect(() => {
    const resetAttendance = () => {
      // Reset local state
      setEmployeeMap({});
      setCooldowns({});
      setSearchResults([]);
      setFoundEmployee(null);

      // Clear localStorage
      localStorage.removeItem("employeeTimestamps");
      localStorage.removeItem("attendanceCooldowns");

      // Schedule next reset at next midnight
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      );
      const msUntilNextMidnight = nextMidnight.getTime() - now.getTime();
      setTimeout(resetAttendance, msUntilNextMidnight);
    };

    // Initial schedule
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    const timer = setTimeout(resetAttendance, msUntilMidnight);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  // -------------------- SEARCH --------------------
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an employee name or ID");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetchData(
        `Employee/employee?SearchText=${searchQuery}`,
        null
      );

      const results = response?.data?.data || [];

      if (results.length > 0) {
        const employees: Employee[] = results.map((emp: any) => {
          const persisted =
            employeeMap[emp.id] || getEmployeeTimestamps(emp.id);
          return {
            id: emp.id,
            fullName: emp.fullName || emp.name,
            jobPosition: emp.jobPosition || "N/A",
            status: persisted.lastCheckIn ? "in" : emp.status || "out",
            lastCheckIn: persisted.lastCheckIn || emp.lastCheckIn || null,
            lastCheckOut: persisted.lastCheckOut || emp.lastCheckOut || null,
          };
        });

        setSearchResults(employees);

        // Update employeeMap
        const newMap = { ...employeeMap };
        employees.forEach((emp) => {
          newMap[emp.id] = emp;
        });
        setEmployeeMap(newMap);

        // Select first employee
        setFoundEmployee(employees[0]);

        toast.success(`${employees.length} employee(s) found!`);
      } else {
        setSearchResults([]);
        setFoundEmployee(null);
        toast.error("No employee found with that name or ID");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching employee");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // -------------------- CHECK-IN / CHECK-OUT --------------------
  const handleCheckInOut = async () => {
    if (!foundEmployee || isProcessing) return;

    const now = Date.now();
    const expiry = getCooldownExpiry(foundEmployee.id);

    if (now < expiry) {
      toast.error(
        `Please wait ${Math.ceil((expiry - now) / 1000)}s before next action`
      );
      return;
    }

    setIsProcessing(true);
    try {
      const isCheckingIn = foundEmployee.status === "out";

      const response = isCheckingIn
        ? await checkIn({ employeeId: foundEmployee.id })
        : await checkOut({ employeeId: foundEmployee.id });

      const ok =
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201 ||
        typeof response?.data === "number" ||
        typeof response === "number";

      if (ok) {
        const timestamp = parseTimestamp(response, isCheckingIn);
        const timestampStr =
          typeof timestamp === "string" ? timestamp : timestamp.toISOString();

        const updatedEmployee: Employee = {
          ...foundEmployee,
          status: isCheckingIn ? "in" : "out",
          lastCheckIn: isCheckingIn ? timestampStr : foundEmployee.lastCheckIn,
          lastCheckOut: !isCheckingIn
            ? timestampStr
            : foundEmployee.lastCheckOut,
        };

        setFoundEmployee(updatedEmployee);
        setEmployeeMap((prev) => ({
          ...prev,
          [updatedEmployee.id]: updatedEmployee,
        }));
        setEmployeeTimestamps(updatedEmployee);

        toast.success(
          isCheckingIn
            ? "Checked in successfully!"
            : "Checked out successfully!"
        );

        setCooldownExpiry(foundEmployee.id, now + 1 * 60 * 1000);
      }
    } catch (err: any) {
      console.error(err);

      // Handle Axios errors
      if (err.response) {
        if (err.response.status === 409) {
          // Employee already checked in/out
          const isCheckingIn = foundEmployee.status === "out";

          // Update timestamps from server response if available
          const timestamp = parseTimestamp(err.response, isCheckingIn);
          const timestampStr =
            typeof timestamp === "string" ? timestamp : timestamp.toISOString();

          const updatedEmployee: Employee = {
            ...foundEmployee,
            status: isCheckingIn ? "in" : "out",
            lastCheckIn: isCheckingIn
              ? timestampStr
              : foundEmployee.lastCheckIn,
            lastCheckOut: !isCheckingIn
              ? timestampStr
              : foundEmployee.lastCheckOut,
          };

          setFoundEmployee(updatedEmployee);
          setEmployeeMap((prev) => ({
            ...prev,
            [updatedEmployee.id]: updatedEmployee,
          }));
          setEmployeeTimestamps(updatedEmployee);

          // Show explicit message
          toast.error(
            isCheckingIn
              ? "Employee has already checked in!"
              : "Employee has already checked out!"
          );

          // set a short cooldown to prevent spamming
          setCooldownExpiry(foundEmployee.id, now + 10 * 1000); // 10 seconds
        } else {
          toast.error(err.response.data?.message || "Attendance update failed");
        }
      } else {
        toast.error("Network or server error during check-in/out");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------- MEMOIZED DROPDOWN OPTIONS --------------------
  const employeeOptions = useMemo(
    () =>
      searchResults.map((emp) => (
        <option
          key={emp.id}
          value={emp.id}
          className="bg-gray-600 text-gray-100"
        >
          {emp.fullName} ({emp.jobPosition})
        </option>
      )),
    [searchResults]
  );

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-44 -translate-x-24 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl animate-pulse delay-75" />
        <div className="absolute -bottom-44 translate-x-24 right-10 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-3xl animate-pulse delay-75" />
      </div>

      {/* TIME DISPLAY */}
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
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Attendance Portal
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Search your name or ID to mark your attendance
            </p>
          </div>

          {/* SEARCH */}
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

          {/* MULTIPLE RESULTS DROPDOWN */}
          {searchResults.length > 1 && (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">
                Select Employee
              </label>
              <div className="relative w-full">
                <select
                  className="appearance-none w-full bg-white/5 border border-white/20 text-gray-100 px-4 py-3 rounded-md backdrop-blur-md transition-all duration-300 text-sm shadow-sm pr-10 outline-none"
                  value={foundEmployee?.id || ""}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);

                    // Get employee from employeeMap, fallback to searchResults
                    const selectedEmployee =
                      employeeMap[selectedId] ||
                      searchResults.find((emp) => emp.id === selectedId) ||
                      null;

                    if (selectedEmployee) {
                      // Merge with persisted timestamps from localStorage
                      const timestamps = getEmployeeTimestamps(
                        selectedEmployee.id
                      );
                      setFoundEmployee({ ...selectedEmployee, ...timestamps });
                    } else {
                      setFoundEmployee(null);
                    }
                  }}
                >
                  {employeeOptions}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEE CARD */}
          {foundEmployee ? (
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
                      <p className="text-xs text-gray-400 uppercase">Role</p>
                      <p className="text-cyan-500">
                        {foundEmployee.jobPosition}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <EmployeeBadge status={foundEmployee.status} />
                </div>
              </div>

              {/* LAST CHECK-IN / CHECK-OUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Last Check-In</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {foundEmployee.lastCheckIn
                      ? formatTime(new Date(foundEmployee.lastCheckIn))
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Last Check-Out</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {foundEmployee.lastCheckOut
                      ? formatTime(new Date(foundEmployee.lastCheckOut))
                      : "--"}
                  </p>
                </div>
              </div>

              {/* CHECK-IN / CHECK-OUT BUTTON */}
              <Button
                onClick={handleCheckInOut}
                disabled={isProcessing || remainingTime > 0 || !foundEmployee}
                size="lg"
                className={`w-full h-14 text-lg font-semibold gap-2 transition-all duration-300 ${
                  foundEmployee?.status === "in"
                    ? "bg-gradient-to-r from-rose-600 to-rose-400 hover:opacity-90"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : remainingTime > 0 ? (
                  `${remainingTime}s`
                ) : foundEmployee?.status === "in" ? (
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
          ) : !isSearching ? (
            <div className="text-center py-12 text-gray-500 animate-fade-in">
              <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">
                Start by searching your name or ID
              </p>
              <p className="text-sm mt-2 text-gray-400">
                and mark your attendance instantly
              </p>
            </div>
          ) : null}
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
