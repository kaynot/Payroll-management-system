import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages and layoutss
import Dashboard from "./components/Pages/Dashboard";
import SignIn from "./components/Pages/SignIn";
import HR from "./components/Pages/HR";
import Reports from "./components/Pages/Reports";
import Settings from "./components/Pages/Settings";
import { Attendance } from "./components/Pages/Attendance";
import DashboardLayout from "./components/template/sidenav";
import Payroll from "./components/Pages/Payroll";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<SignIn />} />

          {/* Protected dashboard layout with nested routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="hr"
              element={
                <ProtectedRoute>
                  <HR />
                </ProtectedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="payroll"
              element={
                <ProtectedRoute>
                  <Payroll />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Optional 404 route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
