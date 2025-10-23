import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages and layouts
// import {DashboardLayout} from "./components/template/Sidenav";
import Dashboard from "./components/Pages/Dashboard";
import SignIn from "./components/Pages/SignIn";
import HR from "./components/Pages/HR";
// import Payroll from "./components/Pages/Payroll";
// import Attendance from "./components/Pages/Attendance";
import Reports from "./components/Pages/Reports";
import Settings from "./components/Pages/Settings";
import { Attendance } from "./components/Pages/Attendance";
import { Payroll } from "./components/Pages/Payroll";
import DashboardLayout from "./components/template/sidenav";

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<SignIn />} />

        {/* Protected dashboard layout with nested routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hr" element={<HR />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional 404 route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};
