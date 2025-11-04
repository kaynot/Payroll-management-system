// src/components/Pages/SignIn.tsx
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

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posting] = useCrudFunc();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await posting("Auth/Login", {
        userNameOrEmail: email,
        password,
      });

      const status = response?.data?.statusCode;
      if (status === 200) {
        const userData = response?.data?.data?.user;
        login(userData);

        // Success toast
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response?.data?.message || "Login failed. Try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
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
              <label htmlFor="email" className="text-sm font-semibold">
                Username or Email
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-6 px-4 border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="*****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-6 px-4 border focus:border-primary transition-colors"
              />
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

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Innorik Ltd.
            </span>
          </p>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
