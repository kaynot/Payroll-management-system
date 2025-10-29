// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  id: number;
  userName: string;
  email: string;
}

interface AuthContextTypes {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextTypes>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[Auth] Checking stored user...");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // ✅ Validate user data before trusting it
        if (parsed?.id && parsed?.email) {
          console.log("[Auth] Restoring valid user:", parsed);
          setUser(parsed);
        } else {
          console.warn("[Auth] Invalid stored user — clearing localStorage");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("[Auth] Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: UserData) => {
    console.log("[Auth] Logging in:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("[Auth] Logging out...");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
