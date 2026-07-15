"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  mobile?: string;
  role: "guest" | "user";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Default to guest state
  const [user, setUser] = useState<User | null>({
    id: "guest",
    name: "Guest User",
    email: "",
    role: "guest",
  });

  // Fetch session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success && data.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.mobile,
            mobile: data.user.mobile,
            role: data.user.role as "user",
          });
        } else {
          setUser({
            id: "guest",
            name: "Guest User",
            email: "",
            role: "guest",
          });
        }
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // Real login
  const login = async (data: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Invalid credentials.");
    }

    setUser({
      id: result.user.id,
      name: result.user.name,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.mobile,
      mobile: result.user.mobile,
      role: result.user.role as "user",
    });
    
    toast({
      title: "Welcome Back",
      description: "You have successfully logged in.",
      className: "bg-emerald-500 text-white border-emerald-400",
    });
    
    router.push("/profile");
  };

  // Real register
  const register = async (data: any) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.phone || data.mobile,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Registration failed.");
    }

    setUser({
      id: result.user.id,
      name: result.user.name,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.mobile,
      mobile: result.user.mobile,
      role: result.user.role as "user",
    });
    
    toast({
      title: "Account Created",
      description: "Your luxury account has been setup successfully.",
      className: "bg-emerald-500 text-white border-emerald-400",
    });
    
    router.push("/profile");
  };

  // Logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    }

    setUser({
      id: "guest",
      name: "Guest User",
      email: "",
      role: "guest",
    });
    
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
      className: "bg-card text-foreground border-border",
    });
    
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user?.role === "user", login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
