import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [posting] = useCrudFunc();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const updateState = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await posting("Auth/Login", {
        userNameOrEmail: form.emailOrUsername.trim(),
        password: form.password.trim(),
      });

      const { statusCode, message, data } = response?.data || {};
      const msg = message?.toLowerCase() || "";

      // SUCCESS
      if (statusCode === 200 && data?.user && data?.token?.token) {
        const user = data.user;
        const token = data.token.token;

        login(user, token);

        toast.success("Login successful!", {
          description: `Welcome back, ${user.firstName || "User"} 👋`,
        });

        const redirectTo =
          (location.state as any)?.from?.pathname || "/dashboard";

        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
        return;
      }

      // HANDLE EXPECTED LOGIN FAILURES
      const authFailureTexts = [
        "wrong username or password",
        "invalid",
        "incorrect",
        "unauthorized",
        "credentials",
      ];

      if (authFailureTexts.some((m) => msg.includes(m)) || statusCode === 401) {
        toast.error("Invalid username or password.");
        return;
      }

      // USER NOT FOUND
      if (msg.includes("not found")) {
        toast.error("User not found. Please register first.");
        return;
      }

      // OTHER API ERRORS
      toast.error(message || "Login failed. Try again.");
    } catch (error: any) {
      console.error("Login error:", error);

      const status = error.response?.status;
      const backendMsg = error.response?.data?.message?.toLowerCase() || "";

      const authFailureTexts = [
        "wrong username or password",
        "invalid",
        "incorrect",
        "credentials",
        "unauthorized",
      ];

      if (
        authFailureTexts.some((m) => backendMsg.includes(m)) ||
        status === 401
      ) {
        toast.error("Invalid username or password.");
      } else if (status >= 500) {
        // Server-side error
        toast.error("Server error. Please try again later.");
      } else if (!status) {
        // Network error / no response
        toast.error("Network error. Check your connection.");
      } else {
        // Other API errors
        toast.error(
          backendMsg || "Something went wrong. Please try again later."
        );
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
                onChange={(e) => updateState("emailOrUsername", e.target.value)}
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
