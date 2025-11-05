// src/components/Pages/SignUp.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCrudFunc } from "../hooks/crud";
import { Button } from "../ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Input } from "../ui/input";
import AuthLayout from "../Auth/AuthLayout";
import AuthLogo from "../Auth/AuthLogo";
import Loader from "../Auth/Loader";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [posting] = useCrudFunc();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    surName: "",
  });

  const updateState = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
  console.log("Form", form);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await posting("Auth/Register", {
        userName: form.userName,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        surName: form.surName,
      });

      const message = response?.data?.message || "";

      // Registration successful
      if (response?.status === 200 || response?.status === 201) {
        toast.success("🎉 Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
      // Backend returned a known message (e.g., email or username conflict)
      else if (message.includes("email")) {
        toast.error("Email already exists! Try a different one.");
      } else if (message.includes("username") || message.includes("userName")) {
        toast.error("Username already exists! Choose a different one.");
      } else {
        toast.error(message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      // Server returned conflict (409)
      if (error.response?.status === 409) {
        const errMsg = error.response?.data?.message?.toLowerCase() || "";
        if (errMsg.includes("email")) {
          toast.error("Email is already registered.");
        } else if (errMsg.includes("username") || errMsg.includes("user")) {
          toast.error("Username is already taken.");
        } else {
          toast.error("Account already exists.");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="space-y-6 text-center pb-8 pt-10 ">
        <AuthLogo />
        <div className="space-y-2">
          <CardTitle className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join{" "}
            <span className="font-semibold text-foreground">
              Innorik's Payroll System
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        <form onSubmit={handleRegister} className="space-y-8">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-semibold">
                Username
              </label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Choose a username"
                value={form.userName}
                onChange={(e: any) => {
                  updateState("userName", e.target.value);
                }}
                required
                className="py-6 px-4 border focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-semibold">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e: any) => {
                    updateState("firstName", e.target.value);
                  }}
                  required
                  className="py-6 px-4 border focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="surName" className="text-sm font-semibold">
                  Surname
                </label>
                <Input
                  id="surName"
                  name="surName"
                  type="text"
                  placeholder="Surname"
                  value={form.surName}
                  onChange={(e: any) => {
                    updateState("surName", e.target.value);
                  }}
                  required
                  className="py-6 px-4 border focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e: any) => {
                  updateState("email", e.target.value);
                }}
                required
                className="py-6 px-4 border focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*****"
                  value={form.password}
                  onChange={(e: any) => {
                    updateState("password", e.target.value);
                  }}
                  required
                  className="py-6 px-4 border focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="*****"
                  value={form.confirmPassword}
                  onChange={(e: any) => {
                    updateState("confirmPassword", e.target.value);
                  }}
                  required
                  className="py-6 px-4 border focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-heading font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader text="Creating account..." /> : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
