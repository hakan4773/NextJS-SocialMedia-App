"use client";
import { useContext, createContext, useState, ReactNode } from "react";

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
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);


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