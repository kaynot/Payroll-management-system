import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DashboardLayout from "./components/template/sidenav";
import Dashboard from "./components/Pages/Dashboard";
import { SignIn } from "./components/Pages/SignIn";

function App() {
  return (
    <div>
      {/* <DashboardLayout /> */}
      {/* <Dashboard /> */}
      <SignIn />
    </div>
  );
}

export default App;
