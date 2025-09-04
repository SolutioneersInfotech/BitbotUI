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

type User = { email: string };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginData) => void;
  logout: () => void;
  register: (credentials: LoginData) => void;
};

type LoginData = { email: string; password: string };

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = (credentials: LoginData) => {
    try {
      setIsLoading(true);
      // ✅ Fake login – no backend call
      setUser({ email: credentials.email });
      setError(null);
    } catch (err) {
      setError(new Error("Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const register = (credentials: LoginData) => {
    try {
      setIsLoading(true);
      // ✅ Fake register – no backend call
      setUser({ email: credentials.email });
      setError(null);
    } catch (err) {
      setError(new Error("Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
