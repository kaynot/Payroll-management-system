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

    // Simple validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Simulate backend login success (replace this later with API)
    login({ id: 1, userName: "", email });
    navigate("/");
  };

  return (
    <div className="bg-background flex flex-1 flex-col justify-center items-center font-poppins w-full h-screen">
      <div className="bg-card flex flex-col items-center rounded-md p-8 border-[1px] shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center pb-12">
          <div className="bg-gradient-to-br from-[#4f46e5] to-[#0ea5e9] p-4 rounded-xl text-white font-semibold text-sm">
            <img src={logo} alt="innorik-logo" className="w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold font-poppins text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-400 font-inter">
              Sign in to Innorik's Payroll System
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col w-96 gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-inter">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="py-[10px] px-4 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-inter">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-[10px] px-4 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#4f46e5] rounded-md py-3 text-white text-sm hover:bg-indigo-600 transition"
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
