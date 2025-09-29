// import { createContext, ReactNode, useContext } from "react";
// import {
//   useQuery,
//   useMutation,
//   UseMutationResult,
// } from "@tanstack/react-query";
// import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
// import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
// import { useToast } from "@/hooks/use-toast";

// type AuthContextType = {
//   user: SelectUser | null;
//   isLoading: boolean;
//   error: Error | null;
//   loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
//   logoutMutation: UseMutationResult<void, Error, void>;
//   registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
// };

// type LoginData = Pick<InsertUser, "email" | "password">;

// export const AuthContext = createContext<AuthContextType | null>(null);
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const { toast } = useToast();
//   const {
//     data: user,
//     error,
//     isLoading,
//   } = useQuery<SelectUser | undefined, Error>({
//     queryKey: ["/api/user"],
//     queryFn: getQueryFn({ on401: "returnNull" }),
//   });

//   const loginMutation = useMutation({
//     mutationFn: async (credentials: LoginData) => {
//       const res = await apiRequest("POST", "/api/login", credentials);
//       return await res.json();
//     },
//     onSuccess: (user: SelectUser) => {
//       queryClient.setQueryData(["/api/user"], user);
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Login failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (credentials: InsertUser) => {
//       const res = await apiRequest("POST", "/api/register", credentials);
//       return await res.json();
//     },
//     onSuccess: (user: SelectUser) => {
//       queryClient.setQueryData(["/api/user"], user);
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Registration failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       await apiRequest("POST", "/api/logout");
//     },
//     onSuccess: () => {
//       queryClient.setQueryData(["/api/user"], null);
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Logout failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   return (
//     <AuthContext.Provider
//       value={{
//         user: user ?? null,
//         isLoading,
//         error,
//         loginMutation,
//         logoutMutation,
//         registerMutation,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }


import { createContext, ReactNode, useContext, useState } from "react";
import { useLocation } from "wouter";

type User = { email: string; firstName?: string; lastName?: string; _id?: string };

type LoginData = { email: string; password: string };
type RegisterData = { email: string; password: string; firstName: string; lastName: string };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginData) => Promise<boolean>;  // ✅ return success
  logout: () => void;
  register: (credentials: RegisterData) => Promise<boolean>; // ✅ return success
};

const AUTH_BASE_URL = "https://auth-service-4fv5.onrender.com";
const PROJECT_ID = "Bitbot1";



export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  // 🔹 LOGIN
  const login = async (credentials: LoginData): Promise<boolean> => {
    try {

      setIsLoading(true);
      const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, projectId: PROJECT_ID }),
      });

      const json = await res.json();
      if (res.ok && json.token) {
        localStorage.setItem("token", json.token);
        console.log("json.user", json.user);

        localStorage.setItem("user", JSON.stringify(json.user));
        setUser(json.user);
        setError(null);
        console.log("Login successful, redirecting to home...");
        setLocation("/"); // ✅ redirect yahin pe ho raha hai
        return true;
      } else {
        setError(json.message || "Login failed");
        return false;
      }
    } catch {
      setError("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 REGISTER
  const register = async (credentials: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch(`${AUTH_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, projectId: PROJECT_ID }),
      });

      const json = await res.json();
      if (res.ok && json.token) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        setUser(json.user);
        setError(null);
        console.log("Registration successful, redirecting to home...");
        setLocation("/"); // ✅ register ke baad bhi direct redirect
        return true;
      } else {
        setError(json.message || "Registration failed");
        return false;
      }
    } catch {
      setError("Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/auth"); // ✅ logout ke baad auth page pe bhejo
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

