import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [posting] = useCrudFunc();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const updateState = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await posting("Auth/Login", {
        userNameOrEmail: form.emailOrUsername.trim(),
        password: form.password.trim(),
      });

      const status = response?.data?.statusCode;
      const message = response?.data?.message?.toLowerCase() || "";

      if (status === 200) {
        const userData = response?.data?.data?.user;
        login(userData);

        toast.success("Login successful! Redirecting...", {
          description: `Welcome back, ${userData?.firstName || "User"} 👋`,
          duration: 3000,
        });

        // Redirect to dashboard after login
        setTimeout(() => navigate("/dashboard"), 1500);
      } else if (message.includes("invalid") || message.includes("incorrect")) {
        toast.error("Invalid username or password!");
      } else if (message.includes("not found")) {
        toast.error("User not found! Please register first.");
      } else {
        toast.error(response?.data?.message || "Login failed. Try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errMsg = error.response?.data?.message?.toLowerCase() || "";

      if (errMsg.includes("invalid credentials")) {
        toast.error("Invalid username or password.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="space-y-6 text-center pb-8 pt-10">
        <AuthLogo />
        <div className="space-y-2">
          <CardTitle className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to{" "}
            <span className="font-semibold text-foreground">
              Innorik's Payroll System
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label
                htmlFor="emailOrUsername"
                className="text-sm font-semibold"
              >
                Username or Email
              </label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="Enter your username or email"
                value={form.emailOrUsername}
                onChange={(e: any) =>
                  updateState("emailOrUsername", e.target.value)
                }
                required
                className="py-6 px-4 border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateState("password", e.target.value)}
                  required
                  className="py-6 px-4 pr-10 border focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("#")}
                className="text-sm text-primary font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-heading font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader text="Signing in..." /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          Don’t have an account yet?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Innorik Ltd.
          </span>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
