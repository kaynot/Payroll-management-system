import React from "react";
import logo from "../../assets/icon.ico";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background flex flex-1 flex-col justify-center items-center font-poppins w-full h-screen">
      <div className="bg-card flex flex-col items-center rounded-md p-8 border-[1px] shadow-xl">
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

        <div className="flex flex-col w-96 gap-8">
          <form action="submit" method="post" className="flex flex-col ">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-inter">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="user@example.com"
                  className="py-[10px] px-4 border-[1px] border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-inter">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="py-[10px] px-4 border-[1px] border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
          </form>

          <button
            type="submit"
            className="bg-[#4f46e5] rounded-md py-3 text-white text-sm"
            onClick={() => navigate("/")}
          >
            Sign In
          </button>
        </div>
        <p className="pt-8 text-sm text-gray-600">
          Powered by{" "}
          <span className="font-semibold text-gray-800">Innorik Ltd.</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
