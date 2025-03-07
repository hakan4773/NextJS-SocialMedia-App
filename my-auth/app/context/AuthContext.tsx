"use client";
import { useRouter } from "next/navigation";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
    user: { id: string; email: string } | null;
    login: (userData: { id: string; email: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const router=useRouter();
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
      
        if (token) {
          fetch("/api/protected", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.user) {
                setUser(data.user);
              } else {
                localStorage.removeItem("token");
                setUser(null);
              }
            })
            .catch((err) => console.error("Fetch error:", err));
        } else {
          setUser(null);
        }
      }, []);
      
    // Login function
    const login = (userData: { id: string; email: string }) => {
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user ,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};