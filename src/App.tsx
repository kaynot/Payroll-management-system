// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./components/Pages/Dashboard";
import SignIn from "./components/Pages/SignIn";
import HR from "./components/Pages/HR";
import Reports from "./components/Pages/Reports";
import Settings from "./components/Pages/Settings";
import { Attendance } from "./components/Pages/Attendance";
import Payroll from "./components/Pages/Payroll";

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
          {/* Public route */}
          <Route path="/login" element={<SignIn />} />

          {/* Protected Dashboard */}
          <Route
            path="/"
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

          {/* 404 / Access denied */}
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
                  <a href="/login" className="text-primary underline">
                    login
                  </a>{" "}
                  to access the dashboard.
                </p>
              </main>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
