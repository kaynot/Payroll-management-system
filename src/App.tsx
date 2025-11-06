import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "sonner";

// Pages
import Dashboard from "./components/Pages/Dashboard";
import SignIn from "./components/Pages/SignIn";
import HR from "./components/Pages/HR";
import Reports from "./components/Pages/Reports";
import Settings from "./components/Pages/Settings";
import Attendance from "./components/Pages/Attendance";
import Payroll from "./components/Pages/Payroll";
import EmployeeCheckin from "./components/Pages/EmployeeCheckIn";
import SignUp from "./components/Pages/SignUp";

// Layout & Auth
import DashboardLayout from "./components/template/sidenav";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Assets
import Access from "./assets/access_denied-removebg-preview.png";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/employee-checkin" element={<EmployeeCheckin />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hr" element={<HR />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <main className="flex flex-col justify-center items-center gap-4 h-screen text-center">
                <img
                  src={Access}
                  alt="access denied"
                  className="w-auto max-w-sm"
                />
                <h1 className="text-5xl font-bold">Access Denied!</h1>
                <p className="text-muted-foreground">
                  Kindly{" "}
                  <a href="/" className="text-primary underline">
                    login
                  </a>{" "}
                  to access the dashboard.
                </p>
              </main>
            }
          />
        </Routes>

        {/* Global Toaster */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "8px", fontFamily: "Inter" },
            classNames: {
              success: "bg-green-50 border-green-400 text-green-800",
              error: "bg-red-50 border-red-400 text-red-800",
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};
