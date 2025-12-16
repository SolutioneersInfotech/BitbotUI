
import { createContext, ReactNode, useContext, useState } from "react";
import { useLocation } from "wouter";

type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  id?: string;        // Auth service ID
  authId?: string;    // Backend sync ID
};

type LoginData = { email: string; password: string };
type RegisterData = { email: string; password: string; firstName: string; lastName: string };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginData) => Promise<boolean>;
  logout: () => void;
  register: (credentials: RegisterData) => Promise<boolean>;
};

const AUTH_BASE_URL = "https://auth-service-4fv5.onrender.com";
const PROJECT_ID = "Bitbot1";
const MAIN_BACKEND = "http://localhost:3000";

export const AuthContext = createContext<AuthContextType | null>(null);

// ---------------- SYNC USER TO MAIN BACKEND ----------------
// const syncUserToMainBackend = async (authUser: User) => {
//   try {
//     await fetch(`${MAIN_BACKEND}/api/user/sync`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: authUser.email,
//         firstName: authUser.firstName || "",
//         lastName: authUser.lastName || "",
//         authId: authUser.authId || authUser.id, // ⭐ FINAL FIX
//       }),
//     });
//   } catch (err) {
//     console.log("⚠ User sync failed:", err);
//   }
// };
const syncUserToMainBackend = async (authUser: User) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${MAIN_BACKEND}/api/user/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 SAME AUTH
      },
      body: JSON.stringify({
        email: authUser.email,
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
      }),
    });
  } catch (err) {
    console.log("⚠ User sync failed:", err);
  }
};

// -----------------------------------------------------------------

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

  // ---------------- LOGIN ----------------
  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, projectId: PROJECT_ID }),
      });

      const json = await res.json();
      console.log("Auth login response:", json);

      if (res.ok && json.token) {
        localStorage.setItem("token", json.token);

        const newUser: User = {
          ...json.user,
          authId: json.user.id, // ⭐ FINAL FIX
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setError(null);

        // Sync to main backend
        await syncUserToMainBackend(newUser);

        setLocation("/");
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
  // -----------------------------------------------------

  // ---------------- REGISTER ----------------
  const register = async (credentials: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const res = await fetch(`${AUTH_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, projectId: PROJECT_ID }),
      });

      const json = await res.json();

      if (res.ok) {
        await login({ email: credentials.email, password: credentials.password });
        setLocation("/");
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
  // ------------------------------------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/auth");
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

