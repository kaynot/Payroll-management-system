// src/components/Pages/SignIn.tsx
import logo from "../../assets/icon.ico";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // 🔐 Simulated authentication (replace later with API call)
    login({ id: 1, userName: "Demo User", email });
    navigate("/");
  };

  return (
    <div className="bg-background flex flex-1 flex-col justify-center items-center font-poppins w-full h-screen">
      <div className="bg-card flex flex-col items-center rounded-md p-8 border shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center pb-12">
          <div className="bg-gradient-to-br from-indigo-600 to-sky-500 p-4 rounded-xl text-white font-semibold text-sm">
            <img src={logo} alt="innorik-logo" className="w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-400">Sign in to Innorik’s Payroll System</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col w-96 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 rounded-md py-3 text-white text-sm hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="pt-8 text-sm text-gray-600">
          Powered by{" "}
          <span className="font-semibold text-gray-800">Innorik Ltd.</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
