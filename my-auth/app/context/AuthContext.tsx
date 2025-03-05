"use client";
import { useContext, createContext, useState, ReactNode } from "react";
import jwt from "jsonwebtoken";

interface AuthContextType {
    user: { id: string; email: string } | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);

    // Login function
    const login = (token: string) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
            setUser(decoded);
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Invalid token:", error instanceof Error ? error.message : "Unknown error");
            setUser(null);
        }
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